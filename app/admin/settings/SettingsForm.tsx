"use client"

import { useState } from "react"
import { toast } from "@/components/ui/Toast"
import {
  DollarSign,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
} from "lucide-react"
import { saveSettings } from "./actions"

type Props = {
  settings: {
    id: number
    prixAbonnement: number
    contactEmail: string | null
    contactTel: string | null
    contactAdresse: string | null
  } | null
}

export default function SettingsForm({ settings }: Props) {
  const [form, setForm] = useState({
    prixAbonnement: settings?.prixAbonnement ?? 1000,
    contactEmail: settings?.contactEmail ?? "",
    contactTel: settings?.contactTel ?? "",
    contactAdresse: settings?.contactAdresse ?? "",
  })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await saveSettings(form)
      toast.success("Paramètres sauvegardés !")
    } catch {
      toast.error("Erreur lors de la sauvegarde")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-5 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-slate-400" />
          Tarification
        </h2>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Prix abonnement annuel (FCFA)
          </label>
          <input
            type="number"
            value={form.prixAbonnement}
            onChange={(e) =>
              setForm({ ...form, prixAbonnement: Number(e.target.value) })
            }
            className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all duration-200"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-5">
          Coordonnées
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Email de contact
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) =>
                  setForm({ ...form, contactEmail: e.target.value })
                }
                placeholder="mirandaawoulebe@gmail.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all duration-200"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Téléphone / WhatsApp
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={form.contactTel}
                onChange={(e) =>
                  setForm({ ...form, contactTel: e.target.value })
                }
                placeholder="+237 6XX XXX XXX"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all duration-200"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Adresse
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <textarea
                value={form.contactAdresse}
                onChange={(e) =>
                  setForm({ ...form, contactAdresse: e.target.value })
                }
                placeholder="Saint Jean, Cameroun"
                rows={2}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all duration-200 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-slate-100 pt-4 pb-2 z-20">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-slate-700 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-200 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sauvegarde...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Sauvegarder
            </>
          )}
        </button>
      </div>
    </form>
  )
}
