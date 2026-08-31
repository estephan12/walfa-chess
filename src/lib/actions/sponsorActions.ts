"use server"

import { revalidatePath } from "next/cache"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { sponsorSchema, type SponsorFormData } from "@/lib/schemas/sponsorSchema"
import type { ActionResult, Sponsor } from "@/types"

function sanitizeString(val: unknown): string | null {
  if (val === null || val === undefined) return null
  if (typeof val !== "string") return String(val)
  const trimmed = val.trim()
  return trimmed === "" ? null : trimmed
}

/**
 * Crea un nuevo patrocinador
 */
export async function createSponsorAction(
  formData: SponsorFormData
): Promise<ActionResult<Sponsor>> {
  try {
    const validated = sponsorSchema.safeParse(formData)
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message ?? "Datos inválidos"
      return { success: false, error: firstError }
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "No autorizado. Inicia sesión primero." }
    }

    const adminSupabase = createAdminClient()

    const payload = {
      name: validated.data.name.trim(),
      logo_url: sanitizeString(validated.data.logo_url),
      website_url: sanitizeString(validated.data.website_url),
      tier: validated.data.tier,
      is_active: Boolean(validated.data.is_active),
      sort_order: Number(validated.data.sort_order) || 0,
    }

    const { data, error } = await adminSupabase
      .from("sponsors")
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error("Error al crear patrocinador:", error)
      return { success: false, error: error.message || "Error al registrar el patrocinador" }
    }

    revalidatePath("/admin/patrocinadores")
    revalidatePath("/")
    return { success: true, data: data as Sponsor }
  } catch (err) {
    console.error("Error inesperado en createSponsorAction:", err)
    return { success: false, error: "Error inesperado al guardar el patrocinador" }
  }
}

/**
 * Actualiza un patrocinador existente
 */
export async function updateSponsorAction(
  id: string,
  formData: SponsorFormData
): Promise<ActionResult<Sponsor>> {
  try {
    const validated = sponsorSchema.safeParse(formData)
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message ?? "Datos inválidos"
      return { success: false, error: firstError }
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "No autorizado. Inicia sesión primero." }
    }

    const adminSupabase = createAdminClient()

    const payload = {
      name: validated.data.name.trim(),
      logo_url: sanitizeString(validated.data.logo_url),
      website_url: sanitizeString(validated.data.website_url),
      tier: validated.data.tier,
      is_active: Boolean(validated.data.is_active),
      sort_order: Number(validated.data.sort_order) || 0,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await adminSupabase
      .from("sponsors")
      .update(payload)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error al actualizar patrocinador:", error)
      return { success: false, error: error.message || "Error al actualizar el patrocinador" }
    }

    revalidatePath("/admin/patrocinadores")
    revalidatePath("/")
    return { success: true, data: data as Sponsor }
  } catch (err) {
    console.error("Error inesperado en updateSponsorAction:", err)
    return { success: false, error: "Error inesperado al actualizar el patrocinador" }
  }
}

/**
 * Activa o desactiva un patrocinador
 */
export async function toggleSponsorActiveAction(
  id: string,
  isActive: boolean
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "No autorizado. Inicia sesión primero." }
    }

    const adminSupabase = createAdminClient()

    const { error } = await adminSupabase
      .from("sponsors")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      console.error("Error al alternar estado de patrocinador:", error)
      return { success: false, error: error.message || "Error al cambiar el estado" }
    }

    revalidatePath("/admin/patrocinadores")
    revalidatePath("/")
    return { success: true, data: undefined }
  } catch (err) {
    console.error("Error inesperado en toggleSponsorActiveAction:", err)
    return { success: false, error: "Error inesperado al alternar estado" }
  }
}

/**
 * Elimina un patrocinador y su logo si se encuentra almacenado en el bucket
 */
export async function deleteSponsorAction(id: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "No autorizado. Inicia sesión primero." }
    }

    const adminSupabase = createAdminClient()

    // 1. Obtener datos para limpiar archivo de Storage si corresponde
    const { data: sponsor } = await adminSupabase
      .from("sponsors")
      .select("logo_url")
      .eq("id", id)
      .single()

    if (sponsor?.logo_url) {
      try {
        const urlObj = new URL(sponsor.logo_url)
        const pathParts = urlObj.pathname.split("/sponsors/")
        if (pathParts.length > 1) {
          const filePath = decodeURIComponent(pathParts[1])
          await adminSupabase.storage.from("sponsors").remove([filePath])
        }
      } catch (storageErr) {
        console.warn("No se pudo remover el archivo del bucket sponsors:", storageErr)
      }
    }

    // 2. Eliminar de la base de datos
    const { error } = await adminSupabase.from("sponsors").delete().eq("id", id)

    if (error) {
      console.error("Error al eliminar patrocinador:", error)
      return { success: false, error: error.message || "Error al eliminar el patrocinador" }
    }

    revalidatePath("/admin/patrocinadores")
    revalidatePath("/")
    return { success: true, data: undefined }
  } catch (err) {
    console.error("Error inesperado en deleteSponsorAction:", err)
    return { success: false, error: "Error inesperado al eliminar el patrocinador" }
  }
}

/**
 * Sube el logo corporativo del patrocinador al bucket de Storage
 */
export async function uploadSponsorLogoAction(
  formData: FormData
): Promise<ActionResult<string>> {
  try {
    const file = formData.get("file") as File
    if (!file) {
      return { success: false, error: "No se seleccionó ningún archivo de imagen" }
    }

    const validTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        error: "Formato no soportado. Usa PNG, JPG, WebP o SVG con fondo transparente.",
      }
    }

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "El archivo no debe exceder 5MB" }
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "No autorizado. Inicia sesión primero." }
    }

    const adminSupabase = createAdminClient()

    // Asegurar bucket "sponsors"
    try {
      const { data: bucket } = await adminSupabase.storage.getBucket("sponsors")
      if (!bucket) {
        await adminSupabase.storage.createBucket("sponsors", {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        })
      }
    } catch (bucketErr) {
      console.log("Verificando/creando bucket sponsors:", bucketErr)
    }

    const fileExt = file.name.split(".").pop() || "png"
    const fileName = `sponsor-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
    const filePath = `logos/${fileName}`

    const { error: uploadError } = await adminSupabase.storage
      .from("sponsors")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("Error al subir logo a Supabase Storage:", uploadError)
      return { success: false, error: "Error al subir el logo: " + uploadError.message }
    }

    const {
      data: { publicUrl },
    } = adminSupabase.storage.from("sponsors").getPublicUrl(filePath)

    return { success: true, data: publicUrl }
  } catch (err) {
    console.error("Error inesperado en uploadSponsorLogoAction:", err)
    return { success: false, error: "Error de servidor al procesar el logo" }
  }
}
