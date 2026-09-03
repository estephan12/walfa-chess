import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Images, Trophy, Calendar, ArrowRight } from "lucide-react"
import { getPublicAlbums } from "@/lib/queries/galleryQueries"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageLoadingSpinner } from "@/components/shared/LoadingSpinner"
import { formatDateShort } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Galería Fotográfica Oficial — WALFA-CHESS",
  description: "Momentos destacados, premiaciones y partidas de los torneos oficiales organizados por la Fundación WALFA-CHESS.",
}

async function AlbumsList() {
  const albums = await getPublicAlbums()

  if (albums.length === 0) {
    return (
      <EmptyState
        icon={Images}
        title="Álbumes en preparación"
        description="Las coberturas fotográficas de los torneos se publicarán aquí próximamente."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {albums.map((album) => (
        <Link
          key={album.id}
          href={`/galeria/${album.slug}`}
          className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-md hover:border-[#1D64F2]/50 shadow-sm"
        >
          {/* Portada del Álbum */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
            {album.cover_image_url ? (
              <Image
                src={album.cover_image_url}
                alt={album.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <Images className="h-12 w-12 opacity-50" />
              </div>
            )}

            {/* Badge de Cantidad de Fotos */}
            <div className="absolute bottom-3 right-3 rounded-full bg-[#0A1931]/90 border border-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm shadow-md flex items-center gap-1.5">
              <Images className="h-3.5 w-3.5" />
              <span>{album.image_count ?? 0} fotos</span>
            </div>
          </div>

          {/* Contenido del Álbum */}
          <div className="flex flex-1 flex-col justify-between p-6">
            <div>
              {/* Badge de Torneo si existe */}
              {album.tournament && (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D64F2] uppercase tracking-wider mb-2">
                  <Trophy className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{album.tournament.title}</span>
                </div>
              )}

              <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#1D64F2] transition-colors line-clamp-2 leading-snug">
                {album.title}
              </h2>

              {album.description && (
                <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {album.description}
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>{formatDateShort(album.created_at)}</span>
              </div>
              <span className="font-bold text-[#1D64F2] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Ver álbum <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function GaleriaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      {/* Encabezado */}
      <div className="mb-12 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-[#1D64F2] uppercase tracking-wider mb-3">
          <Images className="h-3.5 w-3.5" />
          Memoria Visual
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Galería Fotográfica
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
          Explora los álbumes oficiales de nuestros torneos, premiaciones, ceremonias y jornadas de competencia ajedrecística.
        </p>
      </div>

      <Suspense fallback={<PageLoadingSpinner />}>
        <AlbumsList />
      </Suspense>
    </div>
  )
}
