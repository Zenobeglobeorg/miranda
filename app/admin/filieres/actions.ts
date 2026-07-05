"use server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/helpers"
import { revalidatePath } from "next/cache"

export async function ajouterNiveauFiliere(
  filiereId: string,
  niveauId: number
) {
  await requireAdmin()
  try {
    // Vérifie si déjà existant
    const existing = await prisma.filiereNiveau.findFirst({
      where: { filiereId, niveauId }
    })
    if (existing) {
      return { error: "Ce niveau est déjà assigné" }
    }

    await prisma.filiereNiveau.create({
      data: { filiereId, niveauId }
    })
    revalidatePath("/admin/filieres")
    revalidatePath("/epreuves")
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: "Erreur lors de l'ajout" }
  }
}

export async function supprimerNiveauFiliere(
  filiereNiveauId: string
) {
  await requireAdmin()
  try {
    // Supprime les épreuves associées d'abord
    await prisma.epreuve.deleteMany({
      where: { filiereNiveauId }
    })

    await prisma.filiereNiveau.delete({
      where: { id: filiereNiveauId }
    })
    revalidatePath("/admin/filieres")
    revalidatePath("/epreuves")
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: "Erreur lors de la suppression" }
  }
}

export async function creerFiliere(data: {
  code: string
  nom: string
  couleur: string
}) {
  await requireAdmin()
  try {
    const existing = await prisma.filiere.findFirst({
      where: { code: data.code.toUpperCase() }
    })
    if (existing) {
      return { error: "Ce code filière existe déjà" }
    }

    await prisma.filiere.create({
      data: {
        code: data.code.toUpperCase(),
        nom: data.nom,
        couleur: data.couleur,
        isActive: true,
      }
    })
    revalidatePath("/admin/filieres")
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: "Erreur lors de la création" }
  }
}

export async function creerNiveau(data: {
  numero: number
  label: string
}) {
  await requireAdmin()
  try {
    const existing = await prisma.niveau.findFirst({
      where: { label: data.label }
    })
    if (existing) {
      return { 
        error: "Un niveau avec ce label existe déjà" 
      }
    }

    await prisma.niveau.create({
      data: {
        numero: data.numero,
        label: data.label,
      }
    })
    revalidatePath("/admin/filieres")
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: "Erreur lors de la création" }
  }
}

export async function supprimerFiliere(
  filiereId: string
) {
  await requireAdmin()
  try {
    // 1. Récupère tous les filiereNiveaux
    const filiereNiveaux = await prisma
      .filiereNiveau.findMany({
        where: { filiereId },
        select: { id: true }
      })
    
    const filiereNiveauIds = filiereNiveaux
      .map(fn => fn.id)

    // 2. Supprime les downloads liés
    await prisma.download.deleteMany({
      where: { 
        epreuve: { 
          filiereNiveauId: { 
            in: filiereNiveauIds 
          } 
        } 
      }
    })

    // 3. Supprime les épreuves liées
    await prisma.epreuve.deleteMany({
      where: { 
        filiereNiveauId: { in: filiereNiveauIds } 
      }
    })

    // 4. Supprime les filiereNiveaux
    await prisma.filiereNiveau.deleteMany({
      where: { filiereId }
    })

    // 5. Supprime la filière
    await prisma.filiere.delete({
      where: { id: filiereId }
    })

    revalidatePath("/admin/filieres")
    revalidatePath("/epreuves")
    return { success: true }
  } catch (err) {
    console.error(err)
    return { error: "Erreur lors de la suppression" }
  }
}
