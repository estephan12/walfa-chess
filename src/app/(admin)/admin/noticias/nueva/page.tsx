import type { Metadata } from "next"
import { connection } from "next/server"
import { getAllTournamentsAdmin } from "@/lib/queries/tournamentQueries"
import { NewsForm } from "@/components/admin/NewsForm"

export const metadata: Metadata = { title: "Nueva Noticia — Admin" }

export default async function NuevaNoticiaPage() {
  await connection()
  const tournaments = await getAllTournamentsAdmin()

  const tournamentOptions = tournaments.map((t) => ({
    id: t.id,
    title: t.title,
  }))

  return (
    <div className="py-2">
      <NewsForm isEditing={false} tournaments={tournamentOptions} />
    </div>
  )
}