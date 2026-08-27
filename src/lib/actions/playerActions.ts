"use server"

import { revalidatePath } from "next/cache"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { playerSchema, type PlayerFormData } from "@/lib/schemas/playerSchema"
import type { ActionResult, Player } from "@/types"
import { decodePlayer } from "@/lib/queries/playerQueries"

function sanitizeNumber(val: any): number | null {
  if (val === "" || val === null || val === undefined) return null
  const num = Number(val)
  return isNaN(num) ? null : num
}

function sanitizeString(val: any): string | null {
  if (val === null || val === undefined) return null
  if (typeof val !== "string") return String(val)
  const trimmed = val.trim()
  return trimmed === "" ? null : trimmed
}

function buildPlayerPayload(data: PlayerFormData) {
  // Empaquetamos bio, title y club en formato JSON en el campo bio para máxima compatibilidad con la base de datos
  const bioPayload = JSON.stringify({
    bio: sanitizeString(data.bio),
    title: sanitizeString(data.title),
    club: sanitizeString(data.club),
  })

  return {
    full_name: data.full_name.trim(),
    slug: data.slug.trim(),
    birth_date: sanitizeString(data.birth_date),
    nationality: sanitizeString(data.nationality) || "DO",
    fide_id: sanitizeString(data.fide_id),
    fide_rating: sanitizeNumber(data.fide_rating),
    local_rating: sanitizeNumber(data.local_rating),
    photo_url: sanitizeString(data.photo_url),
    bio: bioPayload,
    is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
  }
}

/**
 * Crea un nuevo jugador en la base de datos
 */
export async function createPlayerAction(
  formData: PlayerFormData
): Promise<ActionResult<Player>> {
  try {
    const validated = playerSchema.safeParse(formData)
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message ?? "Datos del jugador inválidos"
      return { success: false, error: firstError }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "No autorizado. Inicia sesión para continuar." }
    }

    const payload = buildPlayerPayload(validated.data)

    const { data, error } = await supabase
      .from("players")
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error("Error al crear jugador en Supabase:", error)
      if (error.code === "23505") {
        if (error.message.includes("fide_id")) {
          return { success: false, error: "Ya existe un jugador registrado con ese FIDE ID." }
        }
        return { success: false, error: "Ya existe un jugador con ese identificador slug." }
      }
      return { success: false, error: error.message || "Error al registrar el jugador" }
    }

    revalidatePath("/")
    revalidatePath("/clasificacion")
    revalidatePath("/admin/jugadores")

    return { success: true, data: decodePlayer(data), message: "Jugador registrado exitosamente" }
  } catch (err: any) {
    console.error("Error inesperado en createPlayerAction:", err)
    return { success: false, error: err?.message ?? "Error interno del servidor" }
  }
}

/**
 * Actualiza un jugador existente
 */
export async function updatePlayerAction(
  id: string,
  formData: PlayerFormData
): Promise<ActionResult<Player>> {
  try {
    const validated = playerSchema.safeParse(formData)
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message ?? "Datos del jugador inválidos"
      return { success: false, error: firstError }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "No autorizado. Inicia sesión para continuar." }
    }

    const payload = {
      ...buildPlayerPayload(validated.data),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from("players")
      .update(payload)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error al actualizar jugador:", error)
      if (error.code === "23505") {
        if (error.message.includes("fide_id")) {
          return { success: false, error: "Ya existe otro jugador con ese FIDE ID." }
        }
        return { success: false, error: "Ya existe otro jugador con ese slug." }
      }
      return { success: false, error: error.message || "Error al actualizar el jugador" }
    }

    revalidatePath("/")
    revalidatePath("/clasificacion")
    revalidatePath("/admin/jugadores")
    revalidatePath(`/admin/jugadores/${id}`)

    return { success: true, data: decodePlayer(data), message: "Jugador actualizado exitosamente" }
  } catch (err: any) {
    console.error("Error inesperado en updatePlayerAction:", err)
    return { success: false, error: err?.message ?? "Error interno del servidor" }
  }
}

/**
 * Elimina un jugador por su ID
 */
export async function deletePlayerAction(id: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "No autorizado" }
    }

    const { error } = await supabase
      .from("players")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error al eliminar jugador:", error)
      return { success: false, error: error.message || "Error al eliminar el jugador" }
    }

    revalidatePath("/")
    revalidatePath("/clasificacion")
    revalidatePath("/admin/jugadores")

    return { success: true, data: undefined, message: "Jugador eliminado correctamente" }
  } catch (err: any) {
    console.error("Error al eliminar jugador:", err)
    return { success: false, error: err?.message ?? "Error al eliminar el jugador" }
  }
}

/**
 * Sube una foto de perfil de jugador al bucket de Supabase Storage.
 * Auto-crea el bucket "players" si aún no existe.
 */
export async function uploadPlayerPhotoAction(
  formData: FormData
): Promise<ActionResult<string>> {
  try {
    const file = formData.get("file") as File
    if (!file) {
      return { success: false, error: "No se seleccionó ningún archivo de imagen" }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "No autorizado. Inicia sesión primero." }
    }

    const adminSupabase = createAdminClient()

    // 1. Asegurar que el bucket "players" exista
    try {
      const { data: bucket } = await adminSupabase.storage.getBucket("players")
      if (!bucket) {
        await adminSupabase.storage.createBucket("players", {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        })
      }
    } catch (bucketErr) {
      console.log("Verificando/creando bucket players:", bucketErr)
    }

    const fileExt = file.name.split(".").pop() || "jpg"
    const fileName = `player-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // 2. Subir imagen
    const { error: uploadError } = await adminSupabase.storage
      .from("players")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("Error al subir foto a Supabase Storage:", uploadError)
      return { success: false, error: "Error al subir la foto: " + uploadError.message }
    }

    const { data } = adminSupabase.storage.from("players").getPublicUrl(filePath)

    return { success: true, data: data.publicUrl, message: "Foto subida correctamente" }
  } catch (err: any) {
    console.error("Error en uploadPlayerPhotoAction:", err)
    return { success: false, error: err?.message ?? "Error al procesar la foto" }
  }
}
