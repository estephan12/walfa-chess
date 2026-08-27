"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Trophy,
  Award,
  Medal,
  User,
  DollarSign,
  Zap,
  Filter,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
} from "lucide-react"
import type { Tournament, TournamentCategory, TournamentResult, Player } from "@/types"

interface TournamentResultsViewProps {
  tournament: Tournament
  categories: TournamentCategory[]
  results: (TournamentResult & { player?: Player | null })[]
}

export function TournamentResultsView({
  tournament,
  categories,
  results,
}: TournamentResultsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredResults = selectedCategory === "all"
    ? results
    : results.filter((r) => r.category_id === selectedCategory)

  const top3 = filteredResults.slice(0, 3)
  const first = top3.find((r) => r.position === 1) || top3[0]
  const second = top3.find((r) => r.position === 2) || top3[1]
  const third = top3.find((r) => r.position === 3) || top3[2]

  return (
    <div className="space-y-12">
      {/* SELECTOR DE CATEGORÍAS */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#2B5B84]/40 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] mr-2 font-bold uppercase tracking-wider shrink-0">
            <Filter className="h-3.5 w-3.5 text-[#5FA8D3]" />
            Categoría:
          </div>
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#5FA8D3] text-[#0B0F19] shadow-md shadow-[#5FA8D3]/20"
                : "bg-[#132238] border border-[#2B5B84] text-[#94A3B8] hover:text-[#F0F4F8]"
            }`}
          >
            Clasificación General ({results.length})
          </button>
          {categories.map((c) => {
            const count = results.filter((r) => r.category_id === c.id).length
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === c.id
                    ? "bg-[#5FA8D3] text-[#0B0F19] shadow-md shadow-[#5FA8D3]/20"
                    : "bg-[#132238] border border-[#2B5B84] text-[#94A3B8] hover:text-[#F0F4F8]"
                }`}
              >
                {c.name} ({count})
              </button>
            )
          })}
        </div>
      )}

      {/* PODIO DE GANADORES */}
      {top3.length > 0 && (
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-[#5FA8D3]">
              Cuadro de Honor
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F0F4F8]">
              Podio Oficial del Torneo
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-6">
            {/* Segundo Lugar (Plata) */}
            {second ? (
              <div className="order-2 md:order-1 bg-[#132238] border border-slate-400/30 rounded-2xl p-6 text-center shadow-xl relative overflow-hidden group hover:border-slate-300 transition-all">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-slate-300" />
                <div className="flex items-center justify-center -mt-2 mb-3">
                  <div className="h-10 w-10 rounded-full bg-slate-300/20 border border-slate-300 flex items-center justify-center">
                    <Medal className="h-5 w-5 text-slate-300" />
                  </div>
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-300">
                  2º Lugar • Subcampeón
                </span>

                <div className="relative h-16 w-16 mx-auto rounded-full overflow-hidden border-2 border-slate-300 bg-[#0B0F19] my-3">
                  {second.player?.photo_url ? (
                    <Image
                      src={second.player.photo_url}
                      alt={second.player_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-8 w-8 text-[#94A3B8]/50" />
                    </div>
                  )}
                </div>

                <h3 className="font-black text-lg text-[#F0F4F8] line-clamp-1">
                  {second.player_name}
                </h3>
                {second.player?.club && (
                  <p className="text-xs text-[#94A3B8]">{second.player.club}</p>
                )}

                <div className="mt-4 pt-3 border-t border-[#2B5B84]/40 flex items-center justify-around text-xs">
                  {second.points !== null && (
                    <div>
                      <span className="text-[#94A3B8] block text-[10px]">Puntos</span>
                      <span className="font-mono font-bold text-[#F0F4F8]">{second.points} pts</span>
                    </div>
                  )}
                  {second.rating_performance && (
                    <div>
                      <span className="text-[#94A3B8] block text-[10px]">Performance</span>
                      <span className="font-mono font-bold text-emerald-400">{second.rating_performance}</span>
                    </div>
                  )}
                </div>

                {second.prize_won && (
                  <p className="mt-3 text-xs font-bold text-amber-300 bg-[#0B0F19] py-1.5 px-3 rounded-lg border border-[#2B5B84]/50">
                    {second.prize_won}
                  </p>
                )}
              </div>
            ) : <div className="order-2 md:order-1 hidden md:block" />}

            {/* Primer Lugar (Oro - Campeón) */}
            {first && (
              <div className="order-1 md:order-2 bg-[#132238] border-2 border-amber-400 rounded-3xl p-8 text-center shadow-2xl shadow-amber-500/10 relative overflow-hidden group md:-translate-y-4">
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />
                <div className="flex items-center justify-center -mt-2 mb-3">
                  <div className="h-12 w-12 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/30 animate-pulse">
                    <Trophy className="h-6 w-6 text-amber-400" />
                  </div>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                  👑 1º Lugar • Campeón
                </span>

                <div className="relative h-20 w-20 mx-auto rounded-full overflow-hidden border-2 border-amber-400 bg-[#0B0F19] my-3 shadow-lg">
                  {first.player?.photo_url ? (
                    <Image
                      src={first.player.photo_url}
                      alt={first.player_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-10 w-10 text-amber-400/60" />
                    </div>
                  )}
                </div>

                <h3 className="font-black text-xl text-[#F0F4F8] line-clamp-1">
                  {first.player_name}
                </h3>
                {first.player?.club && (
                  <p className="text-xs text-[#94A3B8]">{first.player.club}</p>
                )}

                <div className="mt-4 pt-3 border-t border-[#2B5B84]/40 flex items-center justify-around text-xs">
                  {first.points !== null && (
                    <div>
                      <span className="text-[#94A3B8] block text-[10px]">Puntos</span>
                      <span className="font-mono font-bold text-amber-300 text-sm">{first.points} pts</span>
                    </div>
                  )}
                  {first.rating_performance && (
                    <div>
                      <span className="text-[#94A3B8] block text-[10px]">Performance</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">{first.rating_performance}</span>
                    </div>
                  )}
                </div>

                {first.prize_won && (
                  <p className="mt-3 text-xs font-bold text-amber-300 bg-[#0B0F19] py-2 px-3 rounded-xl border border-amber-400/40 shadow">
                    🏆 {first.prize_won}
                  </p>
                )}
              </div>
            )}

            {/* Tercer Lugar (Bronce) */}
            {third ? (
              <div className="order-3 bg-[#132238] border border-amber-700/40 rounded-2xl p-6 text-center shadow-xl relative overflow-hidden group hover:border-amber-600 transition-all">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-amber-600" />
                <div className="flex items-center justify-center -mt-2 mb-3">
                  <div className="h-10 w-10 rounded-full bg-amber-700/20 border border-amber-600 flex items-center justify-center">
                    <Medal className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-500">
                  3º Lugar • Tercer Puesto
                </span>

                <div className="relative h-16 w-16 mx-auto rounded-full overflow-hidden border-2 border-amber-600 bg-[#0B0F19] my-3">
                  {third.player?.photo_url ? (
                    <Image
                      src={third.player.photo_url}
                      alt={third.player_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-8 w-8 text-[#94A3B8]/50" />
                    </div>
                  )}
                </div>

                <h3 className="font-black text-lg text-[#F0F4F8] line-clamp-1">
                  {third.player_name}
                </h3>
                {third.player?.club && (
                  <p className="text-xs text-[#94A3B8]">{third.player.club}</p>
                )}

                <div className="mt-4 pt-3 border-t border-[#2B5B84]/40 flex items-center justify-around text-xs">
                  {third.points !== null && (
                    <div>
                      <span className="text-[#94A3B8] block text-[10px]">Puntos</span>
                      <span className="font-mono font-bold text-[#F0F4F8]">{third.points} pts</span>
                    </div>
                  )}
                  {third.rating_performance && (
                    <div>
                      <span className="text-[#94A3B8] block text-[10px]">Performance</span>
                      <span className="font-mono font-bold text-emerald-400">{third.rating_performance}</span>
                    </div>
                  )}
                </div>

                {third.prize_won && (
                  <p className="mt-3 text-xs font-bold text-amber-300 bg-[#0B0F19] py-1.5 px-3 rounded-lg border border-[#2B5B84]/50">
                    {third.prize_won}
                  </p>
                )}
              </div>
            ) : <div className="order-3 hidden md:block" />}
          </div>
        </section>
      )}

      {/* TABLA COMPLETA DE POSICIONES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#F0F4F8]">
            Tabla de Posiciones Completa
          </h3>
          <span className="text-xs text-[#94A3B8]">
            {filteredResults.length} {filteredResults.length === 1 ? "participante registrado" : "participantes registrados"}
          </span>
        </div>

        {filteredResults.length === 0 ? (
          <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-12 text-center shadow-xl">
            <Trophy className="h-10 w-10 text-[#94A3B8]/40 mx-auto mb-2" />
            <p className="text-sm text-[#94A3B8]">
              No hay resultados cargados en esta categoría todavía.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#94A3B8]">
                <thead className="bg-[#0B0F19]/60 text-xs uppercase font-bold text-[#F0F4F8] border-b border-[#2B5B84]">
                  <tr>
                    <th scope="col" className="px-6 py-4 w-16 text-center">Pos.</th>
                    <th scope="col" className="px-6 py-4">Jugador</th>
                    <th scope="col" className="px-6 py-4">Categoría</th>
                    <th scope="col" className="px-6 py-4 text-center">Puntos</th>
                    <th scope="col" className="px-6 py-4 text-center hidden md:table-cell">Perf. Elo</th>
                    <th scope="col" className="px-6 py-4 hidden lg:table-cell">Premio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2B5B84]/40">
                  {filteredResults.map((item) => {
                    const cat = categories.find((c) => c.id === item.category_id)
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-[#0B0F19]/30 transition-colors ${
                          item.position === 1
                            ? "bg-amber-500/[0.04]"
                            : item.position === 2
                            ? "bg-slate-300/[0.03]"
                            : item.position === 3
                            ? "bg-amber-700/[0.03]"
                            : ""
                        }`}
                      >
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center h-7 w-7 rounded-full font-mono font-black text-xs ${
                              item.position === 1
                                ? "bg-amber-400 text-black shadow"
                                : item.position === 2
                                ? "bg-slate-200 text-black shadow"
                                : item.position === 3
                                ? "bg-amber-600 text-white shadow"
                                : "bg-[#0B0F19] text-[#94A3B8] border border-[#2B5B84]"
                            }`}
                          >
                            #{item.position}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-[#0B0F19] border border-[#2B5B84] overflow-hidden flex items-center justify-center shrink-0">
                              {item.player?.photo_url ? (
                                <img
                                  src={item.player.photo_url}
                                  alt={item.player_name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <User className="h-4 w-4 text-[#94A3B8]" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-[#F0F4F8]">
                                {item.player_name}
                              </p>
                              {item.player?.club && (
                                <p className="text-xs text-[#94A3B8]">{item.player.club}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs">
                          {cat ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#5FA8D3]/10 border border-[#5FA8D3]/30 text-[#5FA8D3] font-semibold">
                              {cat.name}
                            </span>
                          ) : (
                            <span className="text-[#94A3B8]/60">General</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center font-mono font-bold text-amber-400">
                          {item.points !== null && item.points !== undefined ? `${item.points} pts` : "—"}
                        </td>
                        <td className="px-6 py-4 text-center hidden md:table-cell font-mono text-emerald-400 text-xs">
                          {item.rating_performance ? item.rating_performance : "—"}
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell text-xs text-[#F0F4F8]">
                          {item.prize_won ? (
                            <span className="text-amber-300 font-semibold">
                              {item.prize_won}
                            </span>
                          ) : (
                            <span className="text-[#94A3B8]/50">—</span>
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
    </div>
  )
}
