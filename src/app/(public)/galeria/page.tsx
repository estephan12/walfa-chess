import type { Metadata } from "next"
import { EmptyState } from "@/components/shared/EmptyState"
import { Images } from "lucide-react"

export const metadata: Metadata = {
  title: "Galería",
  description: "Galería de fotos de los eventos y torneos de WALFA CHESS.",
}

export default function GaleriaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-[#F0F4F8]">Galería Multimedia</h1>
        <p className="mt-2 text-base text-[#94A3B8]">
          Momentos destacados, premiaciones y partidas de nuestros torneos oficiales
        </p>
      </div>
      <EmptyState
        icon={Images}
        title="Álbumes en preparación"
        description="Las fotografías y coberturas audiovisuales de los próximos eventos se cargarán aquí."
      />
    </div>
  )
}
