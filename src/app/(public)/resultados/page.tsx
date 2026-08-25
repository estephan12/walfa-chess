import type { Metadata } from "next"
import { EmptyState } from "@/components/shared/EmptyState"
import { ListOrdered } from "lucide-react"

export const metadata: Metadata = {
  title: "Resultados",
  description: "Resultados oficiales y tablas de posiciones de los torneos de WALFA CHESS.",
}

export default function ResultadosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-[#F0F4F8]">Resultados de Torneos</h1>
        <p className="mt-2 text-base text-[#94A3B8]">
          Tablas de puntuación, podios y desempeño por categoría
        </p>
      </div>
      <EmptyState
        icon={ListOrdered}
        title="No hay resultados registrados aún"
        description="Los resultados oficiales de los torneos finalizados se publicarán en esta sección."
      />
    </div>
  )
}
