import { createPublicClient, createAdminClient } from "@/lib/supabase/server"
import type { Sponsor } from "@/types"

/**
 * Obtiene todos los patrocinadores activos ordenados por sort_order
 * Consulta pública segura para la visualización en la web
 */
export async function getActiveSponsors(): Promise<Sponsor[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("sponsors")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error al obtener patrocinadores activos:", error)
    return []
  }

  return (data as Sponsor[]) ?? []
}

/**
 * Obtiene todos los patrocinadores para el panel administrativo
 */
export async function getAllSponsorsAdmin(): Promise<Sponsor[]> {
  const adminSupabase = createAdminClient()

  const { data, error } = await adminSupabase
    .from("sponsors")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error al obtener patrocinadores para admin:", error)
    return []
  }

  return (data as Sponsor[]) ?? []
}

/**
 * Obtiene un patrocinador por su ID
 */
export async function getSponsorById(id: string): Promise<Sponsor | null> {
  const adminSupabase = createAdminClient()

  const { data, error } = await adminSupabase
    .from("sponsors")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    return null
  }

  return data as Sponsor
}
