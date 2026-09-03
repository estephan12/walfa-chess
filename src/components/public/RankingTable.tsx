"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import {
  Search,
  Award,
  Shield,
  User,
  ExternalLink,
  Building2,
  Filter,
  X,
  Medal,
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
  }, [initialPlayers, search, selectedCategory, ratingType])

  const clearFilters = () => {
    setSearch("")
    setSelectedCategory("all")
  }

  // Medallas para el Top 3
  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 border border-amber-300 text-amber-600 font-black text-sm shadow-sm">
          <Medal className="h-4 w-4" />
        </div>
      )
    }
    if (index === 1) {
      return (
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 border border-slate-300 text-slate-600 font-black text-sm shadow-sm">
          <Medal className="h-4 w-4" />
        </div>
      )
    }
    if (index === 2) {
      return (
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 border border-orange-300 text-orange-600 font-black text-sm shadow-sm">
          <Medal className="h-4 w-4" />
        </div>
      )
    }
    return (
      <span className="font-mono text-sm font-bold text-slate-400 w-8 text-center">
        #{index + 1}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* BARRA DE CONTROLES: BÚSQUEDA, TABS DE ELO Y FILTROS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* Buscador */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por jugador, FIDE ID, club o título..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1D64F2] focus:ring-1 focus:ring-[#1D64F2] transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Selector de tipo de Rating (FIDE vs Local) */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setRatingType("fide")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                ratingType === "fide"
                  ? "bg-[#1D64F2] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
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
                  ? "bg-[#1D64F2] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              Elo Nacional / Local
            </button>
          </div>
        </div>

        {/* Categorías / Filtros rápidos */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-2 shrink-0 font-medium">
            <Filter className="h-3.5 w-3.5 text-[#1D64F2]" />
            Categoría:
          </div>
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-blue-50 border border-[#1D64F2] text-[#1D64F2] font-bold"
                  : "bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTADOS / TABLA */}
      {filteredPlayers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <User className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900">No se encontraron jugadores</h3>
          <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
            No hay jugadores que coincidan con los filtros o término de búsqueda seleccionado.
          </p>
          {(search || selectedCategory !== "all") && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-[#1D64F2] hover:bg-blue-100 transition-colors cursor-pointer"
            >
              Restablecer Filtros
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Mostrando {filteredPlayers.length} {filteredPlayers.length === 1 ? "jugador" : "jugadores"}
            </span>
            <span className="text-xs text-[#1D64F2] font-semibold">
              Ordenado por: {ratingType === "fide" ? "Elo FIDE" : "Elo Nacional"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-900 border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-5 py-4 w-16 text-center">Pos.</th>
                  <th scope="col" className="px-6 py-4">Jugador</th>
                  <th scope="col" className="px-6 py-4 text-center">
                    <span className="flex items-center justify-center gap-1">
                      <Award className="h-3.5 w-3.5 text-amber-500" />
                      Elo FIDE
                    </span>
                  </th>
                  <th scope="col" className="px-6 py-4 text-center hidden md:table-cell">
                    <span className="flex items-center justify-center gap-1">
                      <Shield className="h-3.5 w-3.5 text-emerald-600" />
                      Elo Nacional
                    </span>
                  </th>
                  <th scope="col" className="px-6 py-4 hidden lg:table-cell">Club / Asociación</th>
                  <th scope="col" className="px-6 py-4 text-right hidden sm:table-cell">FIDE ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPlayers.map((player, idx) => {
                  return (
                    <tr
                      key={player.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        idx === 0
                          ? "bg-amber-50/40"
                          : idx === 1
                          ? "bg-slate-50/60"
                          : idx === 2
                          ? "bg-orange-50/30"
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
                          <div className="relative h-11 w-11 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shrink-0 flex items-center justify-center">
                            {player.photo_url ? (
                              <Image
                                src={player.photo_url}
                                alt={player.full_name}
                                fill
                                sizes="44px"
                                className="object-cover"
                              />
                            ) : (
                              <User className="h-5 w-5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {player.title && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-900 shadow-sm">
                                  {player.title}
                                </span>
                              )}
                              <span className="font-bold text-base text-slate-900">
                                {player.full_name}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-500 font-mono uppercase">
                                {player.nationality || "DO"}
                              </span>
                            </div>
                            {player.bio && (
                              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 max-w-sm">
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
                                ? "bg-amber-100 text-amber-700 border border-amber-300"
                                : player.fide_rating >= 2000
                                ? "bg-blue-50 text-[#1D64F2] border border-blue-200"
                                : "bg-slate-100 text-slate-800 border border-slate-200"
                            }`}
                          >
                            {player.fide_rating}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Sin Elo</span>
                        )}
                      </td>

                      {/* Elo Nacional */}
                      <td className="px-6 py-4 text-center hidden md:table-cell">
                        {player.local_rating ? (
                          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg font-mono font-bold text-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {player.local_rating}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">—</span>
                        )}
                      </td>

                      {/* Club */}
                      <td className="px-6 py-4 hidden lg:table-cell">
                        {player.club ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 max-w-[200px] truncate" title={player.club}>
                            <Building2 className="h-3.5 w-3.5 text-[#1D64F2] shrink-0" />
                            <span className="truncate">{player.club}</span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">—</span>
                        )}
                      </td>

                      {/* FIDE ID Link */}
                      <td className="px-6 py-4 text-right hidden sm:table-cell">
                        {player.fide_id ? (
                          <a
                            href={`https://ratings.fide.com/profile/${player.fide_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-xs text-[#1D64F2] hover:underline"
                            title="Ver perfil oficial en ratings.fide.com"
                          >
                            <span>{player.fide_id}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
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
