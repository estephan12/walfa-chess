import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Trophy, ArrowRight } from "lucide-react"
import { formatDateRange, getTournamentTypeLabel } from "@/lib/utils"
import type { Tournament } from "@/types"

interface TournamentCardProps {
  tournament: Tournament
  className?: string
}

export function TournamentCard({ tournament, className = "" }: TournamentCardProps) {
  return (
    <div className={`group flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      {/* Portada / Póster */}
      <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
        {tournament.cover_image_url ? (
          <Image
            src={tournament.cover_image_url}
            alt={tournament.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-400">
            <Trophy className="h-10 w-10 opacity-50" />
          </div>
        )}

        {/* Badge tipo torneo */}
        <div className="absolute top-2.5 left-2.5">
          <span className="inline-flex items-center rounded bg-[#0A1931]/90 backdrop-blur px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
            {getTournamentTypeLabel(tournament.type)}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1D64F2] transition-colors line-clamp-2 leading-snug">
          <Link href={`/torneos/${tournament.slug}`}>
            {tournament.title}
          </Link>
        </h3>

        {/* Metadatos */}
        <div className="mt-3 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-700">
              {formatDateRange(tournament.start_date, tournament.end_date)}
            </span>
          </div>

          {tournament.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="line-clamp-1 text-slate-600">{tournament.location}</span>
            </div>
          )}
        </div>

        {/* Enlace a detalles */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center">
          <Link
            href={`/torneos/${tournament.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1D64F2] hover:text-[#1554cf] transition-colors"
          >
            Ver detalles <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
