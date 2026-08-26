import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Plus, Newspaper, Sparkles, Trophy } from "lucide-react"
import { connection } from "next/server"
import { getAllNewsAdmin } from "@/lib/queries/newsQueries"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { AdminNewsActions } from "@/components/admin/AdminNewsActions"
import { formatDateShort } from "@/lib/utils"

export const metadata: Metadata = { title: "Gestión de Noticias — Admin" }

export default async function AdminNoticiasPage() {
  await connection()
  const news = await getAllNewsAdmin()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F0F4F8] tracking-tight">
            Noticias & Artículos
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            {news.length} {news.length === 1 ? "artículo registrado" : "artículos registrados"}
          </p>
        </div>
        <Link href="/admin/noticias/nueva">
          <Button className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-black shadow-md shadow-[#5FA8D3]/20">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Noticia
          </Button>
        </Link>
      </div>

      {news.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No hay noticias publicadas"
          description="Crea y publica el primer artículo, crónica de torneo o comunicado de prensa."
          action={
            <Link href="/admin/noticias/nueva">
              <Button className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-bold">
                <Plus className="h-4 w-4 mr-2" /> Redactar Noticia
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
                  <th scope="col" className="px-6 py-4">Artículo</th>
                  <th scope="col" className="px-6 py-4">Estado</th>
                  <th scope="col" className="px-6 py-4 hidden md:table-cell">Fecha</th>
                  <th scope="col" className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B5B84]/40">
                {news.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#0B0F19]/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 rounded-lg bg-[#0B0F19] overflow-hidden border border-[#2B5B84] shrink-0">
                          {item.cover_image_url ? (
                            <Image
                              src={item.cover_image_url}
                              alt={item.title}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Newspaper className="h-5 w-5 text-[#2B5B84]" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 max-w-md">
                          <p className="font-bold text-[#F0F4F8] truncate hover:text-[#5FA8D3] transition-colors">
                            <Link href={`/admin/noticias/${item.id}`}>
                              {item.title}
                            </Link>
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-[#94A3B8] font-mono">
                              /noticias/{item.slug}
                            </span>
                            {item.is_featured && (
                              <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold bg-[#5FA8D3]/20 text-[#5FA8D3] border border-[#5FA8D3]/40">
                                <Sparkles className="h-2.5 w-2.5" /> Destacada
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-xs hidden md:table-cell">
                      {item.published_at ? formatDateShort(item.published_at) : "Borrador sin publicar"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <AdminNewsActions
                        id={item.id}
                        slug={item.slug}
                        title={item.title}
                        status={item.status}
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
