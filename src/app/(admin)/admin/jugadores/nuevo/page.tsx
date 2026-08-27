import type { Metadata } from "next"
import { PlayerForm } from "@/components/admin/PlayerForm"
import { ArrowLeft, UserPlus } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = { title: "Registrar Jugador — Admin" }

export default function NuevoJugadorPage() {
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
            <UserPlus className="h-6 w-6 text-[#5FA8D3]" />
            <h1 className="text-2xl sm:text-3xl font-black text-[#F0F4F8] tracking-tight">
              Registrar Nuevo Jugador
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Completa la ficha del ajedrecista para el registro oficial y ranking.
          </p>
        </div>
      </div>

      <PlayerForm isEditing={false} />
    </div>
  )
}
