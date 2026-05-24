import { withDB } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/helpers"
import { Users } from "lucide-react"
import { UserActions } from "./user-actions"

export const dynamic = "force-dynamic"
export const revalidate = 0

function formatDate(date: Date | null): string {
  if (!date) return "—"
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export default async function AdminUtilisateursPage() {
  await requireAdmin()
  const utilisateurs = await withDB((db) =>
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isSubscriptionActive: true,
        subscriptionEndDate: true,
        createdAt: true,
      },
    })
  )

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-0 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">
            Utilisateurs
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {utilisateurs.length} utilisateur(s) au total
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="overflow-auto flex-1">
          <table className="w-full text-sm min-w-[650px]">
            <thead className="sticky top-0 bg-white z-10 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 md:px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Nom
                </th>
                <th className="text-left px-4 md:px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Email
                </th>
                <th className="text-left px-4 md:px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Rôle
                </th>
                <th className="text-left px-4 md:px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Abonnement
                </th>
                <th className="text-left px-4 md:px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Inscrit le
                </th>
                <th className="text-right px-4 md:px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {utilisateurs.map((user) => {
                const abonnementActif =
                  user.isSubscriptionActive === true &&
                  user.subscriptionEndDate !== null &&
                  new Date() < new Date(user.subscriptionEndDate)
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 transition-colors duration-150"
                  >
                    <td className="px-4 md:px-5 py-3.5 font-medium text-slate-900 whitespace-nowrap">
                      {user.fullName ?? "—"}
                    </td>
                    <td className="px-4 md:px-5 py-3.5 text-slate-600 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-4 md:px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium ${
                          user.role === "ADMIN" || user.role === "SUPER_ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 md:px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium ${
                          abonnementActif
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {abonnementActif ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-4 md:px-5 py-3.5 text-slate-600 whitespace-nowrap">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 md:px-5 py-3.5 text-right whitespace-nowrap">
                      <UserActions
                        userId={user.id}
                        isActive={abonnementActif}
                        fullName={user.fullName ?? user.email}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {utilisateurs.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucun utilisateur</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
