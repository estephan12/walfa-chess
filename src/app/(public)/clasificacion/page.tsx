import type { Metadata } from "next"
import { Suspense } from "react"
import { Users, Award, Trophy, Zap, Sparkles } from "lucide-react"
import { getPublicPlayersRanking, getPlayerStats } from "@/lib/queries/playerQueries"
import { RankingTable } from "@/components/public/RankingTable"
import { PageLoadingSpinner } from "@/components/shared/LoadingSpinner"

export const metadata: Metadata = {
  title: "Clasificación & Ranking Oficial — WALFA-CHESS",
  description:
    "Tabla de posiciones, ranking y rendimiento oficial de los ajedrecistas federados y locales de la Fundación WALFA-CHESS.",
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
        <div className="bg-[#132238] border border-[#2B5B84] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-[#5FA8D3]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
              Jugadores Federados
            </span>
            <Users className="h-5 w-5 text-[#5FA8D3]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#F0F4F8] mt-2 font-mono">
            {stats.totalPlayers}
          </p>
          <p className="text-[11px] text-[#94A3B8] mt-1">Registrados y activos</p>
        </div>

        <div className="bg-[#132238] border border-[#2B5B84] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-amber-400/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
              Titulados Oficiales
            </span>
            <Award className="h-5 w-5 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-2 font-mono">
            {stats.titledPlayers}
          </p>
          <p className="text-[11px] text-[#94A3B8] mt-1">GM, IM, FM, CM, MN</p>
        </div>

        <div className="bg-[#132238] border border-[#2B5B84] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-400/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
              Elo FIDE Máximo
            </span>
            <Trophy className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2 font-mono">
            {stats.topFideRating > 0 ? stats.topFideRating : "—"}
          </p>
          <p className="text-[11px] text-[#94A3B8] mt-1">Líder del ranking</p>
        </div>

        <div className="bg-[#132238] border border-[#2B5B84] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-sky-400/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
              Promedio de Elo
            </span>
            <Zap className="h-5 w-5 text-sky-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-sky-300 mt-2 font-mono">
            {stats.avgFideRating > 0 ? stats.avgFideRating : "—"}
          </p>
          <p className="text-[11px] text-[#94A3B8] mt-1">FIDE General</p>
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5FA8D3]/10 border border-[#5FA8D3]/30 text-xs font-bold text-[#5FA8D3] uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          Ranking Oficial Actualizado
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#F0F4F8] tracking-tight">
          Clasificación & Ranking
        </h1>
        <p className="text-base sm:text-lg text-[#94A3B8]">
          Rendimiento y puntuaciones Elo (FIDE y Nacional) de los ajedrecistas registrados en la Fundación WALFA-CHESS.
        </p>
      </div>

      <Suspense fallback={<PageLoadingSpinner />}>
        <RankingContent />
      </Suspense>
    </div>
  )
}
