import { createPublicClient, createClient } from "@/lib/supabase/server"
import type { Inscription, Tournament, TournamentCategory } from "@/types"

export interface TournamentWithCategories extends Tournament {
  categories?: TournamentCategory[]
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
 * Obtiene los torneos disponibles para inscripción pública
 */
export async function getOpenTournamentsForInscription(): Promise<TournamentWithCategories[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("tournaments")
    .select("*, categories:tournament_categories(*)")
    .in("status", ["published", "ongoing"])
    .neq("inscription_type", "closed")
    .order("start_date", { ascending: true })

  if (error) {
    console.error("Error al obtener torneos para inscripción:", error)
    return []
  }

  return (data as unknown as TournamentWithCategories[]) ?? []
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
