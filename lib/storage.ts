import { supabaseAdmin } from "@/lib/supabase"

const BUCKET = "miranda-pdfs"

export async function uploadToStorage(
  file: File,
  folder: "epreuves" | "corriges"
): Promise<string> {

  // Vérifie les variables d'environnement
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL manquant")
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY manquant")
  }

  const timestamp = Date.now()
  const cleanName = file.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .toLowerCase()
  const path = `${folder}/${timestamp}_${cleanName}`

  console.log(`Upload vers Supabase: ${path}`)
  console.log(`Taille fichier: ${file.size} bytes`)
  console.log(`Type: ${file.type}`)

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const { data, error } = await supabaseAdmin
      .storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: "application/pdf",
        upsert: false,
        duplex: "half",
      })

    if (error) {
      console.error("Supabase Storage error:", error)
      throw new Error(error.message)
    }

    console.log("Upload réussi:", data.path)

    const { data: urlData } = supabaseAdmin
      .storage
      .from(BUCKET)
      .getPublicUrl(path)

    return urlData.publicUrl

  } catch (err: unknown) {
    const error = err as Error
    console.error("Upload error détail:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
    })
    throw new Error("Erreur upload : " + error.message)
  }
}

export async function deleteFromStorage(publicUrl: string | null): Promise<void> {
  if (!publicUrl) return
  try {
    const marker = `/object/public/${BUCKET}/`
    const idx = publicUrl.indexOf(marker)
    if (idx === -1) return
    const path = publicUrl.slice(idx + marker.length)
    await supabaseAdmin.storage.from(BUCKET).remove([path])
  } catch (err) {
    console.warn("Storage delete error:", err)
  }
}
