import { createPublicClient, createClient } from "@/lib/supabase/server"
import type { News } from "@/types"

/**
 * Obtiene todas las noticias públicas publicadas
 */
export async function getPublicNews(limit?: number): Promise<News[]> {
  const supabase = createPublicClient()

  let query = supabase
    .from("news")
    .select(`
      *,
      author:profiles!news_author_id_fkey(full_name, avatar_url),
      tournament:tournaments!news_tournament_id_fkey(title, slug)
    `)
    .eq("status", "published")
    .order("published_at", { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error al obtener noticias públicas:", error)
    return []
  }

  return (data as News[]) ?? []
}

/**
 * Obtiene noticias destacadas
 */
export async function getFeaturedNews(limit: number = 3): Promise<News[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("news")
    .select(`
      *,
      author:profiles!news_author_id_fkey(full_name, avatar_url),
      tournament:tournaments!news_tournament_id_fkey(title, slug)
    `)
    .eq("status", "published")
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error al obtener noticias destacadas:", error)
    return []
  }

  return (data as News[]) ?? []
}

/**
 * Obtiene una noticia pública por su slug
 */
export async function getNewsBySlug(slug: string): Promise<News | null> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("news")
    .select(`
      *,
      author:profiles!news_author_id_fkey(full_name, avatar_url),
      tournament:tournaments!news_tournament_id_fkey(title, slug)
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (error || !data) {
    return null
  }

  return data as News
}

/**
 * Obtiene una noticia por ID (para edición en panel admin)
 */
export async function getNewsById(id: string): Promise<News | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    return null
  }

  return data as News
}

/**
 * Obtiene todas las noticias para el listado administrativo
 */
export async function getAllNewsAdmin(): Promise<News[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("news")
    .select(`
      *,
      author:profiles!news_author_id_fkey(full_name)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error al obtener noticias para admin:", error)
    return []
  }

  return (data as News[]) ?? []
}
