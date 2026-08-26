import { z } from "zod"

export const newsSchema = z.object({
  title: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(250, "El título no puede exceder los 250 caracteres"),
  slug: z
    .string()
    .min(3, "El enlace/slug debe tener al menos 3 caracteres")
    .max(250, "El slug no puede exceder los 250 caracteres")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "El slug solo puede contener letras minúsculas, números y guiones"),
  excerpt: z
    .string()
    .max(500, "El resumen no puede superar los 500 caracteres")
    .optional()
    .or(z.literal("")),
  content: z
    .string()
    .min(10, "El contenido del artículo debe tener al menos 10 caracteres"),
  cover_image_url: z
    .string()
    .url("Debe ser una URL válida")
    .optional()
    .or(z.literal("")),
  status: z.enum(["draft", "published"]),
  is_featured: z.boolean().default(false),
  tournament_id: z
    .string()
    .uuid("Debe ser un ID de torneo válido")
    .optional()
    .nullable()
    .or(z.literal("")),
  meta_title: z.string().max(100).optional().or(z.literal("")),
  meta_description: z.string().max(250).optional().or(z.literal("")),
})

export type NewsFormData = z.infer<typeof newsSchema>
