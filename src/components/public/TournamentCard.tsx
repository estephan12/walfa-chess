import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Trophy, Clock, ArrowRight, DollarSign } from "lucide-react"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Button } from "@/components/ui/button"
import {
  formatDateRange,
  getTournamentTypeLabel,
  formatCurrency,
} from "@/lib/utils"
import type { Tournament } from "@/types"

interface TournamentCardProps {
  tournament: Tournament
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const isRegistrationOpen =
    tournament.status === "published" && tournament.inscription_type !== "closed"

  return (
    <div className="group flex flex-col rounded-2xl border border-[#2B5B84] bg-[#132238] overflow-hidden shadow-xl hover:border-[#5FA8D3] transition-all duration-300 hover:-translate-y-1">
      {/* Portada */}
      <div className="relative aspect-[16/9] w-full bg-[#0B0F19] overflow-hidden border-b border-[#2B5B84]/60">
        {tournament.cover_image_url ? (
          <Image
            src={tournament.cover_image_url}
            alt={tournament.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#132238] to-[#0B0F19]">
            <Trophy className="h-12 w-12 text-[#2B5B84] opacity-50" />
          </div>
        )}

        {/* Badges superiores */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center rounded-lg bg-[#0B0F19]/80 backdrop-blur border border-[#2B5B84] px-2.5 py-1 text-xs font-bold text-[#5FA8D3] uppercase tracking-wider">
            {getTournamentTypeLabel(tournament.type)}
          </span>
          <StatusBadge status={tournament.status} />
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-[#F0F4F8] group-hover:text-[#5FA8D3] transition-colors line-clamp-2">
          <Link href={`/torneos/${tournament.slug}`}>
            {tournament.title}
          </Link>
        </h3>

        {tournament.description && (
          <p className="mt-2 text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
            {tournament.description}
          </p>
        )}

        {/* Metadatos */}
        <div className="mt-5 space-y-2 border-t border-[#2B5B84]/40 pt-4 text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#5FA8D3] shrink-0" />
            <span className="font-medium text-[#F0F4F8]">
              {formatDateRange(tournament.start_date, tournament.end_date)}
            </span>
          </div>

          {tournament.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#5FA8D3] shrink-0" />
              <span className="line-clamp-1">{tournament.location}</span>
            </div>
          )}

          {tournament.time_control && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#5FA8D3] shrink-0" />
              <span>{tournament.time_control}</span>
            </div>
          )}

          {tournament.prize_pool && (
            <div className="flex items-center gap-2 text-[#5FA8D3] font-bold">
              <Trophy className="h-4 w-4 shrink-0" />
              <span className="line-clamp-1">{tournament.prize_pool}</span>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="mt-6 pt-4 border-t border-[#2B5B84]/40 flex items-center gap-3">
          <Link href={`/torneos/${tournament.slug}`} className="flex-1">
            <Button
              variant="secondary"
              className="w-full bg-[#0B0F19] border border-[#2B5B84] text-[#F0F4F8] hover:bg-[#1a2d4a] hover:border-[#5FA8D3] text-xs font-bold py-2"
            >
              Ver Bases <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>

          {isRegistrationOpen && (
            <Link
              href={
                tournament.inscription_type === "external" && tournament.inscription_url
                  ? tournament.inscription_url
                  : `/inscripciones?torneo=${tournament.slug}`
              }
              target={tournament.inscription_type === "external" ? "_blank" : undefined}
            >
              <Button
                size="sm"
                className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-black text-xs px-4"
              >
                Inscribirme
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
