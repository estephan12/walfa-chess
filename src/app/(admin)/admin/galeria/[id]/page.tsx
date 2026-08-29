import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { connection } from "next/server"
import { getAdminAlbumById } from "@/lib/queries/galleryQueries"
import { getAllTournamentsAdmin } from "@/lib/queries/tournamentQueries"
import { AlbumForm } from "@/components/admin/AlbumForm"
import { AlbumPhotoManager } from "@/components/admin/AlbumPhotoManager"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const album = await getAdminAlbumById(id)
  return {
    title: album ? `Gestionar: ${album.title} — Admin` : "Álbum no encontrado",
  }
}

export default async function AdminAlbumDetailPage({ params }: Props) {
  await connection()
  const { id } = await params

  const [album, tournaments] = await Promise.all([
    getAdminAlbumById(id),
    getAllTournamentsAdmin(),
  ])

  if (!album) {
    notFound()
  }

  const formattedTournaments = tournaments.map((t) => ({
    id: t.id,
    title: t.title,
  }))

  return (
    <div className="space-y-12 max-w-5xl">
      {/* Formulario de Datos del Álbum */}
      <AlbumForm
        initialData={album}
        isEditing={true}
        tournaments={formattedTournaments}
      />

      {/* Gestor de Fotografías y Carga Múltiple */}
      <div className="pt-8 border-t border-[#2B5B84]/50">
        <AlbumPhotoManager
          albumId={album.id}
          coverImageUrl={album.cover_image_url}
          initialImages={album.images || []}
        />
      </div>
    </div>
  )
}
