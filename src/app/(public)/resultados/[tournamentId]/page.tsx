import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  ExternalLink,
} from "lucide-react"
import { cacheLife } from "next/cache"
import { getTournamentResultsFull } from "@/lib/queries/resultQueries"
import { TournamentResultsView } from "@/components/public/TournamentResultsView"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { formatDateShort } from "@/lib/utils"

export const instant = false

interface Props {
  params: Promise<{ tournamentId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tournamentId } = await params
  const data = await getTournamentResultsFull(tournamentId)
  if (!data) return { title: "Resultados de Torneo" }

  return {
    title: `Resultados Oficiales: ${data.tournament.title} — WALFA-CHESS`,
    description: `Tabla de posiciones, campeones y cuadro de honor del torneo ${data.tournament.title}.`,
  }
}

export default async function ResultadosTorneoPage({ params }: Props) {
  const { tournamentId } = await params
  const data = await getTournamentResultsFull(tournamentId)

  if (!data) {
    notFound()
  }

  const { tournament, categories, results } = data

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* BOTÓN VOLVER */}
      <div className="flex items-center justify-between">
        <Link
          href="/resultados"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#1D64F2] hover:text-[#1554cf] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Todos los Resultados
        </Link>

        <Link
          href={`/torneos/${tournament.slug}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 hover:text-[#1D64F2] hover:border-[#1D64F2] transition-colors"
        >
          <span>Ver Ficha Técnica del Torneo</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* CABECERA DEL TORNEO */}
      <div className="relative rounded-2xl bg-white border border-slate-200 p-6 sm:p-10 shadow-sm overflow-hidden">
        {tournament.cover_image_url && (
          <div className="absolute inset-0 opacity-5 blur-xl pointer-events-none">
            <Image
              src={tournament.cover_image_url}
              alt=""
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={tournament.status} />
            <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-[#1D64F2]" />
              {formatDateShort(tournament.start_date)}
              {tournament.end_date && ` - ${formatDateShort(tournament.end_date)}`}
            </span>
            {tournament.location && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#1D64F2]" />
                {tournament.location}
              </span>
            )}
            {tournament.time_control && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-[#1D64F2]" />
                {tournament.time_control}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            {tournament.title}
          </h1>

          {tournament.description && (
            <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
              {tournament.description}
            </p>
          )}

          {/* DATOS RÁPIDOS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Total Participantes
              </span>
              <span className="text-lg font-black text-slate-900 font-mono">
                {results.length}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Categorías
              </span>
              <span className="text-lg font-black text-[#1D64F2] font-mono">
                {categories.length > 0 ? categories.length : "General"}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Bolsa de Premios
              </span>
              <span className="text-lg font-black text-amber-600 font-mono">
                {tournament.prize_pool || "Trofeos & Medallas"}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Ritmo de Juego
              </span>
              <span className="text-lg font-black text-emerald-600 font-mono">
                {tournament.time_control || "Clásico"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* VISTA DE PODIO Y TABLA DE POSICIONES */}
      <TournamentResultsView
        tournament={tournament}
        categories={categories}
        results={results}
      />
    </div>
  )
}