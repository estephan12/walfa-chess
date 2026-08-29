import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { connection } from "next/server"
import { Plus, Trophy, Sparkles, Calendar, MapPin } from "lucide-react"

import { getAllTournamentsAdmin } from "@/lib/queries/tournamentQueries"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { AdminTournamentActions } from "@/components/admin/AdminTournamentActions"
import { formatDateShort, getTournamentTypeLabel, formatCurrency } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Torneos | Panel de Administración",
}

export default async function AdminTorneosPage() {
  await connection()
  const tournaments = await getAllTournamentsAdmin()

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#F0F4F8] tracking-tight">Gestión de Torneos</h1>
          <p className="text-[#94A3B8] mt-1 text-sm">
            {tournaments.length} torneos registrados en el sistema
          </p>
        </div>
        <Link href="/admin/torneos/nuevo">
          <Button className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-black shadow-md shadow-[#5FA8D3]/20">
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Nuevo Torneo
          </Button>
        </Link>
      </div>

      {/* Tabla o estado vacío */}
      {!tournaments.length ? (
        <EmptyState
          icon={Trophy}
          title="No hay torneos registrados"
          description="Crea el primer torneo oficial de la Fundación WALFA-CHESS para comenzar a recibir inscripciones."
          action={
            <Link href="/admin/torneos/nuevo">
              <Button className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-black">
                <Plus className="h-4 w-4 mr-2" /> Crear Torneo Ahora
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Lista de torneos">
              <thead className="bg-[#0B0F19]/70 border-b border-[#2B5B84]">
                <tr>
                  <th className="text-left px-5 py-4 font-bold text-[#F0F4F8]">Torneo</th>
                  <th className="text-left px-5 py-4 font-bold text-[#F0F4F8] hidden md:table-cell">Modalidad</th>
                  <th className="text-left px-5 py-4 font-bold text-[#F0F4F8]">Fecha Inicio</th>
                  <th className="text-left px-5 py-4 font-bold text-[#F0F4F8]">Estado</th>
                  <th className="text-right px-5 py-4 font-bold text-[#F0F4F8]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B5B84]/40">
                {tournaments.map((t) => (
                  <tr key={t.id} className="hover:bg-[#0B0F19]/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {t.cover_image_url ? (
                          <div className="relative h-10 w-16 rounded-lg overflow-hidden border border-[#2B5B84] shrink-0 bg-[#0B0F19]">
                            <Image
                              src={t.cover_image_url}
                              alt={t.title}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-16 rounded-lg border border-[#2B5B84] bg-[#0B0F19] flex items-center justify-center shrink-0">
                            <Trophy className="h-4 w-4 text-[#2B5B84]" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-[#F0F4F8] line-clamp-1">{t.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {t.location && (
                              <span className="text-xs text-[#94A3B8] flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-[#5FA8D3]" /> {t.location}
                              </span>
                            )}
                            {t.is_featured && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-[#5FA8D3] font-bold bg-[#5FA8D3]/10 px-2 py-0.5 rounded-full border border-[#5FA8D3]/30">
                                <Sparkles className="h-2.5 w-2.5" /> Destacado
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#94A3B8] text-xs font-semibold hidden md:table-cell">
                      {getTournamentTypeLabel(t.type)}
                    </td>
                    <td className="px-5 py-4 text-[#94A3B8] text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#5FA8D3]" />
                        {formatDateShort(t.start_date)}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <AdminTournamentActions
                        id={t.id}
                        slug={t.slug}
                        title={t.title}
                        status={t.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
