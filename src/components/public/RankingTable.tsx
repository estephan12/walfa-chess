"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import {
  Search,
  Trophy,
  Award,
  Shield,
  User,
  ExternalLink,
  Building2,
  Filter,
  X,
  Medal,
  ChevronDown,
} from "lucide-react"
import type { Player } from "@/types"

interface RankingTableProps {
  initialPlayers: Player[]
}

const CATEGORY_FILTERS = [
  { id: "all", label: "Todos los Jugadores" },
  { id: "titled", label: "🎖 Titulados Oficiales" },
  { id: "master", label: "🏆 Master (+2200)" },
  { id: "class_a", label: "⭐ Clase A (2000 - 2199)" },
  { id: "class_b", label: "🔷 Clase B (1800 - 1999)" },
  { id: "class_c", label: "🔹 Clase C (1600 - 1799)" },
  { id: "amateur", label: "♟ Aficionados (<1600)" },
]

export function RankingTable({ initialPlayers }: RankingTableProps) {
  const [search, setSearch] = useState("")
  const [ratingType, setRatingType] = useState<"fide" | "local">("fide")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Filtrado y ordenación de jugadores en memoria para respuesta instantánea
  const filteredPlayers = useMemo(() => {
    let list = [...initialPlayers]

    // 1. Filtro por búsqueda
    if (search.trim() !== "") {
      const q = search.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.full_name.toLowerCase().includes(q) ||
          (p.fide_id && p.fide_id.toLowerCase().includes(q)) ||
          (p.club && p.club.toLowerCase().includes(q)) ||
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.nationality && p.nationality.toLowerCase().includes(q))
      )
    }

    // 2. Filtro por categoría
    if (selectedCategory !== "all") {
      list = list.filter((p) => {
        const rating = (ratingType === "local" ? p.local_rating : p.fide_rating) ?? 0

        switch (selectedCategory) {
          case "titled":
            return Boolean(p.title)
          case "master":
            return rating >= 2200
          case "class_a":
            return rating >= 2000 && rating < 2200
          case "class_b":
            return rating >= 1800 && rating < 2000
          case "class_c":
            return rating >= 1600 && rating < 1800
          case "amateur":
            return rating > 0 && rating < 1600
          default:
            return true
        }
      })
    }

    // 3. Ordenar por el Elo seleccionado
    list.sort((a, b) => {
      const ratingA = (ratingType === "local" ? a.local_rating : a.fide_rating) ?? 0
      const ratingB = (ratingType === "local" ? b.local_rating : b.fide_rating) ?? 0
      return ratingB - ratingA
    })

    return list
  }, [initialPlayers, search, ratingType, selectedCategory])

  const clearFilters = () => {
    setSearch("")
    setSelectedCategory("all")
  }

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-400/20 border border-amber-400 text-amber-300 font-black text-sm shadow-md shadow-amber-500/20">
          <Medal className="h-4 w-4 text-amber-400" />
        </div>
      )
    }
    if (index === 1) {
      return (
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-300/20 border border-slate-300 text-slate-200 font-black text-sm shadow-md">
          <Medal className="h-4 w-4 text-slate-300" />
        </div>
      )
    }
    if (index === 2) {
      return (
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-700/20 border border-amber-600 text-amber-500 font-black text-sm shadow-md">
          <Medal className="h-4 w-4 text-amber-600" />
        </div>
      )
    }
    return (
      <span className="font-mono text-sm font-bold text-[#94A3B8] w-8 text-center">
        #{index + 1}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* BARRA DE CONTROLES: BÚSQUEDA, TABS DE ELO Y FILTROS */}
      <div className="bg-[#132238] border border-[#2B5B84] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* Buscador */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por jugador, FIDE ID, club o título..."
              className="w-full bg-[#0B0F19] border border-[#2B5B84] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#5FA8D3] focus:ring-1 focus:ring-[#5FA8D3] transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F0F4F8] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Selector de tipo de Rating (FIDE vs Local) */}
          <div className="flex items-center gap-2 bg-[#0B0F19] p-1 rounded-xl border border-[#2B5B84] shrink-0">
            <button
              type="button"
              onClick={() => setRatingType("fide")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                ratingType === "fide"
                  ? "bg-[#5FA8D3] text-[#0B0F19] shadow-sm"
                  : "text-[#94A3B8] hover:text-[#F0F4F8]"
              }`}
            >
              <Award className="h-3.5 w-3.5" />
              Elo FIDE Oficial
            </button>
            <button
              type="button"
              onClick={() => setRatingType("local")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                ratingType === "local"
                  ? "bg-[#5FA8D3] text-[#0B0F19] shadow-sm"
                  : "text-[#94A3B8] hover:text-[#F0F4F8]"
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              Elo Nacional / Local
            </button>
          </div>
        </div>

        {/* Categorías / Filtros rápidos */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] mr-2 shrink-0 font-medium">
            <Filter className="h-3.5 w-3.5 text-[#5FA8D3]" />
            Categoría:
          </div>
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#5FA8D3]/20 border border-[#5FA8D3] text-[#5FA8D3] font-bold"
                  : "bg-[#0B0F19]/60 border border-[#2B5B84]/50 text-[#94A3B8] hover:text-[#F0F4F8] hover:bg-[#0B0F19]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTADOS / TABLA */}
      {filteredPlayers.length === 0 ? (
        <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-12 text-center shadow-xl">
          <User className="h-12 w-12 text-[#94A3B8]/40 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#F0F4F8]">No se encontraron jugadores</h3>
          <p className="text-sm text-[#94A3B8] mt-1 max-w-md mx-auto">
            No hay jugadores que coincidan con los filtros o término de búsqueda seleccionado.
          </p>
          {(search || selectedCategory !== "all") && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-[#5FA8D3]/20 border border-[#5FA8D3]/40 text-xs font-bold text-[#5FA8D3] hover:bg-[#5FA8D3]/30 transition-colors cursor-pointer"
            >
              Restablecer Filtros
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-[#2B5B84] bg-[#0B0F19]/40 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
              Mostrando {filteredPlayers.length} {filteredPlayers.length === 1 ? "jugador" : "jugadores"}
            </span>
            <span className="text-xs text-[#5FA8D3] font-semibold">
              Ordenado por: {ratingType === "fide" ? "Elo FIDE" : "Elo Nacional"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#94A3B8]">
              <thead className="bg-[#0B0F19]/70 text-xs uppercase font-bold text-[#F0F4F8] border-b border-[#2B5B84]">
                <tr>
                  <th scope="col" className="px-5 py-4 w-16 text-center">Pos.</th>
                  <th scope="col" className="px-6 py-4">Jugador</th>
                  <th scope="col" className="px-6 py-4 text-center">
                    <span className="flex items-center justify-center gap-1">
                      <Award className="h-3.5 w-3.5 text-amber-400" />
                      Elo FIDE
                    </span>
                  </th>
                  <th scope="col" className="px-6 py-4 text-center hidden md:table-cell">
                    <span className="flex items-center justify-center gap-1">
                      <Shield className="h-3.5 w-3.5 text-emerald-400" />
                      Elo Nacional
                    </span>
                  </th>
                  <th scope="col" className="px-6 py-4 hidden lg:table-cell">Club / Asociación</th>
                  <th scope="col" className="px-6 py-4 text-right hidden sm:table-cell">FIDE ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B5B84]/40">
                {filteredPlayers.map((player, idx) => {
                  const isTop3 = idx < 3
                  return (
                    <tr
                      key={player.id}
                      className={`hover:bg-[#0B0F19]/40 transition-colors ${
                        idx === 0
                          ? "bg-amber-500/[0.04]"
                          : idx === 1
                          ? "bg-slate-300/[0.03]"
                          : idx === 2
                          ? "bg-amber-700/[0.03]"
                          : ""
                      }`}
                    >
                      {/* Posición / Rango */}
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center">
                          {getRankBadge(idx)}
                        </div>
                      </td>

                      {/* Jugador con Avatar & Título */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 rounded-full bg-[#0B0F19] overflow-hidden border border-[#2B5B84] shrink-0 flex items-center justify-center">
                            {player.photo_url ? (
                              <Image
                                src={player.photo_url}
                                alt={player.full_name}
                                fill
                                sizes="44px"
                                className="object-cover"
                              />
                            ) : (
                              <User className="h-5 w-5 text-[#94A3B8]/60" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {player.title && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-400 text-black shadow-sm">
                                  {player.title}
                                </span>
                              )}
                              <span className="font-bold text-base text-[#F0F4F8]">
                                {player.full_name}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 bg-[#0B0F19] border border-[#2B5B84] rounded text-[#94A3B8] font-mono uppercase">
                                {player.nationality || "DO"}
                              </span>
                            </div>
                            {player.bio && (
                              <p className="text-xs text-[#94A3B8] line-clamp-1 mt-0.5 max-w-sm">
                                {player.bio}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Elo FIDE */}
                      <td className="px-6 py-4 text-center">
                        {player.fide_rating ? (
                          <span
                            className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg font-mono font-black text-sm ${
                              player.fide_rating >= 2200
                                ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                                : player.fide_rating >= 2000
                                ? "bg-[#5FA8D3]/20 text-[#5FA8D3] border border-[#5FA8D3]/40"
                                : "bg-[#0B0F19] text-[#F0F4F8] border border-[#2B5B84]"
                            }`}
                          >
                            {player.fide_rating}
                          </span>
                        ) : (
                          <span className="text-xs text-[#94A3B8]/50 italic">Sin Elo</span>
                        )}
                      </td>

                      {/* Elo Nacional */}
                      <td className="px-6 py-4 text-center hidden md:table-cell">
                        {player.local_rating ? (
                          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg font-mono font-bold text-sm bg-[#0B0F19] text-emerald-400 border border-emerald-500/30">
                            {player.local_rating}
                          </span>
                        ) : (
                          <span className="text-xs text-[#94A3B8]/50 italic">—</span>
                        )}
                      </td>

                      {/* Club */}
                      <td className="px-6 py-4 hidden lg:table-cell">
                        {player.club ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-[#F0F4F8] max-w-[200px] truncate" title={player.club}>
                            <Building2 className="h-3.5 w-3.5 text-[#5FA8D3] shrink-0" />
                            <span className="truncate">{player.club}</span>
                          </span>
                        ) : (
                          <span className="text-xs text-[#94A3B8]/50 italic">—</span>
                        )}
                      </td>

                      {/* FIDE ID Link */}
                      <td className="px-6 py-4 text-right hidden sm:table-cell">
                        {player.fide_id ? (
                          <a
                            href={`https://ratings.fide.com/profile/${player.fide_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-xs text-[#5FA8D3] hover:text-[#4A96C2] hover:underline"
                            title="Ver perfil oficial en ratings.fide.com"
                          >
                            <span>{player.fide_id}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-[#94A3B8]/40">—</span>
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
    </div>
  )
}
