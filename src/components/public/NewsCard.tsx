import Link from "next/link"
import Image from "next/image"
import { Calendar, User, Newspaper, Sparkles, ArrowRight, Trophy } from "lucide-react"
import { formatDateShort } from "@/lib/utils"
import type { News } from "@/types"

interface NewsCardProps {
  news: News
  featured?: boolean
  variant?: "default" | "compact" | "featured"
}

export function NewsCard({ news, featured = false, variant = "default" }: NewsCardProps) {
  // Modo compacto horizontal (como en la maqueta de la Home)
  if (variant === "compact") {
    return (
      <article className="group flex items-center gap-3.5 py-2">
        <Link
          href={`/noticias/${news.slug}`}
          className="relative h-16 w-24 sm:h-20 sm:w-28 rounded-lg overflow-hidden shrink-0 bg-slate-900 shadow-sm"
        >
          {news.cover_image_url ? (
            <Image
              src={news.cover_image_url}
              alt={news.title}
              fill
              sizes="112px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-400">
              <Newspaper className="h-6 w-6 opacity-60" />
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#1D64F2] transition-colors line-clamp-2 leading-snug">
            <Link href={`/noticias/${news.slug}`}>
              {news.title}
            </Link>
          </h4>
          {news.published_at && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1.5">
              <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
              <span>{formatDateShort(news.published_at)}</span>
            </div>
          )}
        </div>
      </article>
    )
  }

  // Modo destacado
  if (featured || variant === "featured") {
    return (
      <div className="group relative flex flex-col lg:flex-row rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <div className="relative aspect-[16/9] lg:aspect-auto lg:w-3/5 min-h-[260px] bg-slate-900 overflow-hidden">
          {news.cover_image_url ? (
            <Image
              src={news.cover_image_url}
              alt={news.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-400">
              <Newspaper className="h-16 w-16 opacity-50" />
            </div>
          )}

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1D64F2] text-white px-3 py-1 text-xs font-bold tracking-wide shadow-md">
              <Sparkles className="h-3.5 w-3.5" /> DESTACADA
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
          <div>
            <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
              {news.published_at && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{formatDateShort(news.published_at)}</span>
                </div>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-[#1D64F2] transition-colors leading-tight">
              <Link href={`/noticias/${news.slug}`}>{news.title}</Link>
            </h2>

            {news.excerpt && (
              <p className="mt-3 text-sm text-slate-600 line-clamp-3 leading-relaxed">
                {news.excerpt}
              </p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              href={`/noticias/${news.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D64F2] hover:text-[#1554cf] transition-colors"
            >
              Leer artículo completo
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Modo tarjeta estándar
  return (
    <div className="group flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
        {news.cover_image_url ? (
          <Image
            src={news.cover_image_url}
            alt={news.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-400">
            <Newspaper className="h-10 w-10 opacity-50" />
          </div>
        )}

        {news.is_featured && (
          <div className="absolute top-2.5 left-2.5">
            <span className="inline-flex items-center gap-1 rounded bg-[#1D64F2] text-white px-2 py-0.5 text-[10px] font-bold tracking-wider shadow">
              <Sparkles className="h-3 w-3" /> DESTACADA
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {news.published_at && (
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-2">
            <Calendar className="h-3 w-3 text-slate-400" />
            <span>{formatDateShort(news.published_at)}</span>
          </div>
        )}

        <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1D64F2] transition-colors line-clamp-2">
          <Link href={`/noticias/${news.slug}`}>{news.title}</Link>
        </h3>

        {news.excerpt && (
          <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed flex-1">
            {news.excerpt}
          </p>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <Link
            href={`/noticias/${news.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1D64F2] hover:text-[#1554cf] transition-colors"
          >
            Leer más
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
