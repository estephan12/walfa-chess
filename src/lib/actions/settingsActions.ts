"use server"

import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/server"
import type { StatsRibbonConfig } from "@/lib/types/settings"
import type { ActionResult } from "@/types"

/**
 * Guarda o actualiza la configuración de la cinta de estadísticas en site_settings
 */
export async function updateStatsRibbonAction(
  config: StatsRibbonConfig
): Promise<ActionResult<{ message: string }>> {
  try {
    const supabase = createAdminClient()

    const { error } = await supabase.from("site_settings").upsert(
      {
        key: "stats_ribbon",
        value: config as any,
        description: "Cinta de estadísticas de la página principal (Home ribbon)",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    )

    if (error) {
      console.error("Error al actualizar stats_ribbon:", error)
      return { success: false, error: "No se pudo guardar la configuración: " + error.message }
    }

    // Revalidar página de inicio y configuración
    revalidatePath("/")
    revalidatePath("/admin/configuracion")

    return {
      success: true,
      data: { message: "Estadísticas de la cinta actualizadas exitosamente." },
    }
  } catch (err: any) {
    console.error("Excepción en updateStatsRibbonAction:", err)
    return { success: false, error: err.message || "Error al procesar la solicitud." }
  }
}

/**
 * Obtiene el conteo total de visitas almacenado en site_settings
 */
export async function getVisitorStatsAction(): Promise<ActionResult<{ totalVisits: number }>> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "visitor_count")
      .maybeSingle()

    if (error) {
      console.error("Error al obtener visitor_count:", error)
      return { success: false, error: error.message }
    }

    const currentCount = Number(data?.value?.count) || 1250
    return {
      success: true,
      data: { totalVisits: currentCount },
    }
  } catch (err: any) {
    return { success: false, error: err.message || "Error al obtener estadísticas de visitas" }
  }
}

/**
 * Registra e incrementa el conteo de visitas en site_settings
 */
export async function recordVisitAction(): Promise<ActionResult<{ totalVisits: number }>> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "visitor_count")
      .maybeSingle()

    const currentCount = Number(data?.value?.count) || 1250
    const newCount = currentCount + 1

    const { error: upsertError } = await supabase.from("site_settings").upsert(
      {
        key: "visitor_count",
        value: { count: newCount },
        description: "Contador de visitas totales del sitio",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    )

    if (upsertError) {
      console.error("Error al incrementar visitor_count:", upsertError)
      return { success: false, error: upsertError.message }
    }

    return {
      success: true,
      data: { totalVisits: newCount },
    }
  } catch (err: any) {
    return { success: false, error: err.message || "Error al registrar visita" }
  }
}

/**
 * Permite ajustar manualmente el contador de visitas desde administración
 */
export async function updateVisitorCountAction(
  newCount: number
): Promise<ActionResult<{ message: string }>> {
  try {
    const supabase = createAdminClient()
    const { error } = await supabase.from("site_settings").upsert(
      {
        key: "visitor_count",
        value: { count: Math.max(0, newCount) },
        description: "Contador de visitas totales del sitio",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    )

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: { message: "Contador de visitas actualizado" } }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

