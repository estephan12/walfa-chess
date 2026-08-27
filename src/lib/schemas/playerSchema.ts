import { z } from "zod"
import type { ChessTitle } from "@/types"

export const CHESS_TITLES: { value: ChessTitle; label: string }[] = [
  { value: "GM", label: "GM - Gran Maestro" },
  { value: "WGM", label: "WGM - Gran Maestra Femenina" },
  { value: "IM", label: "IM - Maestro Internacional" },
  { value: "WIM", label: "WIM - Maestra Internacional Femenina" },
  { value: "FM", label: "FM - Maestro FIDE" },
  { value: "WFM", label: "WFM - Maestra FIDE Femenina" },
  { value: "CM", label: "CM - Candidato a Maestro" },
  { value: "WCM", label: "WCM - Candidata a Maestra Femenina" },
  { value: "MN", label: "MN - Maestro Nacional" },
  { value: "EN", label: "EN - Experto Nacional" },
]

export const playerSchema = z.object({
  full_name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  slug: z
    .string()
    .min(2, "El slug debe tener al menos 2 caracteres")
    .max(100, "El slug no puede exceder 100 caracteres")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "El slug solo puede contener letras minúsculas, números y guiones"
    ),
  title: z.string().optional().nullable(),
  club: z.string().optional().nullable(),
  birth_date: z.string().optional().nullable(),
  nationality: z.string().min(2, "Código de nacionalidad requerido").default("DO"),
  fide_id: z.string().optional().nullable(),
  fide_rating: z.any().optional().nullable(),
  local_rating: z.any().optional().nullable(),
  photo_url: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
})

export type PlayerFormData = {
  full_name: string
  slug: string
  title?: string | null
  club?: string | null
  birth_date?: string | null
  nationality: string
  fide_id?: string | null
  fide_rating?: number | null
  local_rating?: number | null
  photo_url?: string | null
  bio?: string | null
  is_active: boolean
}
