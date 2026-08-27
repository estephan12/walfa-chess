import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { connection } from "next/server"
import Link from "next/link"
import { ArrowLeft, UserCheck } from "lucide-react"
import { getPlayerById } from "@/lib/queries/playerQueries"
import { PlayerForm } from "@/components/admin/PlayerForm"

export const instant = false

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const player = await getPlayerById(id)
  return {
    title: player ? `Editar: ${player.full_name}` : "Editar Jugador",
  }
}

export default async function EditarJugadorPage({ params }: Props) {
  await connection()
  const { id } = await params
  const player = await getPlayerById(id)

  if (!player) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/jugadores"
          className="p-2 rounded-xl border border-[#2B5B84] text-[#94A3B8] hover:text-[#F0F4F8] hover:bg-[#132238] transition-colors"
          title="Volver a Jugadores"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-[#5FA8D3]" />
            <h1 className="text-2xl sm:text-3xl font-black text-[#F0F4F8] tracking-tight">
              Editar Jugador
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Modificando la ficha de <strong className="text-[#F0F4F8]">{player.full_name}</strong>
          </p>
        </div>
      </div>

      <PlayerForm initialData={player} isEditing={true} />
    </div>
  )
}