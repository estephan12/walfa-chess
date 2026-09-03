"use client"

import { useState } from "react"
import {
  Users,
  Trophy,
  Award,
  Globe,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Database,
  Edit3,
  RotateCcw,
  Sparkles,
  Eye,
} from "lucide-react"
import type { StatsRibbonConfig, RealSystemStats, StatBlock, StatIcon } from "@/lib/types/settings"
import { updateStatsRibbonAction } from "@/lib/actions/settingsActions"
import { Button } from "@/components/ui/button"

interface Props {
  initialConfig: StatsRibbonConfig
  realStats: RealSystemStats
}

const ICONS_MAP: Record<StatIcon, any> = {
  users: Users,
  trophy: Trophy,
  award: Award,
  globe: Globe,
}

export function StatsRibbonConfigForm({ initialConfig, realStats }: Props) {
  const [config, setConfig] = useState<StatsRibbonConfig>(initialConfig)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const updateBlock = (key: keyof StatsRibbonConfig, patch: Partial<StatBlock>) => {
    setConfig((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...patch,
      },
    }))
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  const getDisplayValue = (block: StatBlock) => {
    if (block.mode === "auto") {
      return block.auto_value || "0"
    }
    return block.manual_value || "0"
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const res = await updateStatsRibbonAction(config)
      if (res.success) {
        setSuccessMessage("¡Configuración de la cinta guardada con éxito! La página de inicio ha sido actualizada.")
      } else {
        setErrorMessage(res.error || "Ocurrió un error al guardar los cambios.")
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Error al conectar con el servidor.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetDefaults = () => {
    if (confirm("¿Estás seguro de restablecer los valores por defecto de la cinta de estadísticas?")) {
      setConfig({
        stat1: {
          id: "stat1",
          label: "Jugadores Formados",
          mode: "manual",
          manual_value: "+1,200",
          auto_value: `+${realStats.players}`,
          icon: "users",
          auto_type: "players",
        },
        stat2: {
          id: "stat2",
          label: "Torneos Realizados",
          mode: "manual",
          manual_value: "+80",
          auto_value: `+${realStats.tournaments}`,
          icon: "trophy",
          auto_type: "tournaments",
        },
        stat3: {
          id: "stat3",
          label: "Campeones Destacados",
          mode: "manual",
          manual_value: "+150",
          auto_value: `+${realStats.champions}`,
          icon: "award",
          auto_type: "champions",
        },
        stat4: {
          id: "stat4",
          label: "Provincias Alcanzadas",
          mode: "manual",
          manual_value: "+15",
          auto_value: `+${realStats.provinces}`,
          icon: "globe",
          auto_type: "provinces",
        },
      })
    }
  }

  const blocksList: { key: keyof StatsRibbonConfig; title: string; hint: string; realCount: number }[] = [
    {
      key: "stat1",
      title: "Estadística 1 (Jugadores)",
      hint: "Cuenta el total de jugadores federados y registrados en la base de datos.",
      realCount: realStats.players,
    },
    {
      key: "stat2",
      title: "Estadística 2 (Torneos)",
      hint: "Cuenta el total de torneos organizados y publicados en la plataforma.",
      realCount: realStats.tournaments,
    },
    {
      key: "stat3",
      title: "Estadística 3 (Campeones / Podios)",
      hint: "Cuenta los campeones oficiales con 1er lugar o jugadores titulados.",
      realCount: realStats.champions,
    },
    {
      key: "stat4",
      title: "Estadística 4 (Provincias / Sedes)",
      hint: "Cuenta las provincias o sedes distintas con eventos en el sistema.",
      realCount: realStats.provinces,
    },
  ]

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* VISTA PREVIA EN VIVO DE LA CINTA */}
      <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-[#5FA8D3]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F0F4F8]">
              Vista Previa en Vivo (Así se verá en la página de inicio)
            </span>
          </div>
          <span className="text-[11px] text-[#94A3B8]">
            Se actualiza automáticamente al escribir o cambiar de modo
          </span>
        </div>

        {/* Cinta idéntica al diseño */}
        <div className="rounded-xl overflow-hidden border border-[#2B5B84]/60 bg-[#081830] text-white py-8 px-6 shadow-inner">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {(["stat1", "stat2", "stat3", "stat4"] as (keyof StatsRibbonConfig)[]).map((k) => {
              const b = config[k]
              const Icon = ICONS_MAP[b.icon] || Users
              const val = getDisplayValue(b)

              return (
                <div key={k} className="flex items-center justify-center gap-3 sm:gap-4 text-left">
                  <div className="text-white opacity-80 shrink-0">
                    <Icon className="h-8 w-8 sm:h-9 sm:w-9 stroke-[1.5]" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                      {val}
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-300 font-medium leading-tight mt-0.5">
                      {b.label}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* FEEDBACK BANNERS */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/50 flex items-center gap-3 text-emerald-300 text-sm animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-500/50 flex items-center gap-3 text-rose-300 text-sm animate-in fade-in">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* CONFIGURACIÓN DE LOS 4 BLOQUES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blocksList.map(({ key, title, hint, realCount }) => {
          const block = config[key]
          const isAuto = block.mode === "auto"

          return (
            <div
              key={key}
              className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-6 shadow-lg space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Cabecera del bloque */}
                <div className="flex items-center justify-between pb-3 border-b border-[#2B5B84]/50">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-[#0B0F19] border border-[#2B5B84] text-[#5FA8D3]">
                      {(() => {
                        const Icon = ICONS_MAP[block.icon] || Users
                        return <Icon className="h-4 w-4" />
                      })()}
                    </div>
                    <h3 className="font-black text-sm text-[#F0F4F8]">{title}</h3>
                  </div>

                  {/* Badge de dato real detectado */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0B0F19] border border-[#2B5B84] text-[#94A3B8]">
                    <Database className="h-3 w-3 text-[#5FA8D3]" />
                    En BD: <strong className="text-white font-mono">{realCount}</strong>
                  </span>
                </div>

                <p className="text-xs text-[#94A3B8]">{hint}</p>

                {/* Selector de Modo: Automático vs Manual */}
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                    Origen del Dato
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#0B0F19] border border-[#2B5B84]">
                    <button
                      type="button"
                      onClick={() => updateBlock(key, { mode: "auto" })}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isAuto
                          ? "bg-[#5FA8D3] text-[#0B0F19] shadow-sm"
                          : "text-[#94A3B8] hover:text-[#F0F4F8]"
                      }`}
                    >
                      <Database className="h-3.5 w-3.5" />
                      Automático (BD)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateBlock(key, { mode: "manual" })}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        !isAuto
                          ? "bg-[#5FA8D3] text-[#0B0F19] shadow-sm"
                          : "text-[#94A3B8] hover:text-[#F0F4F8]"
                      }`}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Manual (Personalizado)
                    </button>
                  </div>
                </div>

                {/* Campo de Valor */}
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                    {isAuto ? "Valor Calculado en Vivo" : "Valor Manual a Mostrar"}
                  </label>
                  {isAuto ? (
                    <div className="w-full rounded-xl bg-[#0B0F19]/60 border border-[#2B5B84]/50 px-4 py-2.5 text-sm font-mono font-bold text-emerald-400 flex items-center justify-between">
                      <span>{block.auto_value || `+${realCount}`}</span>
                      <span className="text-[10px] text-[#94A3B8] font-normal font-sans">
                        Calculado desde la BD
                      </span>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={block.manual_value}
                      onChange={(e) => updateBlock(key, { manual_value: e.target.value })}
                      placeholder="Ej. +1,200 o 80+"
                      className="w-full rounded-xl bg-[#0B0F19] border border-[#2B5B84] px-4 py-2.5 text-sm font-mono font-bold text-[#F0F4F8] focus:border-[#5FA8D3] focus:outline-none focus:ring-1 focus:ring-[#5FA8D3]"
                    />
                  )}
                </div>

                {/* Campo de Etiqueta */}
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                    Etiqueta / Descripción
                  </label>
                  <input
                    type="text"
                    value={block.label}
                    onChange={(e) => updateBlock(key, { label: e.target.value })}
                    placeholder="Ej. Jugadores Formados"
                    className="w-full rounded-xl bg-[#0B0F19] border border-[#2B5B84] px-4 py-2.5 text-sm text-[#F0F4F8] focus:border-[#5FA8D3] focus:outline-none focus:ring-1 focus:ring-[#5FA8D3]"
                  />
                </div>

                {/* Selector de Icono */}
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                    Icono Representativo
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["users", "trophy", "award", "globe"] as StatIcon[]).map((iconKey) => {
                      const IconComp = ICONS_MAP[iconKey]
                      const isSelected = block.icon === iconKey
                      return (
                        <button
                          key={iconKey}
                          type="button"
                          onClick={() => updateBlock(key, { icon: iconKey })}
                          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#5FA8D3]/20 border-[#5FA8D3] text-[#5FA8D3] font-bold"
                              : "bg-[#0B0F19] border-[#2B5B84]/50 text-[#94A3B8] hover:text-[#F0F4F8] hover:border-[#2B5B84]"
                          }`}
                        >
                          <IconComp className="h-4 w-4" />
                          <span className="text-[10px] capitalize">{iconKey}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ACCIONES DEL FORMULARIO */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#2B5B84]/40">
        <Button
          type="button"
          onClick={handleResetDefaults}
          variant="secondary"
          className="w-full sm:w-auto bg-[#0B0F19] border border-[#2B5B84] text-[#94A3B8] hover:text-[#F0F4F8] hover:bg-[#1a2d4a] text-xs font-bold"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
          Restablecer Valores Iniciales
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto min-w-[220px] bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-black text-sm py-3 shadow-lg shadow-[#5FA8D3]/20"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Guardando cambios...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" /> Guardar Estadísticas
            </span>
          )}
        </Button>
      </div>
    </form>
  )
}
