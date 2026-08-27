import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Plus, Users, Award, Shield, User, Hash, Building2 } from "lucide-react"
import { connection } from "next/server"
import { getAllPlayersAdmin } from "@/lib/queries/playerQueries"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"
import { AdminPlayerActions } from "@/components/admin/AdminPlayerActions"

export const metadata: Metadata = { title: "Gestión de Jugadores — Admin" }

export default async function AdminJugadoresPage() {
  await connection()
  const players = await getAllPlayersAdmin()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F0F4F8] tracking-tight">
            Jugadores Federados & Locales
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            {players.length} {players.length === 1 ? "jugador registrado" : "jugadores registrados"}
          </p>
        </div>
        <Link href="/admin/jugadores/nuevo">
          <Button className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-black shadow-md shadow-[#5FA8D3]/20">
            <Plus className="h-4 w-4 mr-2" />
            Registrar Jugador
          </Button>
        </Link>
      </div>

      {players.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No hay jugadores registrados"
          description="Registra al primer maestro, jugador federado o aficionado en el sistema."
          action={
            <Link href="/admin/jugadores/nuevo">
              <Button className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-bold">
                <Plus className="h-4 w-4 mr-2" /> Registrar Jugador
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#94A3B8]">
              <thead className="bg-[#0B0F19]/60 text-xs uppercase font-bold text-[#F0F4F8] border-b border-[#2B5B84]">
                <tr>
                  <th scope="col" className="px-6 py-4">Jugador</th>
                  <th scope="col" className="px-6 py-4">Elo FIDE</th>
                  <th scope="col" className="px-6 py-4 hidden md:table-cell">Elo Nacional</th>
                  <th scope="col" className="px-6 py-4 hidden lg:table-cell">Club / Asociación</th>
                  <th scope="col" className="px-6 py-4">Estado</th>
                  <th scope="col" className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B5B84]/40">
                {players.map((player) => (
                  <tr
                    key={player.id}
                    className="hover:bg-[#0B0F19]/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-full bg-[#0B0F19] overflow-hidden border border-[#2B5B84] shrink-0 flex items-center justify-center">
                          {player.photo_url ? (
                            <Image
                              src={player.photo_url}
                              alt={player.full_name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-[#94A3B8]/60" />
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs sm:max-w-sm">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {player.title && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-400 text-black shadow-sm">
                                {player.title}
                              </span>
                            )}
                            <p className="font-bold text-[#F0F4F8] truncate hover:text-[#5FA8D3] transition-colors">
                              <Link href={`/admin/jugadores/${player.id}`}>
                                {player.full_name}
                              </Link>
                            </p>
                            <span className="text-[10px] px-1 py-0.2 bg-[#0B0F19] border border-[#2B5B84] rounded text-[#94A3B8] uppercase font-mono">
                              {player.nationality || "DO"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-[#94A3B8]">
                            {player.fide_id ? (
                              <span className="flex items-center gap-1 font-mono text-[11px]">
                                <Hash className="h-3 w-3 text-[#5FA8D3]" />
                                FIDE: {player.fide_id}
                              </span>
                            ) : (
                              <span className="text-[11px] italic text-[#94A3B8]/60">Sin FIDE ID</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {player.fide_rating ? (
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-400">
                          <Award className="h-3.5 w-3.5" />
                          {player.fide_rating}
                        </span>
                      ) : (
                        <span className="text-xs text-[#94A3B8]/50 italic">Sin Elo</span>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {player.local_rating ? (
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-400">
                          <Shield className="h-3.5 w-3.5" />
                          {player.local_rating}
                        </span>
                      ) : (
                        <span className="text-xs text-[#94A3B8]/50 italic">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      {player.club ? (
                        <span className="flex items-center gap-1.5 text-xs text-[#F0F4F8] max-w-[180px] truncate" title={player.club}>
                          <Building2 className="h-3.5 w-3.5 text-[#5FA8D3] shrink-0" />
                          <span className="truncate">{player.club}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-[#94A3B8]/50 italic">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {player.is_active ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 border border-slate-600 text-slate-400">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <AdminPlayerActions
                        id={player.id}
                        fullName={player.full_name}
                        title={player.title}
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