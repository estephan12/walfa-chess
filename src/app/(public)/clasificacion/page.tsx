import type { Metadata } from "next"
import { EmptyState } from "@/components/shared/EmptyState"
import { Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Clasificación",
  description: "Ranking oficial de jugadores de la Fundación WALFA CHESS.",
}

export default function ClasificacionPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-[#F0F4F8]">Clasificación & Ranking</h1>
        <p className="mt-2 text-base text-[#94A3B8]">
          Tabla de posiciones y rendimiento de los jugadores federados y locales
        </p>
      </div>
      <EmptyState
        icon={Users}
        title="Clasificación en procesamiento"
        description="El ranking se actualizará automáticamente con los resultados de los torneos oficiales."
      />
    </div>
  )
}
