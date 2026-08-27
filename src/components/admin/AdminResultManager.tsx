"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Trophy,
  Award,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  User,
  Shield,
  Layers,
  CheckCircle,
  AlertCircle,
  Loader2,
  DollarSign,
  Zap,
} from "lucide-react"
import type { Tournament, TournamentCategory, TournamentResult, Player } from "@/types"
import {
  saveTournamentResultAction,
  deleteTournamentResultAction,
  createTournamentCategoryAction,
  deleteTournamentCategoryAction,
} from "@/lib/actions/resultActions"
import { Button } from "@/components/ui/button"

interface AdminResultManagerProps {
  tournament: Tournament
  categories: TournamentCategory[]
  results: (TournamentResult & { player?: Player | null })[]
  allPlayers: Player[]
}

export function AdminResultManager({
  tournament,
  categories,
  results,
  allPlayers,
}: AdminResultManagerProps) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isAddingResult, setIsAddingResult] = useState(false)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [editingResultId, setEditingResultId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Estado del formulario de resultado
  const [formData, setFormData] = useState({
    category_id: "",
    player_id: "",
    player_name: "",
    position: (results.length + 1).toString(),
    points: "",
    rating_performance: "",
    prize_won: "",
  })

  // Estado del formulario de categoría
  const [catFormData, setCatFormData] = useState({
    name: "",
    min_rating: "",
    max_rating: "",
    prize: "",
  })

  // Filtrar resultados por categoría seleccionada
  const filteredResults = selectedCategory === "all"
    ? results
    : results.filter((r) => r.category_id === selectedCategory)

  // Al seleccionar un jugador registrado del combo
  const handlePlayerSelect = (playerId: string) => {
    if (!playerId) {
      setFormData((prev) => ({ ...prev, player_id: "", player_name: "" }))
      return
    }
    const found = allPlayers.find((p) => p.id === playerId)
    if (found) {
      const nameWithTitle = found.title ? `${found.title} ${found.full_name}` : found.full_name
      setFormData((prev) => ({
        ...prev,
        player_id: found.id,
        player_name: nameWithTitle,
      }))
    }
  }

  const handleOpenAdd = () => {
    setEditingResultId(null)
    setFormData({
      category_id: selectedCategory !== "all" ? selectedCategory : "",
      player_id: "",
      player_name: "",
      position: (results.length + 1).toString(),
      points: "",
      rating_performance: "",
      prize_won: "",
    })
    setErrorMessage(null)
    setIsAddingResult(true)
  }

  const handleEditResult = (r: TournamentResult & { player?: Player | null }) => {
    setEditingResultId(r.id)
    setFormData({
      category_id: r.category_id ?? "",
      player_id: r.player_id ?? "",
      player_name: r.player_name,
      position: r.position.toString(),
      points: r.points !== null && r.points !== undefined ? r.points.toString() : "",
      rating_performance: r.rating_performance ? r.rating_performance.toString() : "",
      prize_won: r.prize_won ?? "",
    })
    setErrorMessage(null)
    setIsAddingResult(true)
  }

  const handleSaveResult = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.player_name.trim()) {
      setErrorMessage("Debes ingresar el nombre del jugador.")
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    const res = await saveTournamentResultAction(
      {
        tournament_id: tournament.id,
        category_id: formData.category_id || null,
        player_id: formData.player_id || null,
        player_name: formData.player_name.trim(),
        position: Number(formData.position) || 1,
        points: formData.points ? Number(formData.points) : null,
        rating_performance: formData.rating_performance ? Number(formData.rating_performance) : null,
        prize_won: formData.prize_won || null,
      },
      editingResultId ?? undefined
    )

    if (res.success) {
      setIsAddingResult(false)
      setEditingResultId(null)
      router.refresh()
    } else {
      setErrorMessage(res.error ?? "Error al guardar el resultado.")
    }

    setIsSubmitting(false)
  }

  const handleDeleteResult = async (resultId: string, playerName: string) => {
    if (!window.confirm(`¿Seguro que deseas eliminar la posición de "${playerName}"?`)) return

    const res = await deleteTournamentResultAction(resultId, tournament.id)
    if (res.success) {
      router.refresh()
    } else {
      alert(res.error ?? "Error al eliminar.")
    }
  }

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!catFormData.name.trim()) {
      alert("El nombre de la categoría es obligatorio.")
      return
    }

    setIsSubmitting(true)
    const res = await createTournamentCategoryAction({
      tournament_id: tournament.id,
      name: catFormData.name.trim(),
      min_rating: catFormData.min_rating ? Number(catFormData.min_rating) : null,
      max_rating: catFormData.max_rating ? Number(catFormData.max_rating) : null,
      prize: catFormData.prize || null,
    })

    if (res.success) {
      setCatFormData({ name: "", min_rating: "", max_rating: "", prize: "" })
      setIsAddingCategory(false)
      router.refresh()
    } else {
      alert(res.error ?? "Error al crear la categoría")
    }
    setIsSubmitting(false)
  }

  const handleDeleteCategory = async (catId: string, name: string) => {
    if (!window.confirm(`¿Eliminar la categoría "${name}"? Los resultados asociados perderán la categoría.`)) return

    const res = await deleteTournamentCategoryAction(catId, tournament.id)
    if (res.success) {
      if (selectedCategory === catId) setSelectedCategory("all")
      router.refresh()
    } else {
      alert(res.error ?? "Error al eliminar.")
    }
  }

  return (
    <div className="space-y-8">
      {/* BARRA SUPERIOR DE ACCIONES Y CATEGORÍAS */}
      <div className="bg-[#132238] border border-[#2B5B84] rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#5FA8D3]">
              Gestión de Posiciones & Premios
            </span>
            <h2 className="text-xl font-black text-[#F0F4F8] mt-1">
              Tabla de Clasificación Oficial
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/resultados/${tournament.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#2B5B84] text-xs font-bold text-[#94A3B8] hover:text-[#5FA8D3] hover:bg-[#0B0F19] transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Ver en Web Pública
            </Link>

            <Button
              type="button"
              onClick={handleOpenAdd}
              className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-black shadow-md shadow-[#5FA8D3]/20 cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Añadir Posición
            </Button>
          </div>
        </div>

        {/* Categorías & Botón crear categoría */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#2B5B84]/40">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-[#5FA8D3] text-[#0B0F19]"
                  : "bg-[#0B0F19] border border-[#2B5B84] text-[#94A3B8] hover:text-[#F0F4F8]"
              }`}
            >
              Todas ({results.length})
            </button>
            {categories.map((c) => {
              const count = results.filter((r) => r.category_id === c.id).length
              return (
                <div key={c.id} className="inline-flex items-center group">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3 py-1.5 rounded-l-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === c.id
                        ? "bg-[#5FA8D3] text-[#0B0F19]"
                        : "bg-[#0B0F19] border border-[#2B5B84] text-[#94A3B8] hover:text-[#F0F4F8]"
                    }`}
                  >
                    {c.name} ({count})
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(c.id, c.name)}
                    className="px-1.5 py-1.5 bg-[#0B0F19] border-y border-r border-[#2B5B84] rounded-r-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 text-xs transition-colors"
                    title="Eliminar categoría"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => setIsAddingCategory(!isAddingCategory)}
            className="text-xs text-[#5FA8D3] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            <Layers className="h-3.5 w-3.5" />
            {isAddingCategory ? "Cerrar Categorías" : "+ Nueva Categoría"}
          </button>
        </div>

        {/* Formulario para crear categoría */}
        {isAddingCategory && (
          <form onSubmit={handleSaveCategory} className="p-4 rounded-xl bg-[#0B0F19] border border-[#2B5B84] space-y-4">
            <h3 className="text-xs font-bold uppercase text-[#5FA8D3] tracking-wider">
              Nueva Categoría para este Torneo
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                value={catFormData.name}
                onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })}
                placeholder="Nombre (ej. Sub-2000, Femenino...)"
                required
                className="bg-[#132238] border border-[#2B5B84] rounded-xl px-3 py-2 text-xs text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#5FA8D3]"
              />
              <input
                type="number"
                value={catFormData.min_rating}
                onChange={(e) => setCatFormData({ ...catFormData, min_rating: e.target.value })}
                placeholder="Elo Mínimo (ej. 1800)"
                className="bg-[#132238] border border-[#2B5B84] rounded-xl px-3 py-2 text-xs text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#5FA8D3]"
              />
              <input
                type="number"
                value={catFormData.max_rating}
                onChange={(e) => setCatFormData({ ...catFormData, max_rating: e.target.value })}
                placeholder="Elo Máximo (ej. 1999)"
                className="bg-[#132238] border border-[#2B5B84] rounded-xl px-3 py-2 text-xs text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#5FA8D3]"
              />
              <input
                type="text"
                value={catFormData.prize}
                onChange={(e) => setCatFormData({ ...catFormData, prize: e.target.value })}
                placeholder="Premios (ej. RD$ 10,000)"
                className="bg-[#132238] border border-[#2B5B84] rounded-xl px-3 py-2 text-xs text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#5FA8D3]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingCategory(false)}
                className="px-3 py-1.5 text-xs text-[#94A3B8] hover:text-[#F0F4F8]"
              >
                Cancelar
              </button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] text-xs font-bold py-1.5"
              >
                Guardar Categoría
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* FORMULARIO FLOTANTE / INLINE PARA AGREGAR O EDITAR RESULTADO */}
      {isAddingResult && (
        <form onSubmit={handleSaveResult} className="bg-[#132238] border border-[#5FA8D3] rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in-50">
          <div className="flex items-center justify-between border-b border-[#2B5B84]/50 pb-3">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-[#5FA8D3]" />
              <h3 className="font-bold text-base text-[#F0F4F8]">
                {editingResultId ? "Editar Posición" : "Añadir Nueva Posición"}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingResult(false)}
              className="text-xs text-[#94A3B8] hover:text-[#F0F4F8] cursor-pointer"
            >
              ✕ Cerrar
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Posición */}
            <div>
              <label className="block text-xs font-semibold text-[#F0F4F8] mb-1">
                Posición / Lugar <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
                className="w-full bg-[#0B0F19] border border-[#2B5B84] rounded-xl px-3 py-2 text-sm text-[#F0F4F8] font-bold font-mono focus:outline-none focus:border-[#5FA8D3]"
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-xs font-semibold text-[#F0F4F8] mb-1">
                Categoría
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full bg-[#0B0F19] border border-[#2B5B84] rounded-xl px-3 py-2 text-sm text-[#F0F4F8] focus:outline-none focus:border-[#5FA8D3]"
              >
                <option value="">General / Única</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de Jugador Registrado */}
            <div>
              <label className="block text-xs font-semibold text-[#F0F4F8] mb-1">
                Vincular con Jugador del Sistema (Opcional)
              </label>
              <select
                value={formData.player_id}
                onChange={(e) => handlePlayerSelect(e.target.value)}
                className="w-full bg-[#0B0F19] border border-[#2B5B84] rounded-xl px-3 py-2 text-sm text-[#F0F4F8] focus:outline-none focus:border-[#5FA8D3]"
              >
                <option value="">-- Ingresar manual o seleccionar --</option>
                {allPlayers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title ? `${p.title} ` : ""}{p.full_name} {p.fide_rating ? `(Elo: ${p.fide_rating})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Nombre del Jugador */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#F0F4F8] mb-1">
                Nombre del Participante <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.player_name}
                onChange={(e) => setFormData({ ...formData, player_name: e.target.value })}
                placeholder="Ej. GM Ramón Mateo"
                required
                className="w-full bg-[#0B0F19] border border-[#2B5B84] rounded-xl px-3 py-2 text-sm text-[#F0F4F8] focus:outline-none focus:border-[#5FA8D3]"
              />
            </div>

            {/* Puntos Obtenidos */}
            <div>
              <label className="block text-xs font-semibold text-[#F0F4F8] mb-1">
                Puntos Obtenidos
              </label>
              <input
                type="number"
                step="0.5"
                min={0}
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                placeholder="Ej. 6.5"
                className="w-full bg-[#0B0F19] border border-[#2B5B84] rounded-xl px-3 py-2 text-sm text-[#F0F4F8] font-mono focus:outline-none focus:border-[#5FA8D3]"
              />
            </div>

            {/* Rating Performance */}
            <div>
              <label className="block text-xs font-semibold text-[#F0F4F8] mb-1">
                Performance Elo
              </label>
              <input
                type="number"
                min={0}
                value={formData.rating_performance}
                onChange={(e) => setFormData({ ...formData, rating_performance: e.target.value })}
                placeholder="Ej. 2450"
                className="w-full bg-[#0B0F19] border border-[#2B5B84] rounded-xl px-3 py-2 text-sm text-[#F0F4F8] font-mono focus:outline-none focus:border-[#5FA8D3]"
              />
            </div>

            {/* Premio Ganado */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#F0F4F8] mb-1">
                Premio Obtenido
              </label>
              <input
                type="text"
                value={formData.prize_won}
                onChange={(e) => setFormData({ ...formData, prize_won: e.target.value })}
                placeholder="Ej. RD$ 25,000 + Trofeo de Campeón"
                className="w-full bg-[#0B0F19] border border-[#2B5B84] rounded-xl px-3 py-2 text-sm text-[#F0F4F8] focus:outline-none focus:border-[#5FA8D3]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingResult(false)}
              className="px-4 py-2 text-xs font-semibold text-[#94A3B8] hover:text-[#F0F4F8]"
            >
              Cancelar
            </button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] text-xs font-bold px-5 py-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                  {editingResultId ? "Guardar Cambios" : "Agregar Posición"}
                </>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* TABLA DE RESULTADOS CARGADOS */}
      {filteredResults.length === 0 ? (
        <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-12 text-center shadow-xl">
          <Trophy className="h-12 w-12 text-[#94A3B8]/40 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#F0F4F8]">No hay posiciones registradas</h3>
          <p className="text-sm text-[#94A3B8] mt-1 max-w-md mx-auto">
            Comienza a registrar las posiciones, puntos y premios obtenidos por los jugadores en este torneo.
          </p>
          <Button
            type="button"
            onClick={handleOpenAdd}
            className="mt-4 bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-bold text-xs"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Registrar Primer Lugar
          </Button>
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
                  <th scope="col" className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B5B84]/40">
                {filteredResults.map((item) => {
                  const cat = categories.find((c) => c.id === item.category_id)
                  const isTop3 = item.position <= 3
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
                        <div className="flex items-center gap-2">
                          {item.player?.photo_url ? (
                            <img
                              src={item.player.photo_url}
                              alt={item.player_name}
                              className="h-8 w-8 rounded-full object-cover border border-[#2B5B84]"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-[#0B0F19] border border-[#2B5B84] flex items-center justify-center">
                              <User className="h-4 w-4 text-[#94A3B8]" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-[#F0F4F8]">{item.player_name}</p>
                            {item.player?.club && (
                              <p className="text-[11px] text-[#94A3B8]">{item.player.club}</p>
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
                          <span className="inline-flex items-center gap-1 text-amber-300">
                            <DollarSign className="h-3.5 w-3.5 text-amber-400" />
                            {item.prize_won}
                          </span>
                        ) : (
                          <span className="text-[#94A3B8]/50">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditResult(item)}
                            className="p-1.5 rounded-lg text-[#5FA8D3] hover:text-[#4A96C2] hover:bg-[#0B0F19] transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteResult(item.id, item.player_name)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
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
