import { createPublicClient, createClient, createAdminClient } from "@/lib/supabase/server"
import type { Inscription, Tournament, TournamentCategory } from "@/types"

export interface TournamentWithCategories extends Tournament {
  categories?: TournamentCategory[]
  inscriptions_count?: number
  available_spots?: number | null
  is_full?: boolean
}

export interface PublicRegisteredPlayer {
  id: string
  full_name: string
  province?: string | null
  category_name?: string | null
  fide_id?: string | null
  status: "pending" | "confirmed"
  created_at: string
}

export interface InscriptionWithRelations
  extends Omit<Inscription, "tournament" | "category"> {
  tournament?: {
    id: string
    title: string
    slug: string
  } | null
  category?: {
    id: string
    name: string
  } | null
}


/**
 * Extrae la provincia del campo notes en caso de que no esté en la columna dedicada
 */
export function extractProvince(notes: string | null | undefined): string | null {
  if (!notes) return null
  const match = notes.match(/Provincia:\s*([^|\n\r]+)/i)
  return match ? match[1].trim() : null
}

/**
 * Obtiene el listado público de jugadores inscritos para un torneo específico
 * (Sin exponer datos privados como teléfono o correo electrónico)
 */
export async function getPublicInscriptionsByTournamentId(
  tournamentId: string
): Promise<PublicRegisteredPlayer[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("inscriptions")
    .select(`
      id,
      full_name,
      notes,
      fide_id,
      status,
      created_at,
      category:tournament_categories(name)
    `)
    .eq("tournament_id", tournamentId)
    .neq("status", "rejected")
    .order("created_at", { ascending: true })

  if (error || !data) {
    console.error("Error al obtener jugadores inscritos públicos:", error)
    return []
  }

  return data.map((item: any) => ({
    id: item.id,
    full_name: item.full_name,
    province: extractProvince(item.notes),
    category_name: item.category?.name ?? null,
    fide_id: item.fide_id ?? null,
    status: item.status,
    created_at: item.created_at,
  }))
}

/**
 * Obtiene los torneos disponibles para inscripción pública con cupos calculados
 */
export async function getOpenTournamentsForInscription(): Promise<TournamentWithCategories[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("tournaments")
    .select("*, categories:tournament_categories(*)")
    .in("status", ["published", "ongoing"])
    .neq("inscription_type", "closed")
    .order("start_date", { ascending: true })

  if (error || !data) {
    console.error("Error al obtener torneos para inscripción:", error)
    return []
  }

  // Obtener conteo de inscripciones activas por torneo
  const { data: countData } = await supabase
    .from("inscriptions")
    .select("tournament_id")
    .neq("status", "rejected")

  const countsByTournament: Record<string, number> = {}
  if (countData) {
    for (const row of countData) {
      countsByTournament[row.tournament_id] = (countsByTournament[row.tournament_id] || 0) + 1
    }
  }

  return (data as unknown as TournamentWithCategories[]).map((t) => {
    const inscriptions_count = countsByTournament[t.id] || 0
    const max_participants = t.max_participants
    const available_spots =
      max_participants && max_participants > 0
        ? Math.max(0, max_participants - inscriptions_count)
        : null
    const is_full = available_spots !== null && available_spots <= 0

    return {
      ...t,
      inscriptions_count,
      available_spots,
      is_full,
    }
  })
}

/**
 * Obtiene un torneo específico con sus categorías para el formulario
 */
export async function getTournamentBySlugForInscription(slug: string): Promise<TournamentWithCategories | null> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("tournaments")
    .select("*, categories:tournament_categories(*)")
    .eq("slug", slug)
    .single()

  if (error || !data) {
    return null
  }

  return data as unknown as TournamentWithCategories
}

/**
 * Obtiene todas las solicitudes de inscripción para el panel de administración
 */
export async function getAllInscriptionsAdmin(filters?: {
  tournamentId?: string
  status?: string
}): Promise<InscriptionWithRelations[]> {
  const supabase = await createClient()

  let query = supabase
    .from("inscriptions")
    .select(`
      *,
      tournament:tournaments(id, title, slug),
      category:tournament_categories(id, name)
    `)
    .order("created_at", { ascending: false })

  if (filters?.tournamentId && filters.tournamentId !== "all") {
    query = query.eq("tournament_id", filters.tournamentId)
  }

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error al obtener inscripciones para admin:", error)
    return []
  }

  return (data as unknown as InscriptionWithRelations[]) ?? []
}

/**
 * Estadísticas de inscripciones para el panel
 */
export async function getInscriptionStatsAdmin() {
  const supabase = await createClient()

  const [
    { count: totalCount },
    { count: pendingCount },
    { count: confirmedCount },
    { count: rejectedCount },
  ] = await Promise.all([
    supabase.from("inscriptions").select("*", { count: "exact", head: true }),
    supabase.from("inscriptions").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("inscriptions").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
    supabase.from("inscriptions").select("*", { count: "exact", head: true }).eq("status", "rejected"),
  ])

  return {
    total: totalCount ?? 0,
    pending: pendingCount ?? 0,
    confirmed: confirmedCount ?? 0,
    rejected: rejectedCount ?? 0,
  }
}
