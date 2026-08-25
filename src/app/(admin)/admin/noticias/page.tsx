import type { Metadata } from "next"
import Link from "next/link"
import { Plus, Newspaper, Sparkles } from "lucide-react"
import { connection } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { formatDateShort } from "@/lib/utils"

export const metadata: Metadata = { title: "Noticias" }

export default async function AdminNoticiasPage() {
  await connection()
  const supabase = await createClient()
  const { data: news } = await supabase
    .from("news")
    .select("id, title, status, published_at, is_featured")
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#F0F4F8] tracking-tight">Noticias</h1>
          <p className="text-[#94A3B8] mt-1 text-sm">{news?.length ?? 0} articulos registrados</p>
        </div>
        <Link href="/admin/noticias/nueva">
          <Button className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-bold">
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Nueva Noticia
          </Button>
        </Link>
      </div>

      {!news?.length ? (
        <EmptyState
          icon={Newspaper}
          title="No hay noticias"
          description="Publica el primer articulo o cronica informativa."
          action={
            <Link href="/admin/noticias/nueva">
              <Button className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-bold">
                <Plus className="h-4 w-4 mr-2" /> Crear Noticia
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] overflow-hidden shadow-xl">
          <table className="w-full text-sm" aria-label="Lista de noticias">
            <thead className="bg-[#0B0F19]/60 border-b border-[#2B5B84]">
              <tr>
                <th className="text-left px-5 py-4 font-bold text-[#F0F4F8]">Titulo</th>
                <th className="text-left px-5 py-4 font-bold text-[#F0F4F8] hidden sm:table-cell">Fecha de Publicacion</th>
                <th className="text-left px-5 py-4 font-bold text-[#F0F4F8]">Estado</th>
                <th className="text-right px-5 py-4 font-bold text-[#F0F4F8]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2B5B84]/40">
              {news.map((n) => (
                <tr key={n.id} className="hover:bg-[#0B0F19]/40 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-bold text-[#F0F4F8]">{n.title}</span>
                    {n.is_featured && (
                      <span className="inline-flex items-center gap-1 ml-2 text-xs text-[#5FA8D3] font-bold bg-[#5FA8D3]/10 px-2 py-0.5 rounded-full border border-[#5FA8D3]/30">
                        <Sparkles className="h-3 w-3" /> Destacada
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-[#94A3B8] hidden sm:table-cell">
                    {n.published_at ? formatDateShort(n.published_at) : "Sin publicar"}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={n.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/noticias/${n.id}`}
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
