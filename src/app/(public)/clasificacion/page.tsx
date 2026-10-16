import type { Metadata } from "next"
import { Suspense } from "react"
import { Users, Award, Trophy, Zap, Sparkles, Flame, Clock } from "lucide-react"
import { getPublicPlayersRanking, getPlayerStats } from "@/lib/queries/playerQueries"
import { RankingTable } from "@/components/public/RankingTable"
import { PageLoadingSpinner } from "@/components/shared/LoadingSpinner"

export const metadata: Metadata = {
  title: "Clasificación & Ranking Oficial — WALFA-CHESS",
  description:
    "Tabla de posiciones, ranking y rendimiento oficial en Blitz, Rápido y Estándar de los ajedrecistas de la Fundación WALFA-CHESS.",
}

async function RankingContent() {
  const [players, stats] = await Promise.all([
    getPublicPlayersRanking(),
    getPlayerStats(),
  ])

  return (
    <div className="space-y-10">
      {/* METRIC STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-[#1D64F2]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Jugadores Activos
            </span>
            <Users className="h-5 w-5 text-[#1D64F2]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-mono">
            {stats.totalPlayers}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">{stats.titledPlayers} titulados oficiales</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-amber-400/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Top Elo Estándar
            </span>
            <Award className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-2 font-mono">
            {stats.topStandardRating > 0 ? stats.topStandardRating : "—"}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Clásico / FIDE Oficial</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-blue-400/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Top Elo Rápido
            </span>
            <Clock className="h-5 w-5 text-[#1D64F2]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#1D64F2] mt-2 font-mono">
            {stats.topRapidRating > 0 ? stats.topRapidRating : "—"}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Modalidad Rápida</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-orange-400/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Top Elo Blitz
            </span>
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-orange-600 mt-2 font-mono">
            {stats.topBlitzRating > 0 ? stats.topBlitzRating : "—"}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Modalidad Relámpago</p>
        </div>
      </div>

      {/* TABLA DE CLASIFICACIÓN INTERACTIVA */}
      <RankingTable initialPlayers={players} />
    </div>
  )
}

export default function ClasificacionPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* HEADER DE LA PÁGINA */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#1D64F2] uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          Ranking Oficial Actualizado
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Clasificación & Ranking
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Puntuaciones oficiales en modalidades <strong>Estándar</strong>, <strong>Rápido</strong> y <strong>Blitz</strong> de los ajedrecistas registrados en la Fundación WALFA-CHESS.
        </p>
      </div>

      <Suspense fallback={<PageLoadingSpinner />}>
        <RankingContent />
      </Suspense>
    </div>
  )
}
