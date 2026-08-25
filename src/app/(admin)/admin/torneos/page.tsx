import type { Metadata } from "next"
import Link from "next/link"
import { Plus, Trophy, Sparkles } from "lucide-react"
import { connection } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { formatDateShort } from "@/lib/utils"

export const metadata: Metadata = { title: "Torneos" }

export default async function AdminTorneosPage() {
  await connection()
  const supabase = await createClient()
  const { data: tournaments } = await supabase
    .from("tournaments")
    .select("id, title, status, start_date, type, is_featured")
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#F0F4F8] tracking-tight">Torneos</h1>
          <p className="text-[#94A3B8] mt-1 text-sm">{tournaments?.length ?? 0} torneos registrados en el sistema</p>
        </div>
        <Link href="/admin/torneos/nuevo">
          <Button className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-bold">
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Nuevo Torneo
          </Button>
        </Link>
      </div>

      {!tournaments?.length ? (
        <EmptyState
          icon={Trophy}
          title="No hay torneos"
          description="Crea el primer torneo oficial de la Fundación WALFA CHESS."
          action={
            <Link href="/admin/torneos/nuevo">
              <Button className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-bold">
                <Plus className="h-4 w-4 mr-2" /> Crear Torneo
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] overflow-hidden shadow-xl">
          <table className="w-full text-sm" aria-label="Lista de torneos">
            <thead className="bg-[#0B0F19]/60 border-b border-[#2B5B84]">
              <tr>
                <th className="text-left px-5 py-4 font-bold text-[#F0F4F8]">Torneo</th>
                <th className="text-left px-5 py-4 font-bold text-[#F0F4F8] hidden sm:table-cell">Fecha Inicio</th>
                <th className="text-left px-5 py-4 font-bold text-[#F0F4F8]">Estado</th>
                <th className="text-right px-5 py-4 font-bold text-[#F0F4F8]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2B5B84]/40">
              {tournaments.map((t) => (
                <tr key={t.id} className="hover:bg-[#0B0F19]/40 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-bold text-[#F0F4F8]">{t.title}</span>
                    {t.is_featured && (
                      <span className="inline-flex items-center gap-1 ml-2 text-xs text-[#5FA8D3] font-bold bg-[#5FA8D3]/10 px-2 py-0.5 rounded-full border border-[#5FA8D3]/30">
                        <Sparkles className="h-3 w-3" /> Destacado
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-[#94A3B8] hidden sm:table-cell">
                    {formatDateShort(t.start_date)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/torneos/${t.id}`}
                      className="text-[#5FA8D3] hover:underline font-bold text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5FA8D3] rounded"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
