import type { Metadata } from "next"
import Link from "next/link"
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  User,
  Mail,
  Phone,
  MessageCircle,
  Trophy,
} from "lucide-react"
import { connection } from "next/server"
import {
  getAllInscriptionsAdmin,
  getInscriptionStatsAdmin,
} from "@/lib/queries/inscriptionQueries"
import { getAllTournamentsAdmin } from "@/lib/queries/tournamentQueries"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { EmptyState } from "@/components/shared/EmptyState"
import { AdminInscriptionActions } from "@/components/admin/AdminInscriptionActions"
import { AdminInscriptionExport } from "@/components/admin/AdminInscriptionExport"

export const metadata: Metadata = {
  title: "Gestión de Inscripciones",
}

export const instant = false

interface AdminInscripcionesPageProps {
  searchParams: Promise<{
    torneo?: string
    estado?: string
    q?: string
  }>
}

export default async function AdminInscripcionesPage({
  searchParams,
}: AdminInscripcionesPageProps) {
  await connection()

  const { torneo: tournamentId, estado: statusFilter, q: searchQuery } = await searchParams

  const [inscriptionsData, stats, tournaments] = await Promise.all([
    getAllInscriptionsAdmin({
      tournamentId: tournamentId || undefined,
      status: statusFilter || undefined,
    }),
    getInscriptionStatsAdmin(),
    getAllTournamentsAdmin(),
  ])

  // Filtro de búsqueda en memoria por nombre/email si se pasa `q`
  const inscriptions = searchQuery
    ? inscriptionsData.filter((ins) => {
        const query = searchQuery.toLowerCase()
        return (
          ins.full_name.toLowerCase().includes(query) ||
          ins.email.toLowerCase().includes(query) ||
          (ins.fide_id && ins.fide_id.toLowerCase().includes(query))
        )
      })
    : inscriptionsData

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#F0F4F8] tracking-tight flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-[#5FA8D3]" />
            Inscripciones a Torneos
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Revisión, validación y gestión de participantes registrados
          </p>
        </div>

        <div>
          <AdminInscriptionExport inscriptions={inscriptions} />
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#94A3B8] uppercase">Total</span>
            <ClipboardList className="h-4 w-4 text-[#5FA8D3]" />
          </div>
          <p className="mt-2 text-3xl font-black text-[#F0F4F8]">{stats.total}</p>
          <p className="text-[11px] text-[#94A3B8] mt-1">Registros recibidos</p>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 uppercase">Pendientes</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 text-3xl font-black text-amber-400">{stats.pending}</p>
          <p className="text-[11px] text-amber-300/70 mt-1">Por revisar</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 uppercase">Confirmadas</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-3xl font-black text-emerald-400">{stats.confirmed}</p>
          <p className="text-[11px] text-emerald-300/70 mt-1">Participantes listos</p>
        </div>

        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-300 uppercase">Rechazadas</span>
            <XCircle className="h-4 w-4 text-rose-400" />
          </div>
          <p className="mt-2 text-3xl font-black text-rose-400">{stats.rejected}</p>
          <p className="text-[11px] text-rose-300/70 mt-1">No admitidas</p>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-4 shadow-md">
        <form method="GET" className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Búsqueda por texto */}
          <div>
            <label htmlFor="q" className="block text-[11px] font-bold text-[#94A3B8] uppercase mb-1">
              Buscar participante
            </label>
            <input
              id="q"
              name="q"
              defaultValue={searchQuery || ""}
              placeholder="Nombre, correo o FIDE ID..."
              className="w-full rounded-xl bg-[#0B0F19] border border-[#2B5B84] px-3.5 py-2 text-xs text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:border-[#5FA8D3] focus:outline-none"
            />
          </div>

          {/* Filtro por Torneo */}
          <div>
            <label
              htmlFor="torneo"
              className="block text-[11px] font-bold text-[#94A3B8] uppercase mb-1"
            >
              Filtrar por Torneo
            </label>
            <select
              id="torneo"
              name="torneo"
              defaultValue={tournamentId || "all"}
              className="w-full rounded-xl bg-[#0B0F19] border border-[#2B5B84] px-3 py-2 text-xs text-[#F0F4F8] focus:border-[#5FA8D3] focus:outline-none"
            >
              <option value="all">Todos los torneos</option>
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Estado */}
          <div>
            <label
              htmlFor="estado"
              className="block text-[11px] font-bold text-[#94A3B8] uppercase mb-1"
            >
              Estado
            </label>
            <select
              id="estado"
              name="estado"
              defaultValue={statusFilter || "all"}
              className="w-full rounded-xl bg-[#0B0F19] border border-[#2B5B84] px-3 py-2 text-xs text-[#F0F4F8] focus:border-[#5FA8D3] focus:outline-none"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="confirmed">Confirmadas</option>
              <option value="rejected">Rechazadas</option>
            </select>
          </div>

          {/* Botones de acción */}
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-[#5FA8D3] text-[#0B0F19] font-bold text-xs py-2.5 px-4 hover:bg-[#4A96C2] transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Filter className="h-3.5 w-3.5" /> Filtrar
            </button>
            {(tournamentId || statusFilter || searchQuery) && (
              <Link
                href="/admin/inscripciones"
                className="rounded-xl bg-[#0B0F19] border border-[#2B5B84] text-[#94A3B8] hover:text-[#F0F4F8] font-bold text-xs py-2.5 px-3 transition"
              >
                Limpiar
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* Tabla de Inscripciones */}
      {inscriptions.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-[#2B5B84] bg-[#132238] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#F0F4F8]">
              <thead className="bg-[#0B0F19] text-[#94A3B8] uppercase tracking-wider font-bold border-b border-[#2B5B84]">
                <tr>
                  <th className="py-3.5 px-4">Jugador</th>
                  <th className="py-3.5 px-4">Torneo & Categoría</th>
                  <th className="py-3.5 px-4">Contacto</th>
                  <th className="py-3.5 px-4">Fecha</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B5B84]/50">
                {inscriptions.map((ins) => {
                  const phoneClean = (ins.phone || "").replace(/\D/g, "")

                  return (
                    <tr key={ins.id} className="hover:bg-[#1a2d4a]/50 transition-colors">
                      {/* Jugador */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#F0F4F8] text-sm flex items-center gap-2">
                          <User className="h-4 w-4 text-[#5FA8D3] shrink-0" />
                          <span>{ins.full_name}</span>
                        </div>
                        {ins.fide_id && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#0B0F19] border border-[#2B5B84] text-[10px] font-mono text-[#5FA8D3]">
                              FIDE: {ins.fide_id}
                            </span>
                          </div>
                        )}
                        {ins.notes && (
                          <p className="mt-1 text-[11px] text-[#94A3B8] line-clamp-1 italic" title={ins.notes}>
                            &quot;{ins.notes}&quot;
                          </p>
                        )}
                      </td>

                      {/* Torneo */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-[#F0F4F8]">
                          {ins.tournament?.title || "Torneo no disponible"}
                        </div>
                        <div className="mt-0.5 text-[11px] text-[#5FA8D3]">
                          {ins.category?.name || "Categoría General"}
                        </div>
                      </td>

                      {/* Contacto */}
                      <td className="py-4 px-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-[#94A3B8]">
                          <Mail className="h-3.5 w-3.5 text-[#5FA8D3]" />
                          <a
                            href={`mailto:${ins.email}`}
                            className="hover:text-[#5FA8D3] hover:underline"
                          >
                            {ins.email}
                          </a>
                        </div>
                        {ins.phone && (
                          <div className="flex items-center gap-2 text-[#94A3B8]">
                            <Phone className="h-3.5 w-3.5 text-[#5FA8D3]" />
                            <span>{ins.phone}</span>
                            {phoneClean.length >= 8 && (
                              <a
                                href={`https://wa.me/${phoneClean.startsWith("1") ? phoneClean : `1${phoneClean}`}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Escribir por WhatsApp"
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:underline bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded"
                              >
                                <MessageCircle className="h-3 w-3" /> WA
                              </a>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Fecha */}
                      <td className="py-4 px-4 text-[#94A3B8] whitespace-nowrap">
                        {new Date(ins.created_at).toLocaleDateString("es-DO", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Estado */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <StatusBadge status={ins.status} />
                      </td>

                      {/* Acciones */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <AdminInscriptionActions
                          inscriptionId={ins.id}
                          currentStatus={ins.status}
                          playerName={ins.full_name}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="No hay inscripciones encontradas"
          description={
            searchQuery || tournamentId || statusFilter
              ? "No se encontraron inscripciones con los filtros especificados."
              : "Aún no se han recibido registros para los torneos activos."
          }
        />
      )}
    </div>
  )
}
