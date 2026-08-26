import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, User, ArrowLeft, Trophy, Share2 } from "lucide-react"
import DOMPurify from "isomorphic-dompurify"
import { getNewsBySlug } from "@/lib/queries/newsQueries"
import { formatDateShort } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export const instant = false

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const news = await getNewsBySlug(slug)

  if (!news) {
    return { title: "Noticia no encontrada — WALFA CHESS" }
  }

  return {
    title: news.meta_title || `${news.title} — WALFA CHESS`,
    description: news.meta_description || news.excerpt || undefined,
    openGraph: {
      title: news.meta_title || news.title,
      description: news.meta_description || news.excerpt || undefined,
      images: news.cover_image_url ? [{ url: news.cover_image_url }] : [],
    },
  }
}

export default async function NoticiaDetallePage({ params }: Props) {
  const { slug } = await params
  const news = await getNewsBySlug(slug)

  if (!news) {
    notFound()
  }

  const sanitizedContent = DOMPurify.sanitize(news.content)

  return (
    <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Botón de volver */}
      <div className="mb-8">
        <Link
          href="/noticias"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#94A3B8] hover:text-[#5FA8D3] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a todas las noticias
        </Link>
      </div>

      {/* Cabecera del artículo */}
      <header className="space-y-6">
        {/* Metadatos y etiquetas */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#94A3B8]">
          {news.published_at && (
            <div className="flex items-center gap-1.5 bg-[#132238] border border-[#2B5B84] px-3 py-1 rounded-full text-[#F0F4F8]">
              <Calendar className="h-3.5 w-3.5 text-[#5FA8D3]" />
              <span>{formatDateShort(news.published_at)}</span>
            </div>
          )}

          {news.author?.full_name && (
            <div className="flex items-center gap-1.5 bg-[#132238] border border-[#2B5B84] px-3 py-1 rounded-full text-[#F0F4F8]">
              <User className="h-3.5 w-3.5 text-[#5FA8D3]" />
              <span>{news.author.full_name}</span>
            </div>
          )}

          {news.tournament && (
            <Link
              href={`/torneos/${news.tournament.slug}`}
              className="flex items-center gap-1.5 bg-[#5FA8D3]/10 border border-[#5FA8D3]/30 px-3 py-1 rounded-full text-[#5FA8D3] font-bold hover:bg-[#5FA8D3]/20 transition-colors"
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>{news.tournament.title}</span>
            </Link>
          )}
        </div>

        {/* Título Principal */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F0F4F8] tracking-tight leading-tight">
          {news.title}
        </h1>

        {/* Resumen / Subtítulo */}
        {news.excerpt && (
          <p className="text-lg sm:text-xl text-[#94A3B8] leading-relaxed font-medium border-l-4 border-[#5FA8D3] pl-4 py-1">
            {news.excerpt}
          </p>
        )}
      </header>

      {/* Imagen de portada destacada */}
      {news.cover_image_url && (
        <div className="relative aspect-video sm:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-[#2B5B84] shadow-2xl my-8 bg-[#0B0F19]">
          <Image
            src={news.cover_image_url}
            alt={news.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      )}

      {/* Cuerpo del Artículo */}
      <div className="mt-10 rounded-2xl border border-[#2B5B84] bg-[#132238] p-6 sm:p-10 md:p-12 shadow-xl">
        <div
          className="prose prose-invert max-w-none text-[#F0F4F8] leading-relaxed space-y-4 text-base
            [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-[#F0F4F8] [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:border-b [&_h2]:border-[#2B5B84]/50 [&_h2]:pb-2
            [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#5FA8D3] [&_h3]:mt-6 [&_h3]:mb-3
            [&_p]:text-[#CBD5E1] [&_p]:leading-relaxed
            [&_a]:text-[#5FA8D3] [&_a]:font-bold [&_a]:underline hover:[&_a]:text-[#4A96C2]
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:text-[#CBD5E1]
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:text-[#CBD5E1]
            [&_blockquote]:border-l-4 [&_blockquote]:border-[#5FA8D3] [&_blockquote]:bg-[#0B0F19]/40 [&_blockquote]:p-4 [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_blockquote]:text-[#94A3B8]
            [&_img]:rounded-xl [&_img]:border [&_img]:border-[#2B5B84] [&_img]:my-6 [&_img]:shadow-lg"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div>

      {/* Pie del artículo */}
      <footer className="mt-12 pt-8 border-t border-[#2B5B84]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#132238] border border-[#2B5B84] flex items-center justify-center text-[#5FA8D3] font-bold text-sm">
            {news.author?.full_name ? news.author.full_name.charAt(0).toUpperCase() : "W"}
          </div>
          <div>
            <p className="text-xs text-[#94A3B8]">Publicado por</p>
            <p className="text-sm font-bold text-[#F0F4F8]">
              {news.author?.full_name || "Equipo WALFA CHESS"}
            </p>
          </div>
        </div>

        <Link href="/noticias">
          <Button
            variant="secondary"
            className="bg-[#132238] border border-[#2B5B84] text-[#F0F4F8] hover:bg-[#1a2d4a]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Más Noticias
          </Button>
        </Link>
      </footer>
    </article>
  )
}