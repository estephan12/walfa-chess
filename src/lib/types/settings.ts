export type StatMode = "auto" | "manual"
export type StatIcon = "users" | "trophy" | "award" | "globe"
export type AutoStatType = "players" | "tournaments" | "champions" | "provinces"

export interface StatBlock {
  id: "stat1" | "stat2" | "stat3" | "stat4"
  label: string
  mode: StatMode
  manual_value: string
  auto_value?: string
  icon: StatIcon
  auto_type: AutoStatType
}

export interface StatsRibbonConfig {
  stat1: StatBlock
  stat2: StatBlock
  stat3: StatBlock
  stat4: StatBlock
}

export interface RealSystemStats {
  players: number
  tournaments: number
  champions: number
  provinces: number
}
