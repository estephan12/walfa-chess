import { z } from "zod"

export const sponsorSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre del patrocinador debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  website_url: z
    .string()
    .url("Debe ser una URL válida (ej. https://empresa.com)")
    .optional()
    .or(z.literal(""))
    .nullable(),
  logo_url: z.string().optional().nullable(),
  tier: z.enum(["platinum", "gold", "silver", "bronze", "media"], {
    message: "Selecciona una categoría válida",
  }).default("bronze"),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().default(0),
})

export type SponsorFormData = z.infer<typeof sponsorSchema>
