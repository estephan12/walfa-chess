import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Images, Trophy, Calendar, ArrowRight } from "lucide-react"
import { getPublicAlbums } from "@/lib/queries/galleryQueries"
import { EmptyState } from "@/components/shared/EmptyState"
import { formatDateShort } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Galería Fotográfica Oficial — WALFA CHESS",
  description: "Momentos destacados, premiaciones y partidas de los torneos oficiales organizados por la Fundación WALFA CHESS.",
}

export default async function GaleriaPage() {
  const albums = await getPublicAlbums()

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      {/* Encabezado */}
      <div className="mb-12 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#2B5B84] bg-[#132238] px-3.5 py-1 text-xs font-bold text-[#5FA8D3] uppercase tracking-wider mb-3">
          <Images className="h-3.5 w-3.5" />
          Memoria Visual
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#F0F4F8] tracking-tight">
          Galería Fotográfica
        </h1>
        <p className="mt-3 text-base sm:text-lg text-[#94A3B8] max-w-3xl">
          Explora los álbumes oficiales de nuestros torneos, premiaciones, ceremonias y jornadas de competencia ajedrecística.
        </p>
      </div>

      {albums.length === 0 ? (
        <EmptyState
          icon={Images}
          title="Álbumes en preparación"
          description="Las coberturas fotográficas de los torneos se publicarán aquí próximamente."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album) => (
            <Link
              key={album.id}
              href={`/galeria/${album.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#2B5B84] bg-[#132238] transition-all duration-300 hover:border-[#5FA8D3] hover:shadow-xl hover:shadow-[#5FA8D3]/10"
            >
              {/* Portada del Álbum */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-[#0B0F19]">
                {album.cover_image_url ? (
                  <Image
                    src={album.cover_image_url}
                    alt={album.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#5FA8D3]">
                    <Images className="h-12 w-12 opacity-50" />
                  </div>
                )}

                {/* Badge de Cantidad de Fotos */}
                <div className="absolute bottom-3 right-3 rounded-full bg-[#0B0F19]/90 border border-[#2B5B84] px-3 py-1 text-xs font-black text-[#5FA8D3] backdrop-blur-sm shadow-md flex items-center gap-1.5">
                  <Images className="h-3.5 w-3.5" />
                  <span>{album.image_count ?? 0} fotos</span>
                </div>
              </div>

              {/* Contenido del Álbum */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  {/* Badge de Torneo si existe */}
                  {album.tournament && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5FA8D3] uppercase tracking-wider mb-2">
                      <Trophy className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{album.tournament.title}</span>
                    </div>
                  )}

                  <h2 className="text-xl font-bold text-[#F0F4F8] group-hover:text-[#5FA8D3] transition-colors line-clamp-2">
                    {album.title}
                  </h2>

                  {album.description && (
                    <p className="mt-2 text-sm text-[#94A3B8] line-clamp-2 leading-relaxed">
                      {album.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#2B5B84]/50 pt-4 text-xs text-[#94A3B8]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#5FA8D3]" />
                    <span>{formatDateShort(album.created_at)}</span>
                  </div>
                  <span className="font-bold text-[#5FA8D3] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Ver álbum <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
