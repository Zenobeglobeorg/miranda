"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { toast } from "@/components/ui/Toast"
import {
  ArrowLeft,
  FileText,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Save,
} from "lucide-react"

type Filiere = {
  id: string
  code: string
  nom: string
  filiereNiveaux: Array<{
    id: string
    filiereId: string
    niveauId: number
    niveau: { id: number; numero: number; label: string }
  }>
}

type Matiere = { id: string; nom: string; filiereId: string }

// Plus de NIVEAUX statiques hardcodés

const TYPES_EPREUVE = [
  { value: "EPREUVE_SIMPLE", label: "Épreuve simple" },
  { value: "CONCOURS", label: "Concours" },
  { value: "CC", label: "CC" },
  { value: "SN", label: "SN" },
] as const

export default function AdminEpreuvesAddPage() {
  const router = useRouter()
  const [filieres, setFilieres] = useState<Filiere[]>([])
  const [matieres, setMatieres] = useState<Matiere[]>([])
  const [loadingFilieres, setLoadingFilieres] = useState(true)
  const [loadingMatieres, setLoadingMatieres] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [titre, setTitre] = useState("")
  const [niveau, setNiveau] = useState<number>(1)
  const [filiereCode, setFiliereCode] = useState("")
  const [matiereId, setMatiereId] = useState("")
  const [type, setType] = useState<(typeof TYPES_EPREUVE)[number]["value"]>("EPREUVE_SIMPLE")
  const [annee, setAnnee] = useState<number>(new Date().getFullYear())
  const [fileEpreuve, setFileEpreuve] = useState<File | null>(null)
  const [fileCorrige, setFileCorrige] = useState<File | null>(null)
  const [isGratuit, setIsGratuit] = useState(false)

  // Charger les filières au montage
  useEffect(() => {
    let cancelled = false
    async function fetchFilieres() {
      setLoadingFilieres(true)
      try {
        const res = await fetch("/api/filieres")
        if (!res.ok) throw new Error("Impossible de charger les filières")
        const data = await res.json()
        console.log("Filières reçues:", data)
        if (!cancelled) {
          setFilieres(Array.isArray(data) ? data : [])
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erreur filières")
      } finally {
        if (!cancelled) setLoadingFilieres(false)
      }
    }
    fetchFilieres()
    return () => {
      cancelled = true
    }
  }, [])

  // Charger les matières quand la filière change (par code)
  useEffect(() => {
    if (!filiereCode) {
      setMatieres([])
      setMatiereId("")
      return
    }
    setLoadingMatieres(true)
    setMatiereId("")
    fetch(`/api/matieres?filiere=${encodeURIComponent(filiereCode)}`)
      .then((r) => r.json())
      .then((data) => setMatieres(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoadingMatieres(false))
  }, [filiereCode])

  // Déduire filiereId et filiereNiveauId à partir du code filière et du niveau
  const selectedFiliere = filiereCode ? filieres.find((f) => f.code === filiereCode) : null
  const filiereId = selectedFiliere?.id ?? ""
  const filiereNiveauId =
    selectedFiliere?.filiereNiveaux?.find((fn) => fn.niveau?.numero === niveau)?.id ?? ""

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    if (!fileEpreuve) {
      setFieldErrors((prev) => ({ ...prev, fileEpreuve: "Le fichier épreuve PDF est obligatoire." }))
      return
    }
    if (!filiereNiveauId) {
      setFieldErrors((prev) => ({ ...prev, filiere: "Veuillez sélectionner une filière et un niveau valides." }))
      return
    }
    if (!matiereId) {
      setFieldErrors((prev) => ({ ...prev, matiere: "Veuillez sélectionner une matière." }))
      return
    }
    if (!titre.trim()) {
      setFieldErrors((prev) => ({ ...prev, titre: "Le titre est obligatoire." }))
      return
    }

    setSubmitLoading(true)
    try {
      // 1. Upload PDF épreuve
      const formEpreuve = new FormData()
      formEpreuve.set("file", fileEpreuve)
      formEpreuve.set("type", "epreuve")
      const uploadEpreuve = await fetch("/api/upload", {
        method: "POST",
        body: formEpreuve,
      })
      const bodyEpreuve = await uploadEpreuve.json()
      if (!uploadEpreuve.ok) {
        throw new Error(bodyEpreuve?.error ?? "Échec de l'upload de l'épreuve")
      }
      const urlEpreuve = bodyEpreuve?.url
      if (!urlEpreuve) throw new Error("Réponse upload invalide (épreuve)")

      let urlCorrige: string | null = null
      if (fileCorrige) {
        const formCorrige = new FormData()
        formCorrige.set("file", fileCorrige)
        formCorrige.set("type", "corrige")
        const uploadCorrige = await fetch("/api/upload", {
          method: "POST",
          body: formCorrige,
        })
        const bodyCorrige = await uploadCorrige.json()
        if (!uploadCorrige.ok) {
          throw new Error(bodyCorrige?.error ?? "Échec de l'upload du corrigé")
        }
        urlCorrige = bodyCorrige?.url ?? null
      }

      const payload = {
        titre: titre.trim(),
        type,
        fichierEpreuve: urlEpreuve,
        fichierCorrige: urlCorrige,
        isGratuit: isGratuit,
        isPublished: true,
        filiereNiveauId,
        filiereCode,
        niveauNumero: niveau,
        matiereId,
      }

      // Enregistrement en base uniquement après les uploads Cloudinary (évite timeout Prisma/Neon)
      const createRes = await fetch("/api/epreuves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const createData = await createRes.json()
      console.log("Réponse API:", createData)

      if (!createRes.ok) {
        const errMsg = createData?.error?.formErrors?.[0] ?? createData?.error ?? "Erreur lors de l'ajout"
        toast.error(typeof errMsg === "string" ? errMsg : "Erreur lors de l'ajout")
        setError(typeof errMsg === "string" ? errMsg : "Erreur création épreuve")
        setSubmitLoading(false)
        return
      }

      toast.success("Épreuve créée avec succès !")
      setSuccess(true)
      setTimeout(() => router.push("/admin/epreuves"), 1500)
    } catch (err) {
      console.error("Erreur soumission formulaire:", err)
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/epreuves"
          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-900">
            Ajouter une épreuve
          </h1>
          <p className="text-slate-400 text-xs md:text-sm">
            Remplissez tous les champs requis
          </p>
        </div>
      </div>

      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>Épreuve créée. Redirection…</span>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-4 md:p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Titre *</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-slate-900 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all duration-200"
            placeholder="Ex. Mathématiques – Algèbre"
          />
          {fieldErrors.titre && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.titre}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Filière *</label>
            <select
              value={filiereCode}
              onChange={(e) => {
                const code = e.target.value
                setFiliereCode(code)
                const selected = filieres.find((f) => f.code === code)
                if (selected && selected.filiereNiveaux && selected.filiereNiveaux.length > 0) {
                  setNiveau(selected.filiereNiveaux[0].niveau.numero)
                }
              }}
              disabled={loadingFilieres}
              className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-slate-900 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all duration-200 disabled:opacity-50"
            >
              <option value="">Choisir une filière</option>
              {filieres.map((f) => (
                <option key={f.id} value={f.code}>
                  {f.code} — {f.nom}
                </option>
              ))}
            </select>
            {!loadingFilieres && filieres.length === 0 && (
              <p className="mt-1 text-sm text-amber-600">
                Aucune filière. Exécutez le script : npx tsx scripts/seed-filieres.ts
              </p>
            )}
            {fieldErrors.filiere && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.filiere}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Niveau *</label>
            <select
              value={niveau}
              onChange={(e) => setNiveau(Number(e.target.value))}
              disabled={!filiereCode}
              className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-slate-900 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all duration-200 disabled:opacity-50"
            >
              {!filiereCode && <option value="">Choisir d'abord une filière</option>}
              {selectedFiliere?.filiereNiveaux.map((fn) => (
                <option key={fn.id} value={fn.niveau.numero}>
                  {fn.niveau.label ?? `Niveau ${fn.niveau.numero}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Matière *</label>
          <select
            value={matiereId}
            onChange={(e) => setMatiereId(e.target.value)}
            disabled={!filiereCode || loadingMatieres}
            className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-slate-900 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all duration-200 disabled:opacity-50"
          >
            <option value="">Choisir une matière</option>
            {matieres.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nom}
              </option>
            ))}
          </select>
          {fieldErrors.matiere && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.matiere}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as (typeof TYPES_EPREUVE)[number]["value"])}
              className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-slate-900 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all duration-200"
            >
              {TYPES_EPREUVE.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Année</label>
            <input
              type="number"
              value={annee}
              onChange={(e) => setAnnee(Number(e.target.value) || new Date().getFullYear())}
              min={2000}
              max={2100}
              className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-slate-900 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Fichier épreuve PDF *
          </label>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-slate-400 transition-all duration-200">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFileEpreuve(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-700 file:cursor-pointer"
            />
          </div>
          {fieldErrors.fileEpreuve && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.fileEpreuve}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Fichier corrigé PDF (optionnel)
          </label>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-slate-400 transition-all duration-200">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFileCorrige(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-700 file:cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isGratuit"
            checked={isGratuit}
            onChange={(e) => setIsGratuit(e.target.checked)}
            className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          <label htmlFor="isGratuit" className="text-sm font-medium text-slate-700">
            Épreuve gratuite
          </label>
        </div>

        {/* Boutons sticky mobile */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={submitLoading}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-slate-700 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            {submitLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Enregistrer
              </>
            )}
          </button>
          <Link
            href="/admin/epreuves"
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-all duration-200"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}
