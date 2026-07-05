"use client"
import { useState } from "react"
import { 
  Plus, Trash2, ChevronDown, ChevronUp,
  Layers, Check, X, Loader2
} from "lucide-react"
import { 
  ajouterNiveauFiliere,
  supprimerNiveauFiliere,
  creerFiliere,
  creerNiveau,
  supprimerFiliere
} from "./actions"
import { toast } from "@/components/ui/Toast"

type Niveau = {
  id: number
  numero: number
  label: string
}

type FiliereNiveau = {
  id: string
  niveau: Niveau
}

type Filiere = {
  id: string
  code: string
  nom: string
  couleur: string
  filiereNiveaux: FiliereNiveau[]
}

type Props = {
  filieres: Filiere[]
  niveaux: Niveau[]
}

export default function FilieresManager({ 
  filieres: initialFilieres,
  niveaux: allNiveaux
}: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  // Form nouvelle filière
  const [showNewFiliere, setShowNewFiliere] = useState(false)
  const [newFiliere, setNewFiliere] = useState({
    code: "", nom: "", couleur: "#3b82f6"
  })

  // Form nouveau niveau global
  const [showNewNiveau, setShowNewNiveau] = useState(false)
  const [newNiveau, setNewNiveau] = useState({
    numero: "", label: ""
  })

  async function handleAjouterNiveau(
    filiereId: string, 
    niveauId: number
  ) {
    setLoadingId(filiereId + niveauId)
    const result = await ajouterNiveauFiliere(
      filiereId, niveauId
    )
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Niveau ajouté !")
      // Refresh data
      window.location.reload()
    }
    setLoadingId(null)
  }

  async function handleSupprimerNiveau(
    filiereNiveauId: string,
    label: string
  ) {
    if (!confirm(
      `Supprimer le niveau "${label}" ? ` +
      `Les épreuves associées seront aussi supprimées.`
    )) return

    setLoadingId(filiereNiveauId)
    const result = await supprimerNiveauFiliere(
      filiereNiveauId
    )
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Niveau supprimé")
      window.location.reload()
    }
    setLoadingId(null)
  }

  async function handleCreerFiliere() {
    if (!newFiliere.code || !newFiliere.nom) {
      toast.error("Code et nom requis")
      return
    }
    const result = await creerFiliere(newFiliere)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Filière créée !")
      setShowNewFiliere(false)
      setNewFiliere({ 
        code: "", nom: "", couleur: "#3b82f6" 
      })
      window.location.reload()
    }
  }

  async function handleCreerNiveau() {
    if (!newNiveau.label || !newNiveau.numero) {
      toast.error("Numéro et label requis")
      return
    }
    const result = await creerNiveau({
      numero: parseInt(newNiveau.numero),
      label: newNiveau.label
    })
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Niveau créé !")
      setShowNewNiveau(false)
      setNewNiveau({ numero: "", label: "" })
      window.location.reload()
    }
  }

  async function handleSupprimerFiliere(
    filiereId: string,
    code: string
  ) {
    if (!confirm(
      `Supprimer la filière "${code}" ?\n\n` +
      `ATTENTION : Toutes les épreuves et ` +
      `niveaux associés seront supprimés.`
    )) return

    setLoadingId(filiereId)
    const result = await supprimerFiliere(filiereId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`Filière ${code} supprimée`)
      window.location.reload()
    }
    setLoadingId(null)
  }

  return (
    <div className="space-y-4">

      {/* Actions globales */}
      <div className="flex flex-wrap gap-3 flex-shrink-0">
        <button
          onClick={() => {
            setShowNewFiliere(!showNewFiliere)
            setShowNewNiveau(false)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-700 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Nouvelle filière
        </button>
        <button
          onClick={() => {
            setShowNewNiveau(!showNewNiveau)
            setShowNewFiliere(false)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 ring-1 ring-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all duration-200"
        >
          <Layers className="w-4 h-4" />
          Nouveau niveau
        </button>
      </div>

      {/* Form nouvelle filière */}
      {showNewFiliere && (
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4 border border-slate-100">
          <h3 className="font-semibold text-slate-900">
            Créer une nouvelle filière
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Code
              </label>
              <input
                type="text"
                value={newFiliere.code}
                onChange={e => setNewFiliere({
                  ...newFiliere, 
                  code: e.target.value.toUpperCase()
                })}
                placeholder="ex: SJM"
                maxLength={10}
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-sm ring-1 ring-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Nom complet
              </label>
              <input
                type="text"
                value={newFiliere.nom}
                onChange={e => setNewFiliere({
                  ...newFiliere, nom: e.target.value
                })}
                placeholder="ex: Sciences Juridiques"
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-sm ring-1 ring-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Couleur
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={newFiliere.couleur}
                  onChange={e => setNewFiliere({
                    ...newFiliere, 
                    couleur: e.target.value
                  })}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                />
                <span className="text-sm text-slate-500 font-mono">
                  {newFiliere.couleur}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCreerFiliere}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-700 transition-all duration-200 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Créer
            </button>
            <button
              onClick={() => setShowNewFiliere(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-all duration-200"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Form nouveau niveau */}
      {showNewNiveau && (
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4 border border-slate-100">
          <h3 className="font-semibold text-slate-900">
            Créer un nouveau type de niveau
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Numéro (ordre)
              </label>
              <input
                type="number"
                value={newNiveau.numero}
                onChange={e => setNewNiveau({
                  ...newNiveau, numero: e.target.value
                })}
                placeholder="ex: 4"
                min={1}
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-sm ring-1 ring-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Label affiché
              </label>
              <input
                type="text"
                value={newNiveau.label}
                onChange={e => setNewNiveau({
                  ...newNiveau, label: e.target.value
                })}
                placeholder="ex: Master 1"
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-sm ring-1 ring-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCreerNiveau}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-700 transition-all duration-200 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Créer
            </button>
            <button
              onClick={() => setShowNewNiveau(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-all duration-200"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste filières */}
      <div className="space-y-3 overflow-auto">
        {initialFilieres.map(filiere => {
          const isExpanded = expanded === filiere.id
          
          // Niveaux pas encore dans cette filière
          const niveauxDisponibles = allNiveaux.filter(
            n => !filiere.filiereNiveaux.some(
              fn => fn.niveau.id === n.id
            )
          )

          return (
            <div key={filiere.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              
              {/* Header filière */}
              <div
                onClick={() => setExpanded(
                  isExpanded ? null : filiere.id
                )}
                className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
              >
                <div className="w-1 h-10 rounded-full flex-shrink-0"
                  style={{ 
                    backgroundColor: filiere.couleur 
                  }} 
                />
                <div className="flex-1 text-left">
                  <p className="font-bold text-slate-900">
                    {filiere.code}
                  </p>
                  <p className="text-xs text-slate-400">
                    {filiere.nom}
                  </p>
                </div>
                
                {/* Badges niveaux actuels */}
                <div className="hidden sm:flex flex-wrap gap-1.5 max-w-xs">
                  {filiere.filiereNiveaux.map(fn => (
                    <span
                      key={fn.id}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-white"
                      style={{ 
                        backgroundColor: filiere.couleur 
                      }}
                    >
                      {fn.niveau.label ?? `N${fn.niveau.numero}`}
                    </span>
                  ))}
                </div>

                <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
                  {filiere.filiereNiveaux.length} niveau(x)
                </span>

                {/* Bouton supprimer filière */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSupprimerFiliere(filiere.id, filiere.code)
                  }}
                  disabled={loadingId === filiere.id}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0 disabled:opacity-50"
                  title="Supprimer cette filière"
                >
                  {loadingId === filiere.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>

                {isExpanded 
                  ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                }
              </div>

              {/* Panel expandé */}
              {isExpanded && (
                <div className="border-t border-slate-100 p-5 space-y-5">
                  
                  {/* Niveaux actuels */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                      Niveaux actuels
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {filiere.filiereNiveaux.length === 0
                        ? (
                          <p className="text-sm text-slate-400 italic">
                            Aucun niveau configuré
                          </p>
                        )
                        : filiere.filiereNiveaux.map(fn => (
                          <div
                            key={fn.id}
                            className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl text-sm font-medium text-white"
                            style={{ 
                              backgroundColor: filiere.couleur 
                            }}
                          >
                            {fn.niveau.label ?? `Niveau ${fn.niveau.numero}`}
                            <button
                              onClick={() => 
                                handleSupprimerNiveau(
                                  fn.id,
                                  fn.niveau.label ?? `Niveau ${fn.niveau.numero}`
                                )
                              }
                              disabled={
                                loadingId === fn.id
                              }
                              className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-all duration-150 disabled:opacity-50"
                              title="Supprimer ce niveau"
                            >
                              {loadingId === fn.id 
                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                : <X className="w-3 h-3" />
                              }
                            </button>
                          </div>
                        ))
                      }
                    </div>
                  </div>

                  {/* Ajouter un niveau */}
                  {niveauxDisponibles.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Ajouter un niveau
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {niveauxDisponibles.map(n => (
                          <button
                            key={n.id}
                            onClick={() => 
                              handleAjouterNiveau(
                                filiere.id, n.id
                              )
                            }
                            disabled={
                              loadingId === filiere.id + n.id
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-all duration-150 disabled:opacity-50"
                          >
                            {loadingId === filiere.id + n.id
                              ? <Loader2 className="w-3 h-3 animate-spin" />
                              : <Plus className="w-3 h-3" />
                            }
                            {n.label ?? `Niveau ${n.numero}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {niveauxDisponibles.length === 0 && filiere.filiereNiveaux.length > 0 && (
                    <p className="text-sm text-slate-400 italic">
                      Tous les niveaux disponibles sont déjà assignés à cette filière.
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
