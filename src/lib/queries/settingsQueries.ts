import { createPublicClient } from "@/lib/supabase/server"
import type { StatsRibbonConfig, RealSystemStats } from "@/lib/types/settings"

export const DEFAULT_STATS_RIBBON_CONFIG: StatsRibbonConfig = {
  stat1: {
    id: "stat1",
    label: "Jugadores Formados",
    mode: "manual",
    manual_value: "+1,200",
    icon: "users",
    auto_type: "players",
  },
  stat2: {
    id: "stat2",
    label: "Torneos Realizados",
    mode: "manual",
    manual_value: "+80",
    icon: "trophy",
    auto_type: "tournaments",
  },
  stat3: {
    id: "stat3",
    label: "Campeones Destacados",
    mode: "manual",
    manual_value: "+150",
    icon: "award",
    auto_type: "champions",
  },
  stat4: {
    id: "stat4",
    label: "Provincias Alcanzadas",
    mode: "manual",
    manual_value: "+15",
    icon: "globe",
    auto_type: "provinces",
  },
}

/**
 * Obtiene el conteo verídico de datos almacenados en la base de datos
 */
export async function getRealSystemStats(): Promise<RealSystemStats> {
  const supabase = createPublicClient()

  try {
    const [playersRes, tournamentsRes, championsRes, provincesRes] = await Promise.all([
      supabase.from("players").select("id", { count: "exact", head: true }),
      supabase.from("tournaments").select("id", { count: "exact", head: true }),
      supabase.from("tournament_results").select("id", { count: "exact", head: true }).eq("position", 1),
      supabase.from("tournaments").select("location"),
    ])

    const playersCount = playersRes.count ?? 0
    const tournamentsCount = tournamentsRes.count ?? 0
    let championsCount = championsRes.count ?? 0

    // Si no hay resultados de campeones aún, contar jugadores titulados como alternativa
    if (championsCount === 0) {
      const { count: titledCount } = await supabase
        .from("players")
        .select("id", { count: "exact", head: true })
        .not("title", "is", null)
      championsCount = titledCount ?? 0
    }

    // Calcular provincias o sedes distintas registradas
    const locations = provincesRes.data?.map((t) => t.location).filter(Boolean) ?? []
    const uniqueLocations = new Set(locations)
    const provincesCount = uniqueLocations.size > 0 ? uniqueLocations.size : 1

    return {
      players: playersCount,
      tournaments: tournamentsCount,
      champions: championsCount,
      provinces: provincesCount,
    }
  } catch (error) {
    console.error("Error al obtener estadísticas del sistema:", error)
    return {
      players: 0,
      tournaments: 0,
      champions: 0,
      provinces: 0,
    }
  }
}

/**
 * Obtiene la configuración de la cinta de estadísticas (combinando configuración manual con valores calculados automáticos)
 */
export async function getStatsRibbonConfig(): Promise<{
  config: StatsRibbonConfig
  realStats: RealSystemStats
  displayStats: { icon: string; value: string; label: string }[]
}> {
  const supabase = createPublicClient()
  const realStats = await getRealSystemStats()

  let savedConfig = DEFAULT_STATS_RIBBON_CONFIG

  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "stats_ribbon")
      .maybeSingle()

    if (!error && data?.value) {
      savedConfig = {
        ...DEFAULT_STATS_RIBBON_CONFIG,
        ...(typeof data.value === "string" ? JSON.parse(data.value) : data.value),
      }
    }
  } catch (e) {
    console.error("Error al leer stats_ribbon de site_settings:", e)
  }

  // Generar los valores que se deben mostrar según el modo seleccionado (auto vs manual)
  const formatAuto = (val: number) => (val > 0 ? `+${val}` : `${val}`)

  const stat1Value =
    savedConfig.stat1.mode === "auto"
      ? formatAuto(realStats.players)
      : savedConfig.stat1.manual_value || formatAuto(realStats.players)

  const stat2Value =
    savedConfig.stat2.mode === "auto"
      ? formatAuto(realStats.tournaments)
      : savedConfig.stat2.manual_value || formatAuto(realStats.tournaments)

  const stat3Value =
    savedConfig.stat3.mode === "auto"
      ? formatAuto(realStats.champions)
      : savedConfig.stat3.manual_value || formatAuto(realStats.champions)

  const stat4Value =
    savedConfig.stat4.mode === "auto"
      ? formatAuto(realStats.provinces)
      : savedConfig.stat4.manual_value || formatAuto(realStats.provinces)

  // Asignar auto_value en la configuración para visualización en el admin
  savedConfig.stat1.auto_value = formatAuto(realStats.players)
  savedConfig.stat2.auto_value = formatAuto(realStats.tournaments)
  savedConfig.stat3.auto_value = formatAuto(realStats.champions)
  savedConfig.stat4.auto_value = formatAuto(realStats.provinces)

  const displayStats = [
    {
      icon: savedConfig.stat1.icon,
      value: stat1Value,
      label: savedConfig.stat1.label,
    },
    {
      icon: savedConfig.stat2.icon,
      value: stat2Value,
      label: savedConfig.stat2.label,
    },
    {
      icon: savedConfig.stat3.icon,
      value: stat3Value,
      label: savedConfig.stat3.label,
    },
    {
      icon: savedConfig.stat4.icon,
      value: stat4Value,
      label: savedConfig.stat4.label,
    },
  ]

  return {
    config: savedConfig,
    realStats,
    displayStats,
  }
}
