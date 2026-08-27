"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import {
  tournamentResultSchema,
  tournamentCategorySchema,
  type TournamentResultFormData,
  type TournamentCategoryFormData,
} from "@/lib/schemas/resultSchema"
import type { ActionResult, TournamentResult, TournamentCategory } from "@/types"

function sanitizeNumber(val: any): number | null {
  if (val === "" || val === null || val === undefined) return null
  const num = Number(val)
  return isNaN(num) ? null : num
}

function sanitizeString(val: any): string | null {
  if (val === null || val === undefined) return null
  if (typeof val !== "string") return String(val)
  const trimmed = val.trim()
  return trimmed === "" ? null : trimmed
}

/**
 * Guarda o actualiza un resultado individual en un torneo
 */
export async function saveTournamentResultAction(
  formData: TournamentResultFormData,
  resultId?: string
): Promise<ActionResult<TournamentResult>> {
  try {
    const validated = tournamentResultSchema.safeParse(formData)
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message ?? "Datos de resultado inválidos"
      return { success: false, error: firstError }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "No autorizado. Inicia sesión primero." }
    }

    const payload = {
      tournament_id: validated.data.tournament_id,
      category_id: sanitizeString(validated.data.category_id),
      player_id: sanitizeString(validated.data.player_id),
      player_name: validated.data.player_name.trim(),
      position: Number(validated.data.position),
      points: sanitizeNumber(validated.data.points),
      rating_performance: sanitizeNumber(validated.data.rating_performance),
      prize_won: sanitizeString(validated.data.prize_won),
    }

    let query = supabase.from("tournament_results")
    let res

    if (resultId) {
      res = await query.update(payload).eq("id", resultId).select().single()
    } else {
      res = await query.insert(payload).select().single()
    }

    if (res.error) {
      console.error("Error al guardar resultado:", res.error)
      if (res.error.code === "23505") {
        return { success: false, error: "Ya existe un resultado para esa posición y categoría en este torneo." }
      }
      return { success: false, error: res.error.message || "Error al guardar el resultado" }
    }

    revalidatePath("/resultados")
    revalidatePath(`/resultados/${validated.data.tournament_id}`)
    revalidatePath("/admin/resultados")
    revalidatePath(`/admin/resultados/${validated.data.tournament_id}`)

    return {
      success: true,
      data: res.data as TournamentResult,
      message: resultId ? "Posición actualizada" : "Posición registrada exitosamente",
    }
  } catch (err: any) {
    console.error("Error inesperado en saveTournamentResultAction:", err)
    return { success: false, error: err?.message ?? "Error interno del servidor" }
  }
}

/**
 * Elimina una posición/resultado
 */
export async function deleteTournamentResultAction(
  resultId: string,
  tournamentId: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "No autorizado" }
    }

    const { error } = await supabase
      .from("tournament_results")
      .delete()
      .eq("id", resultId)

    if (error) {
      console.error("Error al eliminar resultado:", error)
      return { success: false, error: error.message || "Error al eliminar la posición" }
    }

    revalidatePath("/resultados")
    revalidatePath(`/resultados/${tournamentId}`)
    revalidatePath("/admin/resultados")
    revalidatePath(`/admin/resultados/${tournamentId}`)

    return { success: true, data: undefined, message: "Posición eliminada correctamente" }
  } catch (err: any) {
    console.error("Error al eliminar resultado:", err)
    return { success: false, error: err?.message ?? "Error al eliminar la posición" }
  }
}

/**
 * Crea una nueva categoría para un torneo
 */
export async function createTournamentCategoryAction(
  formData: TournamentCategoryFormData
): Promise<ActionResult<TournamentCategory>> {
  try {
    const validated = tournamentCategorySchema.safeParse(formData)
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message ?? "Datos de categoría inválidos"
      return { success: false, error: firstError }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "No autorizado" }
    }

    const payload = {
      tournament_id: validated.data.tournament_id,
      name: validated.data.name.trim(),
      min_rating: sanitizeNumber(validated.data.min_rating),
      max_rating: sanitizeNumber(validated.data.max_rating),
      prize: sanitizeString(validated.data.prize),
    }

    const { data, error } = await supabase
      .from("tournament_categories")
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error("Error al crear categoría:", error)
      return { success: false, error: error.message || "Error al crear la categoría" }
    }

    revalidatePath("/resultados")
    revalidatePath(`/resultados/${validated.data.tournament_id}`)
    revalidatePath("/admin/resultados")
    revalidatePath(`/admin/resultados/${validated.data.tournament_id}`)

    return { success: true, data: data as TournamentCategory, message: "Categoría creada con éxito" }
  } catch (err: any) {
    console.error("Error en createTournamentCategoryAction:", err)
    return { success: false, error: err?.message ?? "Error interno del servidor" }
  }
}

/**
 * Elimina una categoría de un torneo
 */
export async function deleteTournamentCategoryAction(
  categoryId: string,
  tournamentId: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "No autorizado" }
    }

    const { error } = await supabase
      .from("tournament_categories")
      .delete()
      .eq("id", categoryId)

    if (error) {
      console.error("Error al eliminar categoría:", error)
      return { success: false, error: error.message || "Error al eliminar categoría" }
    }

    revalidatePath("/resultados")
    revalidatePath(`/resultados/${tournamentId}`)
    revalidatePath("/admin/resultados")
    revalidatePath(`/admin/resultados/${tournamentId}`)

    return { success: true, data: undefined, message: "Categoría eliminada" }
  } catch (err: any) {
    console.error("Error al eliminar categoría:", err)
    return { success: false, error: err?.message ?? "Error interno" }
  }
}
