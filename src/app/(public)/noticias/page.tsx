import type { Metadata } from "next"
import { Suspense } from "react"
import { Newspaper } from "lucide-react"
import { getPublicNews } from "@/lib/queries/newsQueries"
import { NewsCard } from "@/components/public/NewsCard"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageLoadingSpinner } from "@/components/shared/LoadingSpinner"

export const metadata: Metadata = {
  title: "Noticias & Cobertura — WALFA-CHESS",
  description:
    "Últimas noticias, resultados, crónicas y cobertura oficial de los torneos de ajedrez organizados por WALFA-CHESS.",
}

async function NewsList() {
  const news = await getPublicNews()

  if (news.length === 0) {
    return (
      <EmptyState
        icon={Newspaper}
        title="No hay noticias publicadas"
        description="Próximamente publicaremos noticias sobre los torneos, premiaciones y la comunidad de ajedrez de WALFA-CHESS."
      />
    )
  }

  // Identificar noticia destacada (la primera con is_featured o la más reciente)
  const featuredIndex = news.findIndex((n) => n.is_featured)
  const featuredNews = featuredIndex !== -1 ? news[featuredIndex] : news[0]
  const otherNews = news.filter((n) => n.id !== featuredNews.id)

  return (
    <div className="space-y-12">
      {/* Noticia destacada principal */}
      <section>
        <NewsCard news={featuredNews} featured={true} />
      </section>

      {/* Rejilla de noticias recientes */}
      {otherNews.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Más Artículos y Crónicas
            </h2>
            <span className="text-xs text-slate-500">
              {otherNews.length} {otherNews.length === 1 ? "artículo" : "artículos"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {otherNews.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default function NoticiasPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Noticias & Cobertura
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Actualidad, entrevistas, análisis y crónicas de los torneos de la comunidad de ajedrez WALFA-CHESS.
        </p>
      </div>

      <Suspense fallback={<PageLoadingSpinner />}>
        <NewsList />
      </Suspense>
    </div>
  )
}
