import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Trophy, Calendar, Images } from "lucide-react"
import { getAlbumBySlug } from "@/lib/queries/galleryQueries"
import { GalleryLightbox } from "@/components/public/GalleryLightbox"
import { formatDateShort } from "@/lib/utils"

export const instant = false

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const album = await getAlbumBySlug(slug)

  if (!album) {
    return { title: "Álbum no encontrado — WALFA CHESS" }
  }

  return {
    title: `${album.title} — Galería WALFA CHESS`,
    description: album.description || `Fotografías oficiales del álbum ${album.title} de la Fundación WALFA CHESS.`,
    openGraph: album.cover_image_url
      ? {
          images: [{ url: album.cover_image_url }],
        }
      : undefined,
  }
}

export default async function AlbumDetailPage({ params }: Props) {
  const { slug } = await params
  const album = await getAlbumBySlug(slug)

  if (!album) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Botón Volver */}
      <div className="mb-8">
        <Link
          href="/galeria"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#5FA8D3] hover:text-[#4A96C2] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a todos los álbumes
        </Link>
      </div>

      {/* Encabezado del Álbum */}
      <div className="mb-12 pb-8 border-b border-[#2B5B84]/50">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#2B5B84] bg-[#132238] px-3.5 py-1 text-xs font-bold text-[#5FA8D3] uppercase tracking-wider">
            <Images className="h-3.5 w-3.5" />
            {album.images?.length ?? 0} Fotografías
          </div>

          {album.tournament && (
            <Link
              href={`/torneos/${album.tournament.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#2B5B84] bg-[#0B0F19] px-3.5 py-1 text-xs font-bold text-[#5FA8D3] hover:border-[#5FA8D3] transition-colors"
            >
              <Trophy className="h-3.5 w-3.5 text-[#5FA8D3]" />
              <span>Torneo: {album.tournament.title}</span>
            </Link>
          )}

          <div className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] ml-auto">
            <Calendar className="h-3.5 w-3.5 text-[#5FA8D3]" />
            <span>Publicado: {formatDateShort(album.created_at)}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#F0F4F8] tracking-tight">
          {album.title}
        </h1>

        {album.description && (
          <p className="mt-4 text-base sm:text-lg text-[#94A3B8] max-w-4xl leading-relaxed whitespace-pre-line">
            {album.description}
          </p>
        )}
      </div>

      {/* Visor Interactivo y Cuadrícula de Fotografías */}
      <GalleryLightbox
        images={album.images || []}
        albumTitle={album.title}
      />
    </div>
  )
}
