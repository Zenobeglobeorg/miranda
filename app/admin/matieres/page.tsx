import { withDB } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/helpers"
import { BookMarked } from "lucide-react"
import { AddMatiereForm } from "./add-matiere-form"
import { EditMatiereInline } from "./edit-matiere-inline"
import { DeleteMatiereButton } from "./delete-matiere-button"

export const dynamic = "force-dynamic"

export default async function AdminMatieresPage() {
  await requireAdmin()
  const [matieres, filieres] = await withDB((db) =>
    Promise.all([
      db.matiere.findMany({
        include: {
          filiere: { select: { nom: true, code: true, couleur: true } },
          _count: { select: { epreuves: true } },
        },
        orderBy: [{ filiereId: "asc" }, { nom: "asc" }],
      }),
      db.filiere.findMany({
        where: { isActive: true },
        orderBy: { code: "asc" },
        select: { id: true, nom: true, code: true, couleur: true },
      }),
    ])
  )

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-0 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">
            Matières
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Gérer les matières par filière
          </p>
        </div>
      </div>

      <AddMatiereForm filieres={filieres} />

      <div className="bg-white rounded-2xl shadow-sm flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="overflow-auto flex-1">
          <table className="w-full text-sm min-w-[500px]">
            <thead className="sticky top-0 bg-white z-10 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 md:px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Nom
                </th>
                <th className="text-left px-4 md:px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Filière
                </th>
                <th className="text-left px-4 md:px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Nb épreuves
                </th>
                <th className="text-right px-4 md:px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {matieres.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-slate-50 transition-colors duration-150"
                >
                  <td className="px-4 md:px-5 py-3.5 text-slate-900 whitespace-nowrap">
                    <EditMatiereInline id={m.id} initialNom={m.nom} />
                  </td>
                  <td className="px-4 md:px-5 py-3.5 whitespace-nowrap">
                    <span
                      className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium text-white"
                      style={{
                        backgroundColor: m.filiere.couleur || "#64748b",
                      }}
                    >
                      {m.filiere.nom} ({m.filiere.code})
                    </span>
                  </td>
                  <td className="px-4 md:px-5 py-3.5 text-slate-600 whitespace-nowrap">
                    {m._count.epreuves}
                  </td>
                  <td className="px-4 md:px-5 py-3.5 text-right whitespace-nowrap">
                    <DeleteMatiereButton
                      matiereId={m.id}
                      matiereNom={m.nom}
                      epreuvesCount={m._count.epreuves}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {matieres.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <BookMarked className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucune matière. Ajoutez-en une ci-dessus.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
