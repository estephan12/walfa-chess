import { createPublicClient, createAdminClient } from "@/lib/supabase/server"
import type { GalleryAlbum, GalleryImage } from "@/types"

export interface AlbumWithDetails extends GalleryAlbum {
  images?: GalleryImage[]
  tournament?: {
    id: string
    title: string
    slug: string
  } | null
  image_count?: number
}

/**
 * Obtiene todos los álbumes públicos publicados
 */
export async function getPublicAlbums(): Promise<AlbumWithDetails[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("gallery_albums")
    .select(`
      *,
      tournament:tournaments(id, title, slug),
      images:gallery_images(count),
      first_image:gallery_images(url)
    `)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error al obtener álbumes públicos:", error)
    return []
  }

  return (data || []).map((album: any) => ({
    ...album,
    cover_image_url: album.cover_image_url || album.first_image?.[0]?.url || null,
    image_count: album.images?.[0]?.count ?? 0,
    images: undefined,
  }))
}

/**
 * Obtiene las imágenes más recientes de la galería para la portada
 */
export async function getFeaturedGalleryImages(limit: number = 5): Promise<{
  id: string
  url: string
  alt: string
  albumTitle: string
  albumSlug: string
}[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("gallery_images")
    .select(`
      id,
      url,
      alt_text,
      caption,
      album:gallery_albums(title, slug, is_published)
    `)
    .order("created_at", { ascending: false })
    .limit(limit * 2)

  if (error || !data || data.length === 0) {
    return []
  }

  return data
    .filter((img: any) => img.album?.is_published !== false)
    .slice(0, limit)
    .map((img: any) => ({
      id: img.id,
      url: img.url,
      alt: img.caption || img.alt_text || img.album?.title || "Fotografía oficial WALFA-CHESS",
      albumTitle: img.album?.title || "Galería Oficial",
      albumSlug: img.album?.slug || "",
    }))
}

/**
 * Obtiene un álbum público por su slug junto con todas sus imágenes
 */
export async function getAlbumBySlug(slug: string): Promise<AlbumWithDetails | null> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("gallery_albums")
    .select(`
      *,
      tournament:tournaments(id, title, slug),
      images:gallery_images(id, album_id, url, alt_text, caption, sort_order, created_at)
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (error || !data) {
    return null
  }

  // Ordenar imágenes por sort_order ascendente y luego created_at
  const images = (data.images as GalleryImage[]) || []
  images.sort((a, b) => (a.sort_order - b.sort_order) || new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

  return {
    ...data,
    images,
    image_count: images.length,
  }
}

/**
 * Obtiene todos los álbumes para el panel de administración
 */
export async function getAdminAlbums(): Promise<AlbumWithDetails[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("gallery_albums")
    .select(`
      *,
      tournament:tournaments(id, title, slug),
      images:gallery_images(count)
    `)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error al obtener álbumes admin:", error)
    return []
  }

  return (data || []).map((album: any) => ({
    ...album,
    image_count: album.images?.[0]?.count ?? 0,
    images: undefined,
  }))
}

/**
 * Obtiene un álbum por ID para edición administrativa con todas sus imágenes
 */
export async function getAdminAlbumById(id: string): Promise<AlbumWithDetails | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("gallery_albums")
    .select(`
      *,
      tournament:tournaments(id, title, slug),
      images:gallery_images(id, album_id, url, alt_text, caption, sort_order, created_at)
    `)
    .eq("id", id)
    .single()

  if (error || !data) {
    return null
  }

  const images = (data.images as GalleryImage[]) || []
  images.sort((a, b) => (a.sort_order - b.sort_order) || new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

  return {
    ...data,
    images,
    image_count: images.length,
  }
}

/**
 * Obtiene el álbum fotográfico asociado a un torneo si existe y está publicado
 */
export async function getAlbumByTournamentId(tournamentId: string): Promise<{ id: string; slug: string; title: string; image_count: number } | null> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from("gallery_albums")
    .select("id, slug, title, images:gallery_images(count)")
    .eq("tournament_id", tournamentId)
    .eq("is_published", true)
    .maybeSingle()

  if (error || !data) return null

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    image_count: (data as any).images?.[0]?.count ?? 0,
  }
}
