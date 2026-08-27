import { z } from "zod"

export const tournamentResultSchema = z.object({
  tournament_id: z.string().uuid("ID de torneo inválido"),
  category_id: z.string().optional().nullable(),
  player_id: z.string().optional().nullable(),
  player_name: z
    .string()
    .min(2, "El nombre del jugador debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  position: z.coerce.number().int().min(1, "La posición debe ser al menos 1"),
  points: z.any().optional().nullable(),
  rating_performance: z.any().optional().nullable(),
  prize_won: z.string().optional().nullable(),
})

export type TournamentResultFormData = {
  tournament_id: string
  category_id?: string | null
  player_id?: string | null
  player_name: string
  position: number
  points?: number | null
  rating_performance?: number | null
  prize_won?: string | null
}

export const tournamentCategorySchema = z.object({
  tournament_id: z.string().uuid("ID de torneo inválido"),
  name: z
    .string()
    .min(2, "El nombre de la categoría debe tener al menos 2 caracteres")
    .max(80, "El nombre no puede exceder 80 caracteres"),
  min_rating: z.any().optional().nullable(),
  max_rating: z.any().optional().nullable(),
  prize: z.string().optional().nullable(),
})

export type TournamentCategoryFormData = {
  tournament_id: string
  name: string
  min_rating?: number | null
  max_rating?: number | null
  prize?: string | null
}
