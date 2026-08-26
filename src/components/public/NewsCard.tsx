import Link from "next/link"
import Image from "next/image"
import { Calendar, User, Newspaper, Sparkles, ArrowRight, Trophy } from "lucide-react"
import { formatDateShort } from "@/lib/utils"
import type { News } from "@/types"

interface NewsCardProps {
  news: News
  featured?: boolean
}

export function NewsCard({ news, featured = false }: NewsCardProps) {
  if (featured) {
    return (
      <div className="group relative flex flex-col lg:flex-row rounded-3xl border border-[#2B5B84] bg-gradient-to-br from-[#132238] to-[#0B0F19] overflow-hidden shadow-2xl hover:border-[#5FA8D3] transition-all duration-300">
        {/* Portada grande */}
        <div className="relative aspect-[16/9] lg:aspect-auto lg:w-3/5 min-h-[280px] sm:min-h-[340px] bg-[#0B0F19] overflow-hidden border-b lg:border-b-0 lg:border-r border-[#2B5B84]/60">
          {news.cover_image_url ? (
            <Image
              src={news.cover_image_url}
              alt={news.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#0B0F19]">
              <Newspaper className="h-16 w-16 text-[#2B5B84] opacity-50" />
            </div>
          )}

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5FA8D3] text-[#0B0F19] px-3 py-1 text-xs font-black tracking-wide shadow-md">
              <Sparkles className="h-3.5 w-3.5" /> DESTACADA
            </span>
            {news.tournament && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#0B0F19]/80 backdrop-blur border border-[#2B5B84] px-2.5 py-1 text-xs font-medium text-[#F0F4F8]">
                <Trophy className="h-3 w-3 text-[#5FA8D3]" /> {news.tournament.title}
              </span>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="flex flex-1 flex-col justify-between p-6 sm:p-10">
          <div>
            <div className="flex items-center gap-4 text-xs text-[#94A3B8] mb-3">
              {news.published_at && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#5FA8D3]" />
                  <span>{formatDateShort(news.published_at)}</span>
                </div>
              )}
              {news.author?.full_name && (
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#5FA8D3]" />
                  <span>{news.author.full_name}</span>
                </div>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#F0F4F8] group-hover:text-[#5FA8D3] transition-colors leading-tight">
              <Link href={`/noticias/${news.slug}`}>{news.title}</Link>
            </h2>

            {news.excerpt && (
              <p className="mt-4 text-sm sm:text-base text-[#94A3B8] line-clamp-3 leading-relaxed">
                {news.excerpt}
              </p>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-[#2B5B84]/40 flex items-center justify-between">
            <Link
              href={`/noticias/${news.slug}`}
              className="inline-flex items-center gap-2 text-sm font-black text-[#5FA8D3] hover:text-[#4A96C2] transition-colors group/link"
            >
              Leer artículo completo
              <ArrowRight className="h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex flex-col rounded-2xl border border-[#2B5B84] bg-[#132238] overflow-hidden shadow-xl hover:border-[#5FA8D3] transition-all duration-300 hover:-translate-y-1">
      {/* Portada estándar */}
      <div className="relative aspect-[16/9] w-full bg-[#0B0F19] overflow-hidden border-b border-[#2B5B84]/60">
        {news.cover_image_url ? (
          <Image
            src={news.cover_image_url}
            alt={news.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#0B0F19]">
            <Newspaper className="h-10 w-10 text-[#2B5B84] opacity-50" />
          </div>
        )}

        {news.is_featured && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#5FA8D3] text-[#0B0F19] px-2 py-0.5 text-[10px] font-black tracking-wider shadow">
              <Sparkles className="h-3 w-3" /> DESTACADA
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-[11px] text-[#94A3B8] mb-2.5">
          {news.published_at && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-[#5FA8D3]" />
              <span>{formatDateShort(news.published_at)}</span>
            </div>
          )}
          {news.tournament && (
            <div className="flex items-center gap-1 line-clamp-1 text-[#5FA8D3]">
              <Trophy className="h-3 w-3 shrink-0" />
              <span className="truncate">{news.tournament.title}</span>
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-[#F0F4F8] group-hover:text-[#5FA8D3] transition-colors line-clamp-2">
          <Link href={`/noticias/${news.slug}`}>{news.title}</Link>
        </h3>

        {news.excerpt && (
          <p className="mt-2 text-xs text-[#94A3B8] line-clamp-2 leading-relaxed flex-1">
            {news.excerpt}
          </p>
        )}

        <div className="mt-5 pt-4 border-t border-[#2B5B84]/40 flex items-center justify-between">
          <Link
            href={`/noticias/${news.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-black text-[#5FA8D3] hover:text-[#4A96C2] transition-colors group/link"
          >
            Leer más
            <ArrowRight className="h-3.5 w-3.5 transform group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}
