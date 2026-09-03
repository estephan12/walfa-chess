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
