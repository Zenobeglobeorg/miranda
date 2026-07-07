import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { uploadToStorage } from "@/lib/storage"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const role = (session?.user as { role?: string })?.role

    console.log("Upload request - role:", role)

    if (!session?.user || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = (formData.get("type") as string) || "epreuve"

    console.log("File:", file?.name, file?.size)
    console.log("Type:", type)

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: `Type invalide: ${file.type}. PDF requis.` },
        { status: 400 }
      )
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Fichier trop lourd (max 15 Mo)" },
        { status: 400 }
      )
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "Fichier vide" }, { status: 400 })
    }

    const folder = type === "corrige" ? "corriges" : "epreuves"
    const url = await uploadToStorage(file, folder)

    console.log("Upload réussi, URL:", url)
    return NextResponse.json({
      url,
      path: url,
      name: file.name,
      size: file.size,
    })

  } catch (error: unknown) {
    const err = error as Error
    console.error("Upload route error:", err.message)
    return NextResponse.json(
      { error: err?.message ?? "Erreur upload" },
      { status: 500 }
    )
  }
}
