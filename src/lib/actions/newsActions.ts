"use server"

import { revalidatePath } from "next/cache"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { newsSchema, type NewsFormData } from "@/lib/schemas/newsSchema"
import type { ActionResult, News } from "@/types"

function sanitizeString(val: any): string | null {
  if (val === null || val === undefined) return null
  if (typeof val !== "string") return String(val)
  const trimmed = val.trim()
  return trimmed === "" ? null : trimmed
}

function buildNewsPayload(data: NewsFormData, authorId?: string, isPublishing: boolean = false) {
  const payload: any = {
    title: data.title.trim(),
    slug: data.slug.trim(),
    excerpt: sanitizeString(data.excerpt),
    content: data.content,
    cover_image_url: sanitizeString(data.cover_image_url),
    status: data.status,
    is_featured: Boolean(data.is_featured),
    tournament_id: sanitizeString(data.tournament_id),
    meta_title: sanitizeString(data.meta_title),
    meta_description: sanitizeString(data.meta_description),
    ...(authorId ? { author_id: authorId } : {}),
  }

  if (isPublishing && data.status === "published") {
    payload.published_at = new Date().toISOString()
  }

  return payload
}

/**
 * Crea una nueva noticia o artículo
 */
export async function createNewsAction(
  formData: NewsFormData
): Promise<ActionResult<News>> {
  try {
    const validated = newsSchema.safeParse(formData)
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message ?? "Datos inválidos"
      return { success: false, error: firstError }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "No autorizado. Inicia sesión para continuar." }
    }

    const payload = buildNewsPayload(validated.data, user.id, true)

    const { data, error } = await supabase
      .from("news")
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error("Error al crear noticia en Supabase:", error)
      if (error.code === "23505") {
        return { success: false, error: "Ya existe un artículo con ese enlace/slug. Usa otro título." }
      }
      return { success: false, error: error.message || "Error al crear la noticia" }
    }

    // Revalidación de rutas
    revalidatePath("/")
    revalidatePath("/noticias")
    revalidatePath("/admin/noticias")
    revalidatePath(`/noticias/${data.slug}`)

    return { success: true, data: data as News, message: "Noticia creada exitosamente" }
  } catch (err: any) {
    console.error("Error inesperado en createNewsAction:", err)
    return { success: false, error: err?.message ?? "Error interno del servidor" }
  }
}

/**
 * Actualiza una noticia existente
 */
export async function updateNewsAction(
  id: string,
  formData: NewsFormData
): Promise<ActionResult<News>> {
  try {
    const validated = newsSchema.safeParse(formData)
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message ?? "Datos inválidos"
      return { success: false, error: firstError }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "No autorizado. Inicia sesión para continuar." }
    }

    // Obtener noticia actual para ver si ya tenía fecha de publicación
    const { data: currentNews } = await supabase
      .from("news")
      .select("published_at, status")
      .eq("id", id)
      .single()

    const shouldSetPublishedAt =
      validated.data.status === "published" && (!currentNews?.published_at || currentNews.status === "draft")

    const payload = {
      ...buildNewsPayload(validated.data, undefined, shouldSetPublishedAt),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from("news")
      .update(payload)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error al actualizar noticia:", error)
      return { success: false, error: error.message || "Error al actualizar la noticia" }
    }

    revalidatePath("/")
    revalidatePath("/noticias")
    revalidatePath("/admin/noticias")
    revalidatePath(`/noticias/${data.slug}`)

    return { success: true, data: data as News, message: "Noticia actualizada exitosamente" }
  } catch (err: any) {
    console.error("Error inesperado en updateNewsAction:", err)
    return { success: false, error: err?.message ?? "Error interno del servidor" }
  }
}

/**
 * Elimina una noticia por su ID
 */
export async function deleteNewsAction(id: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "No autorizado" }
    }

    const { error } = await supabase
      .from("news")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error al eliminar noticia:", error)
      return { success: false, error: error.message || "Error al eliminar la noticia" }
    }

    revalidatePath("/")
    revalidatePath("/noticias")
    revalidatePath("/admin/noticias")

    return { success: true, data: undefined, message: "Noticia eliminada correctamente" }
  } catch (err: any) {
    console.error("Error al eliminar noticia:", err)
    return { success: false, error: err?.message ?? "Error al eliminar la noticia" }
  }
}

/**
 * Sube una imagen de portada o imagen embebida al bucket 'news' de Supabase Storage.
 */
export async function uploadNewsCoverAction(
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
      return { success: false, error: "No autorizado. Inicia sesión primero." }
    }

    const adminSupabase = createAdminClient()

    // 1. Asegurar que el bucket "news" exista
    try {
      const { data: bucket } = await adminSupabase.storage.getBucket("news")
      if (!bucket) {
        await adminSupabase.storage.createBucket("news", {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        })
      }
    } catch (bucketErr) {
      console.log("Verificando/creando bucket news:", bucketErr)
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `news-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
    const filePath = `covers/${fileName}`

    // 2. Subir imagen
    const { error: uploadError } = await adminSupabase.storage
      .from("news")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("Error al subir imagen a Supabase Storage:", uploadError)
      return { success: false, error: "Error al subir la imagen: " + uploadError.message }
    }

    const { data } = adminSupabase.storage.from("news").getPublicUrl(filePath)

    return { success: true, data: data.publicUrl, message: "Imagen subida correctamente" }
  } catch (err: any) {
    console.error("Error en uploadNewsCoverAction:", err)
    return { success: false, error: err?.message ?? "Error al procesar la imagen" }
  }
}
