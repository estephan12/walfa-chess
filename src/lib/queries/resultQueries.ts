import { createPublicClient, createClient } from "@/lib/supabase/server"
import type { Tournament, TournamentCategory, TournamentResult, Player } from "@/types"
import { decodePlayer } from "@/lib/queries/playerQueries"

export interface TournamentWithResultsOverview extends Tournament {
  results_count: number
  categories_count: number
  winner?: {
    player_name: string
    player_id?: string | null
    points?: number | null
    prize_won?: string | null
  } | null
}

/**
 * Obtiene los torneos para la lista pública de resultados
 */
export async function getPublicTournamentsWithResults(): Promise<TournamentWithResultsOverview[]> {
  const supabase = createPublicClient()

  // Traer torneos finalizados o en curso
  const { data: tournaments, error } = await supabase
    .from("tournaments")
    .select("*, tournament_categories(*), tournament_results(*)")
    .neq("status", "draft")
    .order("start_date", { ascending: false })

  if (error || !tournaments) {
    console.error("Error al obtener torneos con resultados:", error)
    return []
  }

  return tournaments.map((t: any) => {
    const results = t.tournament_results || []
    const categories = t.tournament_categories || []
    const sortedResults = [...results].sort((a: any, b: any) => a.position - b.position)
    const winner = sortedResults.length > 0 ? sortedResults[0] : null

    return {
      ...t,
      results_count: results.length,
      categories_count: categories.length,
      winner: winner
        ? {
            player_name: winner.player_name,
            player_id: winner.player_id,
            points: winner.points,
            prize_won: winner.prize_won,
          }
        : null,
    }
  })
}

/**
 * Obtiene todos los torneos para el listado del panel de administración de resultados
 */
export async function getAllTournamentsWithResultsAdmin(): Promise<TournamentWithResultsOverview[]> {
  const supabase = await createClient()

  const { data: tournaments, error } = await supabase
    .from("tournaments")
    .select("*, tournament_categories(*), tournament_results(*)")
    .order("start_date", { ascending: false })

  if (error || !tournaments) {
    console.error("Error al obtener torneos para admin resultados:", error)
    return []
  }

  return tournaments.map((t: any) => {
    const results = t.tournament_results || []
    const categories = t.tournament_categories || []
    const sortedResults = [...results].sort((a: any, b: any) => a.position - b.position)
    const winner = sortedResults.length > 0 ? sortedResults[0] : null

    return {
      ...t,
      results_count: results.length,
      categories_count: categories.length,
      winner: winner
        ? {
            player_name: winner.player_name,
            player_id: winner.player_id,
            points: winner.points,
            prize_won: winner.prize_won,
          }
        : null,
    }
  })
}

/**
 * Obtiene un torneo con todas sus categorías, resultados y datos de los jugadores asociados
 */
export async function getTournamentResultsFull(tournamentId: string) {
  const supabase = createPublicClient()

  const [tournamentRes, categoriesRes, resultsRes] = await Promise.all([
    supabase.from("tournaments").select("*").eq("id", tournamentId).single(),
    supabase.from("tournament_categories").select("*").eq("tournament_id", tournamentId).order("created_at", { ascending: true }),
    supabase.from("tournament_results").select("*, player:players(*)").eq("tournament_id", tournamentId).order("position", { ascending: true }),
  ])

  if (tournamentRes.error || !tournamentRes.data) {
    return null
  }

  const results = (resultsRes.data || []).map((r: any) => ({
    ...r,
    player: r.player ? decodePlayer(r.player) : null,
  }))

  return {
    tournament: tournamentRes.data as Tournament,
    categories: (categoriesRes.data || []) as TournamentCategory[],
    results: results as (TournamentResult & { player?: Player | null })[],
  }
}
