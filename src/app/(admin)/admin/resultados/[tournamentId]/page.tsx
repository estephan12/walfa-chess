import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { connection } from "next/server"
import Link from "next/link"
import { ArrowLeft, Trophy, Calendar, MapPin } from "lucide-react"
import { getTournamentResultsFull } from "@/lib/queries/resultQueries"
import { getAllPlayersAdmin } from "@/lib/queries/playerQueries"
import { AdminResultManager } from "@/components/admin/AdminResultManager"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { formatDateShort } from "@/lib/utils"

export const instant = false

interface Props {
  params: Promise<{ tournamentId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tournamentId } = await params
  const data = await getTournamentResultsFull(tournamentId)
  return {
    title: data ? `Resultados: ${data.tournament.title}` : "Resultados de Torneo",
  }
}

export default async function AdminGestionResultadosPage({ params }: Props) {
  await connection()
  const { tournamentId } = await params

  const [data, allPlayers] = await Promise.all([
    getTournamentResultsFull(tournamentId),
    getAllPlayersAdmin(),
  ])

  if (!data) {
    notFound()
  }

  const { tournament, categories, results } = data

  return (
    <div className="space-y-6 max-w-6xl">
      {/* HEADER CON NAVEGACIÓN Y DETALLES DEL TORNEO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#132238] border border-[#2B5B84] rounded-2xl p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <Link
            href="/admin/resultados"
            className="p-2 rounded-xl border border-[#2B5B84] text-[#94A3B8] hover:text-[#F0F4F8] hover:bg-[#0B0F19] transition-colors shrink-0 mt-1"
            title="Volver a Resultados"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <StatusBadge status={tournament.status} />
              <span className="text-xs text-[#94A3B8] font-mono flex items-center gap-1">
                <Calendar className="h-3 w-3 text-[#5FA8D3]" />
                {formatDateShort(tournament.start_date)}
              </span>
              {tournament.location && (
                <span className="text-xs text-[#94A3B8] flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[#5FA8D3]" />
                  {tournament.location}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#F0F4F8] tracking-tight">
              {tournament.title}
            </h1>
          </div>
        </div>
      </div>

      {/* COMPONENTE INTERACTIVO DE GESTIÓN DE RESULTADOS */}
      <AdminResultManager
        tournament={tournament}
        categories={categories}
        results={results}
        allPlayers={allPlayers}
      />
    </div>
  )
}
