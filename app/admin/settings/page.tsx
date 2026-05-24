import { withDB } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/helpers"
import SettingsForm from "./SettingsForm"

export default async function SettingsPage() {
  await requireAdmin()

  const settings = await withDB((db) =>
    db.systemSettings.findFirst({
      select: {
        id: true,
        prixAbonnement: true,
        contactEmail: true,
        contactTel: true,
        contactAdresse: true,
      },
    })
  )

  return (
    <div className="w-full max-w-2xl mx-auto pb-24 md:pb-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
        <p className="text-slate-400 text-sm mt-1">
          Configuration générale du site
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  )
}
