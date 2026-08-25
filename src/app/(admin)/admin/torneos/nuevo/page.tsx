import type { Metadata } from "next"
import { connection } from "next/server"
import { TournamentForm } from "@/components/admin/TournamentForm"

export const metadata: Metadata = {
  title: "Nuevo Torneo | Admin WALFA CHESS",
}

export default async function NuevoTorneoPage() {
  await connection()

  return (
    <div className="py-2">
      <TournamentForm isEditing={false} />
    </div>
  )
}