import { z } from "zod"

export const tournamentSchema = z.object({
  title: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(150, "El título no puede exceder 150 caracteres"),
  slug: z
    .string()
    .min(3, "El slug debe tener al menos 3 caracteres")
    .max(150, "El slug no puede exceder 150 caracteres")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "El slug solo puede contener letras minúsculas, números y guiones"
    ),
  type: z.enum([
    "open",
    "invitational",
    "online",
    "blitz",
    "rapid",
    "classical",
    "simultaneous",
  ]),
  status: z.enum(["draft", "published", "ongoing", "finished", "cancelled"]),
  description: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  cover_image_url: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  location_maps_url: z.string().optional().nullable(),
  start_date: z.string().min(1, "La fecha de inicio es requerida"),
  end_date: z.string().optional().nullable(),
  registration_deadline: z.string().optional().nullable(),
  max_participants: z.any().optional().nullable(),
  entry_fee: z.any().optional().nullable(),
  prize_pool: z.string().optional().nullable(),
  time_control: z.string().optional().nullable(),
  rounds: z.any().optional().nullable(),
  inscription_type: z.enum(["external", "form", "closed"]),
  inscription_url: z.string().optional().nullable(),
  organizer_name: z.string().optional().nullable(),
  organizer_contact: z.string().optional().nullable(),
  is_featured: z.boolean(),
})

export type TournamentFormData = {
  title: string
  slug: string
  type: "open" | "invitational" | "online" | "blitz" | "rapid" | "classical" | "simultaneous"
  status: "draft" | "published" | "ongoing" | "finished" | "cancelled"
  description?: string | null
  content?: string | null
  cover_image_url?: string | null
  location?: string | null
  location_maps_url?: string | null
  start_date: string
  end_date?: string | null
  registration_deadline?: string | null
  max_participants?: number | null
  entry_fee?: number | null
  prize_pool?: string | null
  time_control?: string | null
  rounds?: number | null
  inscription_type: "external" | "form" | "closed"
  inscription_url?: string | null
  organizer_name?: string | null
  organizer_contact?: string | null
  is_featured: boolean
}
