"use server"

import { revalidatePath } from "next/cache"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import {
  createInscriptionSchema,
  updateInscriptionStatusSchema,
  type CreateInscriptionInput,
} from "@/lib/schemas/inscriptionSchema"
import type { ActionResult } from "@/types"

/**
 * Registra una nueva inscripción pública a un torneo
 */
export async function submitInscriptionAction(
  data: CreateInscriptionInput
): Promise<ActionResult<{ id: string; tournamentTitle: string }>> {
  try {
    const validated = createInscriptionSchema.safeParse(data)
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message ?? "Datos de inscripción inválidos"
      return { success: false, error: firstError }
    }

    const {
      tournament_id,
      category_id,
      full_name,
      email,
      phone,
      province,
      fide_id,
      notes,
    } = validated.data

    // Usar cliente administrativo para validar, insertar y retornar el ID sin restricciones RLS públicas
    const supabase = createAdminClient()

    // 1. Validar que el torneo existe y está abierto
    const { data: tournament, error: tournamentError } = await supabase
      .from("tournaments")
      .select("id, title, slug, status, inscription_type, registration_deadline, max_participants")
      .eq("id", tournament_id)
      .single()

    if (tournamentError || !tournament) {
      return { success: false, error: "El torneo seleccionado no existe o no está disponible." }
    }

    if (!["published", "ongoing"].includes(tournament.status)) {
      return { success: false, error: "Las inscripciones para este torneo no se encuentran activas." }
    }

    if (tournament.inscription_type === "closed") {
      return { success: false, error: "Este torneo tiene el periodo de inscripciones cerrado." }
    }

    // Validar fecha límite si está configurada
    if (tournament.registration_deadline) {
      const today = new Date().toISOString().split("T")[0]
      if (today > tournament.registration_deadline) {
        return { success: false, error: "La fecha límite de inscripción para este torneo ya ha vencido." }
      }
    }

    // 2. Validar límite de cupos si aplica
    if (tournament.max_participants && tournament.max_participants > 0) {
      const { count: currentInscriptions } = await supabase
        .from("inscriptions")
        .select("*", { count: "exact", head: true })
        .eq("tournament_id", tournament_id)
        .neq("status", "rejected")

      if (currentInscriptions !== null && currentInscriptions >= tournament.max_participants) {
        return {
          success: false,
          error: "Los cupos para este torneo se han agotado. Puedes comunicarte con la organización.",
        }
      }
    }

    // 3. Prevenir inscripciones duplicadas con el mismo número o correo en el mismo torneo
    const cleanPhone = phone.trim()
    const digitsOnly = cleanPhone.replace(/\D/g, "")
    const hasRealEmail = Boolean(email && email.trim().length > 0)
    const cleanEmail = hasRealEmail
      ? email!.trim().toLowerCase()
      : `${digitsOnly || Date.now()}@whatsapp.walfachess.com`

    const { data: existing } = await supabase
      .from("inscriptions")
      .select("id, status")
      .eq("tournament_id", tournament_id)
      .neq("status", "rejected")
      .or(`phone.eq.${cleanPhone},email.eq.${cleanEmail}`)
      .maybeSingle()

    if (existing) {
      return {
        success: false,
        error: `Ya existe una inscripción registrada con este número de WhatsApp para este torneo (Estado: ${
          existing.status === "confirmed" ? "Confirmada" : "En revisión"
        }).`,
      }
    }

    // 4. Integrar la provincia en las notas de la inscripción
    const cleanProvince = province && province.trim().length > 0 ? province.trim() : null
    let combinedNotes = notes && notes.trim().length > 0 ? notes.trim() : null
    if (cleanProvince) {
      combinedNotes = combinedNotes
        ? `Provincia: ${cleanProvince} | ${combinedNotes}`
        : `Provincia: ${cleanProvince}`
    }

    // 5. Insertar la inscripción
    const { data: inserted, error: insertError } = await supabase
      .from("inscriptions")
      .insert({
        tournament_id,
        category_id: category_id && category_id.length > 0 ? category_id : null,
        full_name: full_name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        fide_id: fide_id && fide_id.trim().length > 0 ? fide_id.trim() : null,
        notes: combinedNotes,
        status: "pending",
      })
      .select("id")
      .single()

    if (insertError || !inserted) {
      console.error("Error al registrar inscripción:", insertError)
      return {
        success: false,
        error: insertError?.message
          ? `No se pudo registrar la inscripción: ${insertError.message}`
          : "No se pudo registrar la inscripción. Inténtalo nuevamente.",
      }
    }

    revalidatePath("/inscripciones")
    revalidatePath("/admin/inscripciones")
    revalidatePath("/torneos")
    if (tournament.slug) {
      revalidatePath(`/torneos/${tournament.slug}`)
    }

    return {
      success: true,
      data: {
        id: inserted.id,
        tournamentTitle: tournament.title,
      },
      message: "¡Inscripción recibida exitosamente! Te contactaremos vía WhatsApp para confirmar tu participación.",
    }
  } catch (err) {
    console.error("Error inesperado en submitInscriptionAction:", err)
    return { success: false, error: "Ocurrió un error inesperado al procesar la inscripción." }
  }
}

/**
 * Actualiza el estado de una inscripción (Administrador)
 */
export async function updateInscriptionStatusAction(
  inscriptionId: string,
  status: "pending" | "confirmed" | "rejected"
): Promise<ActionResult<{ status: string }>> {
  try {
    const validated = updateInscriptionStatusSchema.safeParse({
      inscription_id: inscriptionId,
      status,
    })

    if (!validated.success) {
      return { success: false, error: "Parámetros inválidos para actualizar el estado." }
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "No autorizado. Inicie sesión como administrador." }
    }

    const { error } = await supabase
      .from("inscriptions")
      .update({ status: validated.data.status })
      .eq("id", validated.data.inscription_id)

    if (error) {
      console.error("Error al actualizar estado de inscripción:", error)
      return { success: false, error: "Error al actualizar el estado de la inscripción." }
    }

    revalidatePath("/admin/inscripciones")
    revalidatePath("/inscripciones")

    return {
      success: true,
      data: { status: validated.data.status },
      message: `Inscripción marcada como ${
        status === "confirmed" ? "Confirmada" : status === "rejected" ? "Rechazada" : "Pendiente"
      }.`,
    }
  } catch (err) {
    console.error("Error en updateInscriptionStatusAction:", err)
    return { success: false, error: "Error inesperado al actualizar la inscripción." }
  }
}

/**
 * Elimina un registro de inscripción (Administrador)
 */
export async function deleteInscriptionAction(inscriptionId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "No autorizado. Inicie sesión como administrador." }
    }

    const { error } = await supabase.from("inscriptions").delete().eq("id", inscriptionId)

    if (error) {
      console.error("Error al eliminar inscripción:", error)
      return { success: false, error: "No se pudo eliminar la inscripción." }
    }

    revalidatePath("/admin/inscripciones")

    return {
      success: true,
      data: undefined,
      message: "Registro de inscripción eliminado correctamente.",
    }
  } catch (err) {
    console.error("Error en deleteInscriptionAction:", err)
    return { success: false, error: "Error inesperado al eliminar la inscripción." }
  }
}
