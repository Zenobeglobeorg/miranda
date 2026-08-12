import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

// Charger .env pour DATABASE_URL (tsx ne le charge pas automatiquement)
try {
  const content = readFileSync(resolve(process.cwd(), ".env"), "utf-8")
  for (const line of content.split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "")
  }
} catch {}

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error("DATABASE_URL manquant. Définissez-le dans .env")

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function getOrCreateNiveau(
  numero: number, 
  label: string
) {
  const existing = await prisma.niveau.findFirst({
    where: { numero, label }
  })
  if (existing) return existing
  return prisma.niveau.create({
    data: { numero, label }
  })
}

async function main() {
  console.log("Ajout des nouvelles filières...")

  const filieres = [
    {
      code: "SJM",
      nom: "Sciences Juridiques et Management",
      couleur: "#8B5CF6", // violet
      isActive: true,
      niveaux: [
        { numero: 1, label: "L1" },
        { numero: 2, label: "L2" },
        { numero: 3, label: "L3" },
        { numero: 4, label: "Master 1" },
        { numero: 5, label: "Master 2" },
      ]
    },
    {
      code: "SJI",
      nom: "Sciences Juridiques Internationales",
      couleur: "#EC4899", // rose
      isActive: true,
      niveaux: [
        { numero: 1, label: "L1" },
        { numero: 2, label: "L2" },
        { numero: 3, label: "L3" },
        { numero: 4, label: "Master 1" },
        { numero: 5, label: "Master 2" },
      ]
    },
    {
      code: "INGF",
      nom: "Ingénieurs Francophones",
      couleur: "#F59E0B", // amber
      isActive: true,
      niveaux: [
        { numero: 1, label: "L1" },
        { numero: 2, label: "L2" },
        { numero: 3, label: "L3" },
        { numero: 4, label: "Master 1" },
        { numero: 5, label: "Master 2" },
      ]
    },
    {
      code: "INGA",
      nom: "Ingénieurs Anglophones",
      couleur: "#06B6D4", // cyan
      isActive: true,
      niveaux: [
        { numero: 1, label: "L1" },
        { numero: 2, label: "L2" },
        { numero: 3, label: "L3" },
        { numero: 4, label: "Master 1" },
        { numero: 5, label: "Master 2" },
      ]
    },
    {
      code: "CPGE",
      nom: "Classes Préparatoires aux Grandes Écoles",
      couleur: "#10B981", // emerald
      isActive: true,
      niveaux: [
        { numero: 1, label: "L1" },
        { numero: 2, label: "L2" },
      ]
    },
  ]

  for (const f of filieres) {
    // Vérifie si la filière existe déjà
    const existing = await prisma.filiere.findFirst({
      where: { code: f.code }
    })

    if (existing) {
      console.log(`⚠️  Filière ${f.code} existe déjà, skip`)
      continue
    }

    // Crée la filière
    const filiere = await prisma.filiere.create({
      data: {
        code: f.code,
        nom: f.nom,
        couleur: f.couleur,
        isActive: f.isActive,
      }
    })

    // Pour chaque niveau, trouve ou crée le Niveau
    // puis crée le FiliereNiveau
    for (const n of f.niveaux) {
      // Cherche ou crée le niveau via la fonction getOrCreateNiveau
      const niveau = await getOrCreateNiveau(n.numero, n.label)

      // Crée la liaison FiliereNiveau
      await prisma.filiereNiveau.create({
        data: {
          filiereId: filiere.id,
          niveauId: niveau.id,
        }
      })

      console.log(
        `  ✅ ${f.code} - ${n.label} créé`
      )
    }

    console.log(`✅ Filière ${f.code} créée`)
  }

  console.log("✅ Toutes les filières ajoutées !")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
