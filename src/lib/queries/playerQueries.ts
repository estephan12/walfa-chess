import { createPublicClient, createClient } from "@/lib/supabase/server"
import type { Player } from "@/types"

/**
 * Decodifica un registro de la base de datos para extraer de forma segura
 * title, club y el texto real del bio.
 */
export function decodePlayer(raw: any): Player {
  if (!raw) return raw

  let title = raw.title || null
  let club = raw.club || null
  let bio = raw.bio || null

  if (bio && typeof bio === "string" && bio.trim().startsWith("{") && bio.trim().endsWith("}")) {
    try {
      const parsed = JSON.parse(bio)
      title = title || parsed.title || null
      club = club || parsed.club || null
      bio = parsed.bio || null
    } catch {
      // Si falla el parseo de JSON, se mantiene el bio original
    }
  }

  return {
    ...raw,
    title,
    club,
    bio,
  }
}

export interface PlayerRankingFilters {
  ratingType?: "fide" | "local"
  category?: string
  search?: string
  titleOnly?: boolean
}

/**
 * Obtiene los jugadores para la tabla de clasificación pública con filtros
 */
export async function getPublicPlayersRanking(
  filters?: PlayerRankingFilters
): Promise<Player[]> {
  const supabase = createPublicClient()
  const ratingCol = filters?.ratingType === "local" ? "local_rating" : "fide_rating"

  let query = supabase
    .from("players")
    .select("*")
    .eq("is_active", true)
    .order(ratingCol, { ascending: false, nullsFirst: false })

  const { data, error } = await query

  if (error) {
    console.error("Error al obtener jugadores para ranking:", error)
    return []
  }

  let players: Player[] = (data || []).map(decodePlayer)

  // Filtro de búsqueda (nombre, FIDE ID, club)
  if (filters?.search && filters.search.trim() !== "") {
    const s = filters.search.toLowerCase().trim()
    players = players.filter(
      (p) =>
        p.full_name.toLowerCase().includes(s) ||
        (p.fide_id && p.fide_id.toLowerCase().includes(s)) ||
        (p.club && p.club.toLowerCase().includes(s)) ||
        (p.title && p.title.toLowerCase().includes(s))
    )
  }

  // Filtro solo titulados
  if (filters?.titleOnly) {
    players = players.filter((p) => Boolean(p.title))
  }

  // Filtro por categoría de Elo
  if (filters?.category && filters.category !== "all") {
    players = players.filter((p) => {
      const rating = (filters.ratingType === "local" ? p.local_rating : p.fide_rating) ?? 0
      switch (filters.category) {
        case "master":
          return rating >= 2200
        case "class_a":
          return rating >= 2000 && rating < 2200
        case "class_b":
          return rating >= 1800 && rating < 2000
        case "class_c":
          return rating >= 1600 && rating < 1800
        case "amateur":
          return rating > 0 && rating < 1600
        case "unrated":
          return rating === 0
        case "titled":
          return Boolean(p.title)
        default:
          return true
      }
    })
  }

  return players
}

/**
 * Obtiene métricas y estadísticas de los jugadores para los contadores de la clasificación
 */
export async function getPlayerStats() {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("players")
    .select("fide_rating, local_rating, bio")
    .eq("is_active", true)

  if (error || !data) {
    return {
      totalPlayers: 0,
      titledPlayers: 0,
      topFideRating: 0,
      avgFideRating: 0,
    }
  }

  const decoded = data.map(decodePlayer)
  const total = decoded.length
  let titled = 0
  let topRating = 0
  let totalRatingSum = 0
  let ratedCount = 0

  decoded.forEach((p) => {
    if (p.title) titled++
    const r = p.fide_rating || 0
    if (r > topRating) topRating = r
    if (r > 0) {
      totalRatingSum += r
      ratedCount++
    }
  })

  return {
    totalPlayers: total,
    titledPlayers: titled,
    topFideRating: topRating,
    avgFideRating: ratedCount > 0 ? Math.round(totalRatingSum / ratedCount) : 0,
  }
}

/**
 * Obtiene todos los jugadores para el listado del panel de administración
 */
export async function getAllPlayersAdmin(): Promise<Player[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("players")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error al obtener jugadores para admin:", error)
    return []
  }

  return ((data as any[]) || []).map(decodePlayer)
}

/**
 * Obtiene un jugador por su ID (para edición en admin)
 */
export async function getPlayerById(id: string): Promise<Player | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    return null
  }

  return decodePlayer(data)
}

/**
 * Obtiene un jugador por su slug (para perfil público)
 */
export async function getPlayerBySlug(slug: string): Promise<Player | null> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error || !data) {
    return null
  }

  return decodePlayer(data)
}
