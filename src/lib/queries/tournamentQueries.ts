import { createPublicClient, createClient } from "@/lib/supabase/server"
import type { Tournament, TournamentStatus } from "@/types"

/**
 * Obtiene todos los torneos públicos con opción de filtrar por estado
 */
export async function getPublicTournaments(status?: TournamentStatus): Promise<Tournament[]> {
  const supabase = createPublicClient()

  let query = supabase
    .from("tournaments")
    .select("*")
    .neq("status", "draft")
    .order("start_date", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error al obtener torneos públicos:", error)
    return []
  }

  return (data as Tournament[]) ?? []
}

/**
 * Obtiene los próximos torneos publicados o en curso (para el Home)
 */
export async function getUpcomingTournaments(limit: number = 3): Promise<Tournament[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("tournaments")
    .select("*")
    .in("status", ["published", "ongoing"])
    .order("start_date", { ascending: true })
    .limit(limit)

  if (error) {
    console.error("Error al obtener próximos torneos:", error)
    return []
  }

  return (data as Tournament[]) ?? []
}

/**
 * Obtiene un torneo por su slug
 */
export async function getTournamentBySlug(slug: string): Promise<Tournament | null> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("tournaments")
    .select("*, tournament_categories(*)")
    .eq("slug", slug)
    .single()

  if (error || !data) {
    return null
  }

  return data as Tournament
}

/**
 * Obtiene un torneo por su ID (para edición en admin)
 */
export async function getTournamentById(id: string): Promise<Tournament | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("tournaments")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    return null
  }

  return data as Tournament
}

/**
 * Obtiene todos los torneos para el listado del panel de administración
 */
export async function getAllTournamentsAdmin(): Promise<Tournament[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("tournaments")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error al obtener torneos para admin:", error)
    return []
  }

  return (data as Tournament[]) ?? []
}
