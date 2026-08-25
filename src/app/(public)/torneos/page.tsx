import type { Metadata } from "next"
import { cacheLife } from "next/cache"
import { Suspense } from "react"
import { Trophy, Calendar } from "lucide-react"

import { getPublicTournaments } from "@/lib/queries/tournamentQueries"
import { TournamentCard } from "@/components/public/TournamentCard"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageLoadingSpinner } from "@/components/shared/LoadingSpinner"

export const metadata: Metadata = {
  title: "Torneos Oficiales | Fundación WALFA CHESS",
  description:
    "Calendario de torneos, campeonatos nacionales y convocatorias oficiales de ajedrez en República Dominicana.",
}

async function TournamentsList() {
  "use cache"
  cacheLife("minutes")

  const tournaments = await getPublicTournaments()

  if (!tournaments.length) {
    return (
      <EmptyState
        icon={Trophy}
        title="No hay torneos disponibles en este momento"
        description="Estamos preparando el calendario para los próximos eventos nacionales. Te invitamos a revisar periódicamente nuestras publicaciones."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {tournaments.map((tournament) => (
        <TournamentCard key={tournament.id} tournament={tournament} />
      ))}
    </div>
  )
}

export default function TorneosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Encabezado */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#2B5B84] bg-[#132238] px-3.5 py-1 text-xs font-bold text-[#5FA8D3] uppercase tracking-wider mb-3">
          <Trophy className="h-3.5 w-3.5" /> Calendario Oficial
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#F0F4F8] tracking-tight">
          Torneos & Competencias
        </h1>
        <p className="mt-3 text-base sm:text-lg text-[#94A3B8] max-w-3xl">
          Explora los próximos eventos de la Fundación WALFA CHESS, consulta las bases técnicas y asegura tu inscripción online.
        </p>
      </div>

      {/* Grid de torneos */}
      <Suspense fallback={<PageLoadingSpinner />}>
        <TournamentsList />
      </Suspense>
    </div>
  )
}
