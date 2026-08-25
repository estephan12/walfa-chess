"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { tournamentSchema, type TournamentFormData } from "@/lib/schemas/tournamentSchema"
import type { ActionResult, Tournament } from "@/types"

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

function buildTournamentPayload(data: TournamentFormData, userId?: string) {
  return {
    title: data.title.trim(),
    slug: data.slug.trim(),
    type: data.type,
    status: data.status,
    description: sanitizeString(data.description),
    content: sanitizeString(data.content),
    cover_image_url: sanitizeString(data.cover_image_url),
    location: sanitizeString(data.location),
    location_maps_url: sanitizeString(data.location_maps_url),
    start_date: data.start_date,
    end_date: sanitizeString(data.end_date),
    registration_deadline: sanitizeString(data.registration_deadline),
    max_participants: sanitizeNumber(data.max_participants),
    entry_fee: sanitizeNumber(data.entry_fee),
    prize_pool: sanitizeString(data.prize_pool),
    time_control: sanitizeString(data.time_control),
    rounds: sanitizeNumber(data.rounds),
    inscription_type: data.inscription_type,
    inscription_url: sanitizeString(data.inscription_url),
    organizer_name: sanitizeString(data.organizer_name),
    organizer_contact: sanitizeString(data.organizer_contact),
    is_featured: Boolean(data.is_featured),
    ...(userId ? { created_by: userId } : {}),
  }
}

/**
 * Crea un nuevo torneo en la base de datos
 */
export async function createTournamentAction(
  formData: TournamentFormData
): Promise<ActionResult<Tournament>> {
  try {
    const validated = tournamentSchema.safeParse(formData)
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message ?? "Datos inválidos"
      return { success: false, error: firstError }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "No autorizado. Inicia sesión para continuar." }
    }

    const payload = buildTournamentPayload(validated.data, user.id)

    const { data, error } = await supabase
      .from("tournaments")
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error("Error al crear torneo en Supabase:", error)
      if (error.code === "23505") {
        return { success: false, error: "Ya existe un torneo con ese enlace/slug. Usa otro título." }
      }
      return { success: false, error: error.message || "Error al crear el torneo" }
    }

    // Revalidar rutas
    revalidatePath("/")
    revalidatePath("/torneos")
    revalidatePath("/admin/torneos")
    revalidatePath(`/torneos/${data.slug}`)

    return { success: true, data: data as Tournament, message: "Torneo creado exitosamente" }
  } catch (err: any) {
    console.error("Error inesperado en createTournamentAction:", err)
    return { success: false, error: err?.message ?? "Error interno del servidor" }
  }
}

/**
 * Actualiza un torneo existente
 */
export async function updateTournamentAction(
  id: string,
  formData: TournamentFormData
): Promise<ActionResult<Tournament>> {
  try {
    const validated = tournamentSchema.safeParse(formData)
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message ?? "Datos inválidos"
      return { success: false, error: firstError }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "No autorizado. Inicia sesión para continuar." }
    }

    const payload = {
      ...buildTournamentPayload(validated.data),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from("tournaments")
      .update(payload)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error al actualizar torneo:", error)
      return { success: false, error: error.message || "Error al actualizar el torneo" }
    }

    revalidatePath("/")
    revalidatePath("/torneos")
    revalidatePath("/admin/torneos")
    revalidatePath(`/torneos/${data.slug}`)

    return { success: true, data: data as Tournament, message: "Torneo actualizado exitosamente" }
  } catch (err: any) {
    console.error("Error inesperado en updateTournamentAction:", err)
    return { success: false, error: err?.message ?? "Error interno del servidor" }
  }
}

/**
 * Elimina un torneo por su ID
 */
export async function deleteTournamentAction(id: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "No autorizado" }
    }

    const { error } = await supabase
      .from("tournaments")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error al eliminar torneo:", error)
      return { success: false, error: error.message || "Error al eliminar el torneo" }
    }

    revalidatePath("/")
    revalidatePath("/torneos")
    revalidatePath("/admin/torneos")

    return { success: true, data: undefined, message: "Torneo eliminado correctamente" }
  } catch (err: any) {
    console.error("Error al eliminar torneo:", err)
    return { success: false, error: err?.message ?? "Error al eliminar el torneo" }
  }
}

/**
 * Sube una imagen de portada al bucket de Supabase Storage
 */
export async function uploadTournamentCoverAction(
  formData: FormData
): Promise<ActionResult<string>> {
  try {
    const file = formData.get("file") as File
    if (!file) {
      return { success: false, error: "No se seleccionó ningún archivo" }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "No autorizado" }
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `tournament-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
    const filePath = `covers/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("tournaments")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("Error al subir imagen a Supabase Storage:", uploadError)
      return { success: false, error: "Error al subir la imagen: " + uploadError.message }
    }

    const { data } = supabase.storage.from("tournaments").getPublicUrl(filePath)

    return { success: true, data: data.publicUrl, message: "Imagen subida correctamente" }
  } catch (err: any) {
    console.error("Error en uploadTournamentCoverAction:", err)
    return { success: false, error: err?.message ?? "Error al procesar la imagen" }
  }
}
