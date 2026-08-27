import type { Metadata } from "next"
import Link from "next/link"
import { Trophy, ListOrdered, Calendar, Award, ExternalLink, ArrowRight, User } from "lucide-react"
import { connection } from "next/server"
import { getAllTournamentsWithResultsAdmin } from "@/lib/queries/resultQueries"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { formatDateShort } from "@/lib/utils"
import { EmptyState } from "@/components/shared/EmptyState"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Gestión de Resultados — Admin" }

export default async function AdminResultadosPage() {
  await connection()
  const tournaments = await getAllTournamentsWithResultsAdmin()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F0F4F8] tracking-tight">
            Resultados & Tablas de Posiciones
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Gestiona los resultados finales, rondas, cuadros de honor y puntuaciones por torneo.
          </p>
        </div>
      </div>

      {tournaments.length === 0 ? (
        <EmptyState
          icon={ListOrdered}
          title="No hay torneos registrados"
          description="Crea un torneo primero para poder cargar sus resultados y cuadro de honor."
          action={
            <Link href="/admin/torneos/nuevo">
              <Button className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-bold">
                Crear Torneo
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((t) => (
            <div
              key={t.id}
              className="bg-[#132238] border border-[#2B5B84] rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-[#5FA8D3]/60 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={t.status} />
                  <span className="text-xs text-[#94A3B8] flex items-center gap-1 font-mono">
                    <Calendar className="h-3.5 w-3.5 text-[#5FA8D3]" />
                    {formatDateShort(t.start_date)}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-[#F0F4F8] group-hover:text-[#5FA8D3] transition-colors line-clamp-2">
                    {t.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1 line-clamp-1">
                    {t.location || "Ubicación no especificada"}
                  </p>
                </div>

                {/* Resumen del Campeón / Resultados */}
                <div className="p-3.5 rounded-xl bg-[#0B0F19]/60 border border-[#2B5B84]/40 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#94A3B8] font-medium">Posiciones cargadas:</span>
                    <span className="font-mono font-bold text-[#5FA8D3]">
                      {t.results_count} {t.results_count === 1 ? "jugador" : "jugadores"}
                    </span>
                  </div>

                  {t.winner ? (
                    <div className="flex items-center gap-2 pt-1 border-t border-[#2B5B84]/30 text-xs">
                      <Trophy className="h-4 w-4 text-amber-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-amber-300 truncate">
                          1º: {t.winner.player_name}
                        </p>
                        {t.winner.points !== null && (
                          <p className="text-[11px] text-[#94A3B8]">
                            {t.winner.points} pts {t.winner.prize_won ? `• ${t.winner.prize_won}` : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] italic text-[#94A3B8]/60 pt-1 border-t border-[#2B5B84]/30">
                      Sin posiciones registradas aún
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-[#2B5B84]/40 flex items-center justify-between">
                <Link
                  href={`/admin/resultados/${t.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5FA8D3] hover:bg-[#4A96C2] text-[#0B0F19] text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <Trophy className="h-4 w-4" />
                  <span>Gestionar Resultados</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-auto" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}