import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import { Trophy, Calendar, MapPin, ArrowRight, ListOrdered, Sparkles } from "lucide-react"
import { getPublicTournamentsWithResults } from "@/lib/queries/resultQueries"
import { formatDateShort } from "@/lib/utils"
import { EmptyState } from "@/components/shared/EmptyState"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { PageLoadingSpinner } from "@/components/shared/LoadingSpinner"

export const metadata: Metadata = {
  title: "Resultados & Tablas de Posiciones — WALFA-CHESS",
  description:
    "Resultados oficiales, podios de ganadores y tablas de posiciones de los torneos de ajedrez organizados por la Fundación WALFA-CHESS.",
}

async function ResultsList() {
  const tournaments = await getPublicTournamentsWithResults()

  if (tournaments.length === 0) {
    return (
      <EmptyState
        icon={ListOrdered}
        title="No hay resultados oficiales publicados aún"
        description="Tan pronto concluyan las rondas de los próximos torneos, se publicarán aquí las clasificaciones y cuadros de honor."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {tournaments.map((t) => (
        <div
          key={t.id}
          className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#1D64F2]/40 transition-all group"
        >
          <div>
            {/* Imagen de portada si existe */}
            {t.cover_image_url ? (
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden border-b border-slate-200">
                <Image
                  src={t.cover_image_url}
                  alt={t.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                <div className="absolute top-3 left-3">
                  <StatusBadge status={t.status} />
                </div>
              </div>
            ) : (
              <div className="p-6 pb-0 flex items-center justify-between">
                <StatusBadge status={t.status} />
              </div>
            )}

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <Calendar className="h-3.5 w-3.5 text-[#1D64F2]" />
                {formatDateShort(t.start_date)}
                {t.location && (
                  <>
                    <span>•</span>
                    <span className="truncate flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#1D64F2]" />
                      {t.location}
                    </span>
                  </>
                )}
              </div>

              <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#1D64F2] transition-colors line-clamp-2">
                <Link href={`/resultados/${t.id}`}>
                  {t.title}
                </Link>
              </h2>

              {/* Campeón / Cuadro de Honor Preview */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                {t.winner ? (
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 flex items-center gap-1">
                      <Trophy className="h-3.5 w-3.5" /> Campeón Oficial
                    </span>
                    <p className="font-bold text-base text-slate-900 mt-0.5 truncate">
                      {t.winner.player_name}
                    </p>
                    {t.winner.points !== null && (
                      <p className="text-xs text-slate-600">
                        Puntuación: <strong className="text-amber-700 font-mono">{t.winner.points} pts</strong>
                        {t.winner.prize_won ? ` • ${t.winner.prize_won}` : ""}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs italic text-slate-500">
                    Posiciones en proceso de homologación
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 pt-0">
            <Link
              href={`/resultados/${t.id}`}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1D64F2] hover:bg-[#1554cf] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Trophy className="h-4 w-4" />
              <span>Ver Tabla de Posiciones</span>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ResultadosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* HEADER DE LA PÁGINA */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#1D64F2] uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          Clasificaciones & Cuadros de Honor
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Resultados de Torneos
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Consulta las posiciones finales, podios y desempeño técnico de los torneos oficiales de WALFA-CHESS.
        </p>
      </div>

      <Suspense fallback={<PageLoadingSpinner />}>
        <ResultsList />
      </Suspense>
    </div>
  )
}
