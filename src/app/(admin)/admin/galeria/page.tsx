import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Plus, Images, Trophy, Calendar } from "lucide-react"
import { connection } from "next/server"

import { getAdminAlbums } from "@/lib/queries/galleryQueries"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"
import { AdminAlbumActions } from "@/components/admin/AdminAlbumActions"
import { formatDateShort } from "@/lib/utils"

export const metadata: Metadata = { title: "Gestión de Galería — Admin" }

export default async function AdminGaleriaPage() {
  await connection()
  const albums = await getAdminAlbums()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F0F4F8] tracking-tight">
            Galería Fotográfica & Álbumes
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            {albums.length} {albums.length === 1 ? "álbum registrado" : "álbumes registrados"} para torneos y eventos oficiales
          </p>
        </div>
        <Link href="/admin/galeria/nuevo">
          <Button className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-black shadow-md shadow-[#5FA8D3]/20">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Álbum
          </Button>
        </Link>
      </div>

      {albums.length === 0 ? (
        <EmptyState
          icon={Images}
          title="No hay álbumes creados"
          description="Crea el primer álbum fotográfico para registrar las fotos de un torneo oficial o premiación."
          action={
            <Link href="/admin/galeria/nuevo">
              <Button className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-bold">
                <Plus className="h-4 w-4 mr-2" /> Crear Álbum
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
                  <th scope="col" className="px-6 py-4">Álbum</th>
                  <th scope="col" className="px-6 py-4 text-center">Fotos</th>
                  <th scope="col" className="px-6 py-4">Estado</th>
                  <th scope="col" className="px-6 py-4 hidden md:table-cell">Fecha</th>
                  <th scope="col" className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B5B84]/40">
                {albums.map((album) => (
                  <tr
                    key={album.id}
                    className="hover:bg-[#0B0F19]/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 rounded-lg bg-[#0B0F19] overflow-hidden border border-[#2B5B84] shrink-0">
                          {album.cover_image_url ? (
                            <Image
                              src={album.cover_image_url}
                              alt={album.title}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[#5FA8D3]">
                              <Images className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/galeria/${album.id}`}
                            className="font-bold text-[#F0F4F8] hover:text-[#5FA8D3] transition-colors truncate block"
                          >
                            {album.title}
                          </Link>
                          {album.tournament && (
                            <span className="inline-flex items-center gap-1 text-xs text-[#5FA8D3] font-medium mt-0.5">
                              <Trophy className="h-3 w-3" />
                              {album.tournament.title}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#0B0F19] border border-[#2B5B84] text-[#F0F4F8]">
                        <Images className="h-3.5 w-3.5 text-[#5FA8D3]" />
                        {album.image_count ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {album.is_published ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          Borrador
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-xs">
                      {formatDateShort(album.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <AdminAlbumActions
                        id={album.id}
                        slug={album.slug}
                        title={album.title}
                        isPublished={album.is_published}
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