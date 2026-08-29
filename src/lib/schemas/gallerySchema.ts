import { z } from "zod"

export const albumSchema = z.object({
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
  description: z.string().optional().nullable(),
  cover_image_url: z.string().optional().nullable(),
  tournament_id: z.string().optional().nullable(),
  is_published: z.boolean().default(false),
  sort_order: z.coerce.number().default(0),
})

export type AlbumFormData = z.infer<typeof albumSchema>
