import type { Metadata } from "next"
import { Suspense } from "react"
import { cacheLife } from "next/cache"
import { PageLoadingSpinner } from "@/components/shared/LoadingSpinner"
import { EmptyState } from "@/components/shared/EmptyState"
import { Newspaper } from "lucide-react"

export const metadata: Metadata = {
  title: "Noticias",
  description: "Últimas noticias y coberturas oficiales de la Fundación WALFA CHESS.",
}

async function NewsList() {
  "use cache"
  cacheLife("minutes")

  return (
    <EmptyState
      icon={Newspaper}
      title="No hay noticias publicadas"
      description="Próximamente publicaremos noticias sobre los torneos, premiaciones y la comunidad de ajedrez."
    />
  )
}

export default function NoticiasPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-[#F0F4F8]">Noticias & Cobertura</h1>
        <p className="mt-2 text-base text-[#94A3B8]">
          Actualidad, entrevistas y crónicas de los torneos de ajedrez
        </p>
      </div>
      <Suspense fallback={<PageLoadingSpinner />}>
        <NewsList />
      </Suspense>
    </div>
  )
}
