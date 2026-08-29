"use server"

import { revalidatePath } from "next/cache"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { albumSchema, type AlbumFormData } from "@/lib/schemas/gallerySchema"
import type { ActionResult, GalleryAlbum, GalleryImage } from "@/types"

function sanitizeString(val: any): string | null {
  if (val === null || val === undefined) return null
  if (typeof val !== "string") return String(val)
  const trimmed = val.trim()
  return trimmed === "" ? null : trimmed
}

/**
 * Crea un nuevo álbum en la galería
 */
export async function createAlbumAction(
  formData: AlbumFormData
): Promise<ActionResult<GalleryAlbum>> {
  try {
    const validated = albumSchema.safeParse(formData)
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message ?? "Datos inválidos"
      return { success: false, error: firstError }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "No autorizado. Inicia sesión para continuar." }
    }

    const adminSupabase = createAdminClient()

    const payload = {
      title: validated.data.title.trim(),
      slug: validated.data.slug.trim(),
      description: sanitizeString(validated.data.description),
      cover_image_url: sanitizeString(validated.data.cover_image_url),
      tournament_id: sanitizeString(validated.data.tournament_id),
      is_published: Boolean(validated.data.is_published),
      sort_order: Number(validated.data.sort_order) || 0,
    }

    const { data, error } = await adminSupabase
      .from("gallery_albums")
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error("Error al crear álbum:", error)
      if (error.code === "23505") {
        return { success: false, error: "Ya existe un álbum con ese slug/identificador. Usa otro título o enlace." }
      }
      return { success: false, error: error.message || "Error al crear el álbum" }
    }

    revalidatePath("/admin/galeria")
    revalidatePath("/galeria")

    return { success: true, data: data as GalleryAlbum, message: "Álbum creado exitosamente" }
  } catch (err: any) {
    console.error("Error inesperado en createAlbumAction:", err)
    return { success: false, error: err?.message ?? "Error interno del servidor" }
  }
}

/**
 * Actualiza un álbum existente
 */
export async function updateAlbumAction(
  id: string,
  formData: AlbumFormData
): Promise<ActionResult<GalleryAlbum>> {
  try {
    const validated = albumSchema.safeParse(formData)
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message ?? "Datos inválidos"
      return { success: false, error: firstError }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "No autorizado. Inicia sesión para continuar." }
    }

    const adminSupabase = createAdminClient()

    const payload = {
      title: validated.data.title.trim(),
      slug: validated.data.slug.trim(),
      description: sanitizeString(validated.data.description),
      cover_image_url: sanitizeString(validated.data.cover_image_url),
      tournament_id: sanitizeString(validated.data.tournament_id),
      is_published: Boolean(validated.data.is_published),
      sort_order: Number(validated.data.sort_order) || 0,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await adminSupabase
      .from("gallery_albums")
      .update(payload)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error al actualizar álbum:", error)
      return { success: false, error: error.message || "Error al actualizar el álbum" }
    }

    revalidatePath("/admin/galeria")
    revalidatePath(`/admin/galeria/${id}`)
    revalidatePath("/galeria")
    revalidatePath(`/galeria/${data.slug}`)

    return { success: true, data: data as GalleryAlbum, message: "Álbum actualizado correctamente" }
  } catch (err: any) {
    console.error("Error inesperado en updateAlbumAction:", err)
    return { success: false, error: err?.message ?? "Error interno del servidor" }
  }
}

/**
 * Elimina un álbum y sus fotos
 */
export async function deleteAlbumAction(id: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "No autorizado" }
    }

    const adminSupabase = createAdminClient()

    const { error } = await adminSupabase
      .from("gallery_albums")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error al eliminar álbum:", error)
      return { success: false, error: error.message || "Error al eliminar el álbum" }
    }

    revalidatePath("/admin/galeria")
    revalidatePath("/galeria")

    return { success: true, data: undefined, message: "Álbum eliminado correctamente" }
  } catch (err: any) {
    console.error("Error al eliminar álbum:", err)
    return { success: false, error: err?.message ?? "Error al eliminar el álbum" }
  }
}

/**
 * Sube una fotografía al álbum y la registra en la base de datos
 */
export async function uploadAlbumPhotoAction(
  albumId: string,
  formData: FormData
): Promise<ActionResult<GalleryImage>> {
  try {
    const file = formData.get("file") as File
    const altText = sanitizeString(formData.get("alt_text"))
    const caption = sanitizeString(formData.get("caption"))

    if (!file) {
      return { success: false, error: "No se seleccionó ningún archivo de imagen" }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "No autorizado. Inicia sesión primero." }
    }

    const adminSupabase = createAdminClient()

    // 1. Asegurar bucket "gallery"
    try {
      const { data: bucket } = await adminSupabase.storage.getBucket("gallery")
      if (!bucket) {
        await adminSupabase.storage.createBucket("gallery", {
          public: true,
          fileSizeLimit: 15728640, // 15MB
        })
      }
    } catch (bucketErr) {
      console.log("Verificando/creando bucket gallery:", bucketErr)
    }

    // 2. Subir imagen a storage
    const fileExt = file.name.split(".").pop() || "jpg"
    const fileName = `album-${albumId}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
    const filePath = `albums/${albumId}/${fileName}`

    const { error: uploadError } = await adminSupabase.storage
      .from("gallery")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("Error al subir fotografía a storage:", uploadError)
      return { success: false, error: "Error al subir la imagen: " + uploadError.message }
    }

    const { data: urlData } = adminSupabase.storage.from("gallery").getPublicUrl(filePath)
    const publicUrl = urlData.publicUrl

    // 3. Registrar en gallery_images
    const { data: insertedImage, error: insertError } = await adminSupabase
      .from("gallery_images")
      .insert({
        album_id: albumId,
        url: publicUrl,
        alt_text: altText,
        caption: caption,
        sort_order: 0,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error al guardar registro de foto:", insertError)
      return { success: false, error: insertError.message || "Error al registrar la imagen" }
    }

    // 4. Si el álbum no tiene portada, asignar automáticamente esta foto
    const { data: album } = await adminSupabase
      .from("gallery_albums")
      .select("cover_image_url, slug")
      .eq("id", albumId)
      .single()

    if (album && !album.cover_image_url) {
      await adminSupabase
        .from("gallery_albums")
        .update({ cover_image_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", albumId)
    }

    revalidatePath(`/admin/galeria/${albumId}`)
    revalidatePath("/admin/galeria")
    revalidatePath("/galeria")
    if (album?.slug) {
      revalidatePath(`/galeria/${album.slug}`)
    }

    return {
      success: true,
      data: insertedImage as GalleryImage,
      message: "Fotografía agregada exitosamente",
    }
  } catch (err: any) {
    console.error("Error en uploadAlbumPhotoAction:", err)
    return { success: false, error: err?.message ?? "Error al procesar la fotografía" }
  }
}

/**
 * Elimina una fotografía del álbum
 */
export async function deleteAlbumImageAction(
  albumId: string,
  imageId: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "No autorizado" }
    }

    const adminSupabase = createAdminClient()

    // Obtener datos de la imagen
    const { data: img } = await adminSupabase
      .from("gallery_images")
      .select("url")
      .eq("id", imageId)
      .single()

    // Eliminar de BD
    const { error: deleteError } = await adminSupabase
      .from("gallery_images")
      .delete()
      .eq("id", imageId)

    if (deleteError) {
      return { success: false, error: deleteError.message || "Error al eliminar imagen" }
    }

    // Verificar si esta imagen era la portada del álbum
    const { data: album } = await adminSupabase
      .from("gallery_albums")
      .select("cover_image_url, slug")
      .eq("id", albumId)
      .single()

    if (album?.cover_image_url === img?.url) {
      // Buscar otra imagen para asignarla como portada
      const { data: nextImg } = await adminSupabase
        .from("gallery_images")
        .select("url")
        .eq("album_id", albumId)
        .order("sort_order", { ascending: true })
        .limit(1)
        .maybeSingle()

      await adminSupabase
        .from("gallery_albums")
        .update({
          cover_image_url: nextImg?.url ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", albumId)
    }

    revalidatePath(`/admin/galeria/${albumId}`)
    revalidatePath("/admin/galeria")
    revalidatePath("/galeria")
    if (album?.slug) {
      revalidatePath(`/galeria/${album.slug}`)
    }

    return { success: true, data: undefined, message: "Fotografía eliminada" }
  } catch (err: any) {
    console.error("Error en deleteAlbumImageAction:", err)
    return { success: false, error: err?.message ?? "Error al eliminar la fotografía" }
  }
}

/**
 * Asigna una fotografía como la portada oficial del álbum
 */
export async function setAlbumCoverAction(
  albumId: string,
  imageUrl: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "No autorizado" }
    }

    const adminSupabase = createAdminClient()

    const { data: album, error } = await adminSupabase
      .from("gallery_albums")
      .update({
        cover_image_url: imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", albumId)
      .select("slug")
      .single()

    if (error) {
      return { success: false, error: error.message || "Error al actualizar la portada" }
    }

    revalidatePath(`/admin/galeria/${albumId}`)
    revalidatePath("/admin/galeria")
    revalidatePath("/galeria")
    if (album?.slug) {
      revalidatePath(`/galeria/${album.slug}`)
    }

    return { success: true, data: undefined, message: "Portada actualizada" }
  } catch (err: any) {
    return { success: false, error: err?.message ?? "Error interno" }
  }
}
