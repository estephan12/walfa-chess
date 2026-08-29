import type { Metadata } from "next"
import { connection } from "next/server"
import { getAllTournamentsAdmin } from "@/lib/queries/tournamentQueries"
import { AlbumForm } from "@/components/admin/AlbumForm"

export const metadata: Metadata = {
  title: "Nuevo Álbum — Admin Galería",
}

export default async function NuevoAlbumPage() {
  await connection()
  const tournaments = await getAllTournamentsAdmin()

  const formattedTournaments = tournaments.map((t) => ({
    id: t.id,
    title: t.title,
  }))

  return (
    <div className="space-y-6">
      <AlbumForm tournaments={formattedTournaments} />
    </div>
  )
}
