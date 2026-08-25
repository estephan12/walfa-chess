import type { Metadata } from "next"
import { cacheLife } from "next/cache"
import { Suspense } from "react"
import { PageLoadingSpinner } from "@/components/shared/LoadingSpinner"
import { EmptyState } from "@/components/shared/EmptyState"
import { Trophy } from "lucide-react"

export const metadata: Metadata = {
  title: "Torneos",
  description: "Todos los torneos de WALFA CHESS — próximos, en curso y finalizados.",
}

async function TournamentsList() {
  "use cache"
  cacheLife("minutes")

  // TODO: traer datos de Supabase
  return (
    <EmptyState
      icon={Trophy}
      title="No hay torneos disponibles"
      description="Próximamente se publicarán las convocatorias de torneos oficiales de WALFA CHESS."
    />
  )
}

export default function TorneosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-[#F0F4F8]">Torneos Oficiales</h1>
        <p className="mt-2 text-base text-[#94A3B8]">
          Calendario de competencias, bases y registros de WALFA CHESS en República Dominicana
        </p>
      </div>
      <Suspense fallback={<PageLoadingSpinner />}>
        <TournamentsList />
      </Suspense>
    </div>
  )
}
