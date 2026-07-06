import { NextRequest, NextResponse } from "next/server"
import { withDB } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/helpers"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const createEpreuveSchema = z.object({
  titre: z.string().min(1),
  type: z.enum(["CONCOURS", "CC", "SN", "EPREUVE_SIMPLE"]),
  fichierEpreuve: z.string().url().or(z.string().min(1)),
  fichierCorrige: z.string().url().or(z.string()).optional().nullable(),
  isGratuit: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(true),
  filiereNiveauId: z.string().uuid(),
  matiereId: z.string().uuid(),
})

const EPREUVE_TYPES = ["CONCOURS", "CC", "SN", "EPREUVE_SIMPLE"] as const
type TypeEpreuve = (typeof EPREUVE_TYPES)[number]

function isTypeEpreuve(s: string | null): s is TypeEpreuve {
  return s !== null && EPREUVE_TYPES.includes(s as TypeEpreuve)
}

// GET /api/epreuves?niveau=1&filiere=uuid&type=CONCOURS
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const niveauNumero = searchParams.get("niveau")
    const filiereId = searchParams.get("filiere")
    const typeParam = searchParams.get("type")

    const epreuves = await withDB(async (db) => {
      const where: Record<string, unknown> = { isPublished: true }
      if (isTypeEpreuve(typeParam)) where.type = typeParam
      if (filiereId || niveauNumero) {
        where.filiereNiveau = {}
        if (filiereId) (where.filiereNiveau as Record<string, string>).filiereId = filiereId
        if (niveauNumero) {
          const niveau = await db.niveau.findFirst({ where: { numero: Number(niveauNumero) } })
          if (niveau) (where.filiereNiveau as Record<string, number>).niveauId = niveau.id
        }
      }
      return db.epreuve.findMany({
        where,
        include: {
          filiereNiveau: { include: { filiere: true, niveau: true } },
          matiere: true,
        },
        orderBy: { createdAt: "desc" },
      })
    })
    return NextResponse.json(epreuves)
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// POST /api/epreuves
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    console.log("Session:", session?.user?.role)

    if (!session?.user) {
      console.log("❌ Non authentifié")
      return NextResponse.json(
        { error: "Non authentifié" }, 
        { status: 401 }
      )
    }

    const body = await req.json()
    console.log("Body reçu:", JSON.stringify(body))

    // Vérifie filiereCode et niveauNumero
    if (!body.filiereCode || !body.niveauNumero) {
      console.log("❌ Filière ou niveau manquant")
      return NextResponse.json(
        { error: "Filière et niveau requis" },
        { status: 400 }
      )
    }

    // Cherche filiereNiveau
    const filiereNiveau = await withDB((db) =>
      db.filiereNiveau.findFirst({
        where: {
          filiere: { 
            code: body.filiereCode.toUpperCase() 
          },
          niveau: { 
            numero: parseInt(body.niveauNumero) 
          }
        },
        include: {
          filiere: true,
          niveau: true
        }
      })
    )

    console.log("FiliereNiveau trouvé:", 
      filiereNiveau?.id ?? "❌ NON TROUVÉ")

    if (!filiereNiveau) {
      return NextResponse.json(
        { 
          error: `Filière "${body.filiereCode}" ` +
            `niveau ${body.niveauNumero} introuvable` 
        },
        { status: 404 }
      )
    }

    // Vérifie matiereId
    if (!body.matiereId) {
      console.log("❌ Matière manquante")
      return NextResponse.json(
        { error: "Matière requise" },
        { status: 400 }
      )
    }

    // Vérifie fichierEpreuve
    if (!body.fichierEpreuve) {
      console.log("❌ Fichier épreuve manquant")
      return NextResponse.json(
        { error: "Fichier épreuve requis" },
        { status: 400 }
      )
    }

    const epreuve = await withDB((db) =>
      db.epreuve.create({
        data: {
          titre: body.titre ?? 
            `${body.filiereCode} - ${body.type}`,
          type: body.type,
          fichierEpreuve: body.fichierEpreuve,
          fichierCorrige: body.fichierCorrige ?? null,
          isGratuit: body.isGratuit ?? false,
          isPublished: true,
          filiereNiveauId: filiereNiveau.id,
          matiereId: body.matiereId,
        }
      })
    )

    console.log("✅ Épreuve créée:", epreuve.id)
    return NextResponse.json(epreuve)

  } catch (err) {
    console.error("❌ Erreur création épreuve:", err)
    return NextResponse.json(
      { error: "Erreur serveur: " + 
        (err as Error).message },
      { status: 500 }
    )
  }
}
