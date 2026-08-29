import { z } from "zod"

export const createInscriptionSchema = z.object({
  tournament_id: z.string().uuid("Debe seleccionar un torneo válido"),
  category_id: z.string().uuid("Categoría inválida").optional().nullable().or(z.literal("")),
  full_name: z
    .string()
    .min(3, "El nombre completo debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  email: z
    .string()
    .email("Ingrese una dirección de correo electrónico válida"),
  phone: z
    .string()
    .min(7, "El teléfono de contacto debe tener al menos 7 dígitos")
    .max(25, "El teléfono es demasiado largo"),
  fide_id: z
    .string()
    .max(20, "El ID FIDE no puede superar los 20 caracteres")
    .optional()
    .nullable()
    .or(z.literal("")),
  notes: z
    .string()
    .max(500, "Las notas o comentarios no pueden superar los 500 caracteres")
    .optional()
    .nullable()
    .or(z.literal("")),
})

export type CreateInscriptionInput = z.infer<typeof createInscriptionSchema>

export const updateInscriptionStatusSchema = z.object({
  inscription_id: z.string().uuid("ID de inscripción inválido"),
  status: z.enum(["pending", "confirmed", "rejected"], {
    message: "Estado de inscripción inválido",
  }),
})

export type UpdateInscriptionStatusInput = z.infer<typeof updateInscriptionStatusSchema>
