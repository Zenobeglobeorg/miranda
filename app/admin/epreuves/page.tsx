import Link from "next/link"
import { withDB } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/helpers"
import { Plus, Pencil, BookOpen } from "lucide-react"
import { togglePublishEpreuve } from "@/app/admin/epreuves/actions"
import { DeleteEpreuveButton } from "@/app/admin/epreuves/DeleteEpreuveButton"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminEpreuvesPage() {
  await requireAdmin()
  const epreuves = await withDB((db) =>
    db.epreuve.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        filiereNiveau: {
          include: {
            filiere: { select: { code: true, couleur: true } },
            niveau: { select: { numero: true, label: true } },
          },
        },
        matiere: { select: { nom: true } },
      },
    })
  )

  const typeLabels: Record<string, string> = {
    CONCOURS: "Concours",
    CC: "CC",
    SN: "SN",
    EPREUVE_SIMPLE: "Épreuve simple",
  }

  return (
    <div className="w-full space-y-4 md:space-y-6">
      {/* Header responsive */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-slate-900">
            Épreuves
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-0.5">
            {epreuves.length} épreuve(s)
          </p>
        </div>
        <Link
          href="/admin/epreuves/add"
          className="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-slate-900 text-white rounded-xl text-xs md:text-sm font-medium hover:bg-slate-700 transition-all duration-200 whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
          Ajouter
        </Link>
      </div>

      {/* Table avec scroll horizontal */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="border-b border-slate-100 bg-white sticky top-0 z-10">
              <tr>
                {["Titre", "Filière", "Niveau", "Matière", "Type", "Accès", "Corrigé", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {epreuves.map((ep) => (
                <tr
                  key={ep.id}
                  className="hover:bg-slate-50 transition-colors duration-150 group"
                >
                  <td className="px-4 py-3.5 font-medium text-slate-900 max-w-[180px]">
                    <p className="truncate" title={ep.titre}>
                      {ep.titre}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold text-white"
                      style={{
                        backgroundColor: ep.filiereNiveau.filiere.couleur,
                      }}
                    >
                      {ep.filiereNiveau.filiere.code}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                    {ep.filiereNiveau.niveau.label ?? `N${ep.filiereNiveau.niveau.numero}`}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                    {ep.matiere?.nom ?? "—"}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                    {typeLabels[ep.type] ?? ep.type}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${
                        ep.isGratuit
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {ep.isGratuit ? "Gratuit" : "Payant"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {ep.fichierCorrige ? (
                      <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700">
                        ✓ Oui
                      </span>
                    ) : (
                      <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-600">
                        ✗ Non
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/epreuves/${ep.id}/edit`}
                        className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                        title="Modifier"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <form
                        action={togglePublishEpreuve.bind(null, ep.id, ep.isPublished)}
                        className="inline"
                      >
                        <button
                          type="submit"
                          title={ep.isPublished ? "Dépublier" : "Publier"}
                          className="text-xs px-2.5 py-1 rounded-lg font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all duration-200"
                        >
                          {ep.isPublished ? "Publié" : "Brouillon"}
                        </button>
                      </form>
                      <DeleteEpreuveButton id={ep.id} titre={ep.titre} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

        {epreuves.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aucune épreuve</p>
          </div>
        )}
      </div>
    </div>
  )
}
