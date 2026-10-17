"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Award,
  AlertCircle,
  UserCheck,
  UserPlus,
} from "lucide-react"
import type { PublicRegisteredPlayer } from "@/lib/queries/inscriptionQueries"

interface RegisteredPlayersListProps {
  players: PublicRegisteredPlayer[]
  maxParticipants?: number | null
  tournamentSlug: string
  isRegistrationOpen: boolean
}

export function RegisteredPlayersList({
  players,
  maxParticipants,
  tournamentSlug,
  isRegistrationOpen,
}: RegisteredPlayersListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const totalRegistered = players.length
  const hasLimit = typeof maxParticipants === "number" && maxParticipants > 0
  const availableSpots = hasLimit ? Math.max(0, maxParticipants - totalRegistered) : null
  const isFull = hasLimit && availableSpots === 0
  const percentageFilled = hasLimit ? Math.min(100, Math.round((totalRegistered / maxParticipants) * 100)) : null

  // Filtro de búsqueda por nombre o provincia
  const filteredPlayers = useMemo(() => {
    if (!searchTerm.trim()) return players
    const term = searchTerm.toLowerCase().trim()
    return players.filter((player) => {
      const matchName = player.full_name.toLowerCase().includes(term)
      const matchProvince = player.province ? player.province.toLowerCase().includes(term) : false
      const matchFide = player.fide_id ? player.fide_id.toLowerCase().includes(term) : false
      const matchCat = player.category_name ? player.category_name.toLowerCase().includes(term) : false
      return matchName || matchProvince || matchFide || matchCat
    })
  }, [players, searchTerm])

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
      {/* Encabezado de la sección */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D64F2] uppercase tracking-wider mb-1">
            <Users className="h-4 w-4" /> Nómina Oficial
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Jugadores Inscritos
            <span className="text-sm font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1D64F2] border border-blue-200">
              {totalRegistered} {totalRegistered === 1 ? "jugador" : "jugadores"}
            </span>
          </h2>
        </div>

        {/* CTA rápido si hay cupos */}
        {isRegistrationOpen && !isFull && (
          <Link href={`/inscripciones?torneo=${tournamentSlug}`}>
            <button className="inline-flex items-center gap-1.5 bg-[#1D64F2] hover:bg-[#1554cf] active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-sm transition">
              <UserPlus className="h-3.5 w-3.5" /> Inscribirme Ahora
            </button>
          </Link>
        )}
      </div>

      {/* Tarjetas de Métricas de Capacidad & Cupos Disponibles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Total Inscritos */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-100 text-[#1D64F2] flex items-center justify-center shrink-0">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Inscritos Actuales
            </p>
            <p className="text-xl font-black text-slate-900 leading-tight">
              {totalRegistered}
            </p>
          </div>
        </div>

        {/* Límite de Jugadores */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Límite de Jugadores
            </p>
            <p className="text-xl font-black text-slate-900 leading-tight">
              {hasLimit ? `${maxParticipants} cupos` : "Sin límite"}
            </p>
          </div>
        </div>

        {/* Cupos Disponibles */}
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            isFull
              ? "bg-rose-50 border-rose-200"
              : hasLimit && availableSpots! <= 5
              ? "bg-amber-50 border-amber-200"
              : "bg-emerald-50 border-emerald-200"
          }`}
        >
          <div
            className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
              isFull
                ? "bg-rose-200 text-rose-700"
                : hasLimit && availableSpots! <= 5
                ? "bg-amber-200 text-amber-800"
                : "bg-emerald-200 text-emerald-800"
            }`}
          >
            {isFull ? <AlertCircle className="h-5 w-5" /> : <Award className="h-5 w-5" />}
          </div>
          <div>
            <p
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isFull
                  ? "text-rose-700"
                  : hasLimit && availableSpots! <= 5
                  ? "text-amber-800"
                  : "text-emerald-700"
              }`}
            >
              Cupos Disponibles
            </p>
            <p
              className={`text-xl font-black leading-tight ${
                isFull
                  ? "text-rose-900"
                  : hasLimit && availableSpots! <= 5
                  ? "text-amber-900"
                  : "text-emerald-900"
              }`}
            >
              {hasLimit ? (
                isFull ? (
                  <span className="text-base font-extrabold uppercase text-rose-600">Agotados</span>
                ) : (
                  `${availableSpots} disponibles`
                )
              ) : (
                "Abierto (Ilimitado)"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Progreso de Capacidad si hay límite */}
      {hasLimit && percentageFilled !== null && (
        <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600">
              Ocupación del Torneo ({totalRegistered} de {maxParticipants})
            </span>
            <span
              className={`font-bold ${
                isFull
                  ? "text-rose-600"
                  : percentageFilled >= 80
                  ? "text-amber-600"
                  : "text-[#1D64F2]"
              }`}
            >
              {percentageFilled}% ocupado
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isFull
                  ? "bg-rose-500"
                  : percentageFilled >= 80
                  ? "bg-amber-500"
                  : "bg-[#1D64F2]"
              }`}
              style={{ width: `${percentageFilled}%` }}
            />
          </div>
        </div>
      )}

      {/* Barra de Búsqueda si hay jugadores */}
      {players.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar jugador por nombre, provincia o ID FIDE..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1D64F2]/20 focus:border-[#1D64F2]"
          />
        </div>
      )}

      {/* Tabla / Listado de Jugadores */}
      {players.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50">
          <div className="h-12 w-12 rounded-full bg-blue-50 text-[#1D64F2] flex items-center justify-center mx-auto mb-3">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Aún no hay jugadores inscritos en este torneo
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Sé el primero en asegurar tu lugar en la mesa de juego para esta competencia oficial.
          </p>
          {isRegistrationOpen && (
            <Link href={`/inscripciones?torneo=${tournamentSlug}`} className="inline-block mt-4">
              <button className="inline-flex items-center gap-2 bg-[#1D64F2] hover:bg-[#1554cf] text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow transition">
                <UserPlus className="h-4 w-4" /> Inscribirme Ahora
              </button>
            </Link>
          )}
        </div>
      ) : filteredPlayers.length === 0 ? (
        <div className="text-center py-8 px-4 text-xs text-slate-500">
          No se encontraron jugadores que coincidan con &ldquo;{searchTerm}&rdquo;.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          {/* Vista Desktop / Tablet */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0A1931] text-white text-[11px] uppercase tracking-wider font-bold">
                <tr>
                  <th scope="col" className="px-4 py-3 text-center w-12">
                    #
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Jugador
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Provincia
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Categoría
                  </th>
                  <th scope="col" className="px-4 py-3 text-center">
                    FIDE ID
                  </th>
                  <th scope="col" className="px-4 py-3 text-center">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredPlayers.map((player, index) => {
                  const initial = player.full_name.charAt(0).toUpperCase()
                  const isConfirmed = player.status === "confirmed"

                  return (
                    <tr
                      key={player.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Número de orden */}
                      <td className="px-4 py-3 text-center font-bold text-xs text-slate-500">
                        {index + 1}
                      </td>

                      {/* Jugador con avatar inicial */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-[#0A1931] text-white font-bold text-xs flex items-center justify-center shrink-0 border border-slate-300">
                            {initial}
                          </div>
                          <span className="font-bold text-slate-900">
                            {player.full_name}
                          </span>
                        </div>
                      </td>

                      {/* Provincia */}
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {player.province ? (
                          <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                            <MapPin className="h-3 w-3 text-[#1D64F2]" />
                            {player.province}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Categoría */}
                      <td className="px-4 py-3 text-xs">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700 border border-slate-200">
                          {player.category_name || "General / Abierta"}
                        </span>
                      </td>

                      {/* FIDE ID */}
                      <td className="px-4 py-3 text-center text-xs font-mono text-slate-600">
                        {player.fide_id ? (
                          <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-800">
                            {player.fide_id}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-3 text-center">
                        {isConfirmed ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" /> Confirmado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[11px] font-bold text-[#1D64F2]">
                            <Clock className="h-3 w-3" /> Inscrito
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}
