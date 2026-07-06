"use client"
import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { deleteMatiere } from "@/app/admin/matieres/actions"
import { toast } from "@/components/ui/Toast"

type Props = {
  id: string
  nom: string
  hasEpreuves: boolean
}

export default function DeleteMatiereButton({ 
  id, nom, hasEpreuves 
}: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (hasEpreuves) {
      toast.error(
        `Impossible : "${nom}" a des épreuves. ` +
        `Supprimez-les d'abord.`
      )
      return
    }

    if (!confirm(
      `Supprimer la matière "${nom}" ?`
    )) return

    setLoading(true)
    const result = await deleteMatiere(id)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Matière supprimée")
      window.location.reload()
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 text-slate-400 
        hover:text-red-600 hover:bg-red-50
        rounded-lg transition-all duration-200
        disabled:opacity-50"
      title={hasEpreuves 
        ? "A des épreuves — non supprimable"
        : "Supprimer"
      }
    >
      {loading 
        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
        : <Trash2 className="w-3.5 h-3.5" />
      }
    </button>
  )
}
