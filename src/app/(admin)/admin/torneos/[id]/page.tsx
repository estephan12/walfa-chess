import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { connection } from "next/server"
import { getTournamentById } from "@/lib/queries/tournamentQueries"
import { TournamentForm } from "@/components/admin/TournamentForm"

export const instant = false

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const tournament = await getTournamentById(id)
  return {
    title: tournament ? `Editar ${tournament.title} | Admin` : "Torneo no encontrado",
  }
}

export default async function EditarTorneoPage({ params }: Props) {
  await connection()
  const { id } = await params
  const tournament = await getTournamentById(id)

  if (!tournament) {
    notFound()
  }

  return (
    <div className="py-2">
      <TournamentForm initialData={tournament} isEditing={true} />
    </div>
  )
}