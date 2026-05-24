import { requireAdmin } from "@/lib/auth/helpers"
import { prisma } from "@/lib/prisma"
import FilieresManager from "@/app/admin/filieres/FilieresManager"

export const dynamic = "force-dynamic"

export default async function FilieresPage() {
  await requireAdmin()

  const filieres = await prisma.filiere.findMany({
    where: { isActive: true },
    include: {
      filiereNiveaux: {
        include: { niveau: true },
        orderBy: { niveau: { numero: "asc" } }
      }
    },
    orderBy: { code: "asc" }
  })

  // Tous les niveaux disponibles dans le système
  const niveaux = await prisma.niveau.findMany({
    orderBy: { numero: "asc" }
  })

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-0 space-y-6">
      <div className="flex-shrink-0">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">
          Filières & Niveaux
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Gérez les filières et leurs niveaux
        </p>
      </div>
      <FilieresManager 
        filieres={filieres} 
        niveaux={niveaux} 
      />
    </div>
  )
}
