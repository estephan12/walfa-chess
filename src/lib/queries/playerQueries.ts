import { createPublicClient, createClient } from "@/lib/supabase/server"
import type { Player } from "@/types"

/**
 * Extrae calificaciones de modalidades (Blitz, Rápido) desde el texto de la biografía
 */
export function extractRatingsFromText(text: string | null | undefined): {
  blitz: number | null
  rapid: number | null
} {
  if (!text) return { blitz: null, rapid: null }

  let blitz: number | null = null
  let rapid: number | null = null

  // Blitz
  const blitzMatch =
    text.match(/Rating (?:WALFA-CHESS )?Blitz:\s*(\d+)/i) ||
    text.match(/\bBlitz:\s*(\d+)/i)
  if (blitzMatch) {
    blitz = parseInt(blitzMatch[1], 10)
  }

  // Rápido
  const rapidMatch =
    text.match(/Rating (?:propio WALFA-CHESS — )?R[aá]pido:\s*(\d+)/i) ||
    text.match(/Rating (?:WALFA-CHESS )?R[aá]pido:\s*(\d+)/i) ||
    text.match(/\bR[aá]pido:\s*(\d+)/i)
  if (rapidMatch) {
    rapid = parseInt(rapidMatch[1], 10)
  }

  return { blitz, rapid }
}

/**
 * Decodifica un registro de la base de datos para extraer de forma segura
 * title, club, bio y las modalidades de Elo: Estándar, Rápido y Blitz.
 */
export function decodePlayer(raw: any): Player {
  if (!raw) return raw

  let title = raw.title || null
  let club = raw.club || null
  let bio = raw.bio || null
  let rating_standard: number | null = raw.rating_standard || raw.fide_rating || null
  let rating_rapid: number | null = raw.rating_rapid || null
  let rating_blitz: number | null = raw.rating_blitz || null
  let innerBioText = bio

  if (bio && typeof bio === "string" && bio.trim().startsWith("{") && bio.trim().endsWith("}")) {
    try {
      const parsed = JSON.parse(bio)
      title = title || parsed.title || null
      club = club || parsed.club || null
      innerBioText = parsed.bio || null
      bio = innerBioText
      if (parsed.rating_standard) rating_standard = Number(parsed.rating_standard)
      if (parsed.rating_rapid) rating_rapid = Number(parsed.rating_rapid)
      if (parsed.rating_blitz) rating_blitz = Number(parsed.rating_blitz)
    } catch {
      // Si falla el parseo de JSON, se mantiene el bio original
    }
  }

  // Extraer blitz y rápido del texto del bio si no estaban fijados explícitamente
  const fromText = extractRatingsFromText(innerBioText || bio)
  if (!rating_blitz && fromText.blitz) {
    rating_blitz = fromText.blitz
  }
  if (!rating_rapid && fromText.rapid) {
    rating_rapid = fromText.rapid
  }

  return {
    ...raw,
    title,
    club,
    bio,
    fide_rating: raw.fide_rating || rating_standard,
    rating_standard,
    rating_rapid,
    rating_blitz,
  }
}

export interface PlayerRankingFilters {
  ratingType?: "standard" | "rapid" | "blitz" | "local" | "fide"
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

  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("is_active", true)

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

  const getPlayerRating = (p: Player, type?: string): number => {
    switch (type) {
      case "blitz":
        return p.rating_blitz ?? 0
      case "rapid":
        return p.rating_rapid ?? 0
      case "local":
        return p.local_rating ?? 0
      case "standard":
      case "fide":
      default:
        return (p.rating_standard || p.fide_rating) ?? 0
    }
  }

  // Filtro por categoría de Elo
  if (filters?.category && filters.category !== "all") {
    players = players.filter((p) => {
      const rating = getPlayerRating(p, filters.ratingType)
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

  // Ordenar por rating descendente
  players.sort((a, b) => {
    const rA = getPlayerRating(a, filters?.ratingType)
    const rB = getPlayerRating(b, filters?.ratingType)
    return rB - rA
  })

  return players
}

/**
 * Obtiene métricas y estadísticas de los jugadores para los contadores de la clasificación
 */
export async function getPlayerStats() {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("is_active", true)

  if (error || !data) {
    return {
      totalPlayers: 0,
      titledPlayers: 0,
      topFideRating: 0,
      topStandardRating: 0,
      topRapidRating: 0,
      topBlitzRating: 0,
      avgFideRating: 0,
    }
  }

  const decoded = data.map(decodePlayer)
  const total = decoded.length
  let titled = 0
  let topStandard = 0
  let topRapid = 0
  let topBlitz = 0
  let totalRatingSum = 0
  let ratedCount = 0

  decoded.forEach((p) => {
    if (p.title) titled++
    const std = p.rating_standard || p.fide_rating || 0
    const rap = p.rating_rapid || 0
    const blz = p.rating_blitz || 0

    if (std > topStandard) topStandard = std
    if (rap > topRapid) topRapid = rap
    if (blz > topBlitz) topBlitz = blz

    if (std > 0) {
      totalRatingSum += std
      ratedCount++
    }
  })

  return {
    totalPlayers: total,
    titledPlayers: titled,
    topFideRating: topStandard,
    topStandardRating: topStandard,
    topRapidRating: topRapid,
    topBlitzRating: topBlitz,
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
