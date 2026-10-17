"use client"

import { useState, useEffect } from "react"
import { Eye, Activity } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getVisitorStatsAction, recordVisitAction } from "@/lib/actions/settingsActions"

export function VisitorCounter() {
  const [mounted, setMounted] = useState(false)
  const [onlineCount, setOnlineCount] = useState<number>(1)
  const [totalVisits, setTotalVisits] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)

    const supabase = createClient()
    const visitorId = "visitor_" + Math.random().toString(36).substring(2, 9)

    // Crear canal de Supabase Realtime para presencia y broadcasts
    const channel = supabase.channel("realtime-visitors", {
      config: {
        presence: { key: visitorId },
      },
    })

    // Sincronizar conteo de usuarios conectados en vivo
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState()
      const count = Object.keys(state).length
      setOnlineCount(Math.max(1, count))
    })

    // Escuchar actualizaciones de visitas en tiempo real de otros usuarios
    channel.on("broadcast", { event: "visit_update" }, ({ payload }) => {
      if (payload?.count && typeof payload.count === "number") {
        setTotalVisits(payload.count)
      }
    })

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ online_at: new Date().toISOString() })
      }
    })

    // Manejar visitas por sesión (para evitar inflar el contador por cada recarga del mismo usuario)
    const handleVisits = async () => {
      const hasVisited = sessionStorage.getItem("walfa_visited")

      if (!hasVisited) {
        // Primera visita de esta sesión del navegador: registrar e incrementar
        const res = await recordVisitAction()
        if (res.success && res.data) {
          sessionStorage.setItem("walfa_visited", "true")
          setTotalVisits(res.data.totalVisits)

          // Difundir en tiempo real a los demás usuarios en línea
          channel.send({
            type: "broadcast",
            event: "visit_update",
            payload: { count: res.data.totalVisits },
          })
        }
      } else {
        // Ya contado en esta sesión: solo consultar el total actual
        const res = await getVisitorStatsAction()
        if (res.success && res.data) {
          setTotalVisits(res.data.totalVisits)
        }
      }
    }

    handleVisits()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (!mounted) {
    // Marcador de posición idéntico para evitar discordancias de hidratación en SSR
    return (
      <div
        className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-xs text-slate-400 select-none"
        aria-hidden="true"
      >
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500/50" />
          <span>Conectando...</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 shadow-inner text-xs transition-all duration-300 hover:border-slate-600"
      title="Estadísticas de visitas del sitio en tiempo real"
    >
      {/* Usuarios en línea en tiempo real con indicador pulsante */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-slate-300 font-medium flex items-center gap-1">
          <strong className="text-white font-bold">{onlineCount}</strong>
          <span>{onlineCount === 1 ? "en línea" : "en línea"}</span>
        </span>
      </div>

      {/* Divisor vertical */}
      <span className="h-3 w-[1px] bg-slate-700/80" aria-hidden="true" />

      {/* Visitas totales */}
      <div className="flex items-center gap-1.5 text-slate-400">
        <Eye className="h-3.5 w-3.5 text-[#1D64F2] shrink-0" />
        <span className="flex items-center gap-1">
          <strong className="text-slate-200 font-semibold">
            {totalVisits !== null ? totalVisits.toLocaleString("es-DO") : "..."}
          </strong>
          <span>visitas</span>
        </span>
      </div>
    </div>
  )
}
