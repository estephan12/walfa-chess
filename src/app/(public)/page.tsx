import { Suspense } from "react"
import { cacheLife } from "next/cache"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Trophy, Calendar, Sparkles, ArrowRight, ShieldCheck, Award } from "lucide-react"

import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants"
import { getUpcomingTournaments } from "@/lib/queries/tournamentQueries"
import { getPublicNews } from "@/lib/queries/newsQueries"
import { TournamentCard } from "@/components/public/TournamentCard"
import { NewsCard } from "@/components/public/NewsCard"
import { PageLoadingSpinner } from "@/components/shared/LoadingSpinner"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: `${SITE_NAME} — Fundación de Ajedrez en República Dominicana`,
  description: SITE_DESCRIPTION,
}

// Hero estático de alto impacto con el escudo oficial
function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#0B0F19] py-20 sm:py-28 lg:py-32"
      aria-labelledby="hero-heading"
    >
      {/* Resplandor ambiental y patrón sutil */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5FA8D3]/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-conic-gradient(#5FA8D3 0% 25%, transparent 0% 50%)`,
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Escudo / Logo Oficial */}
        <div className="relative mb-8 group">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#2B5B84] via-[#5FA8D3] to-[#2B5B84] opacity-50 blur-lg group-hover:opacity-75 transition duration-500" />
          <div className="relative h-32 w-32 sm:h-40 sm:w-40 overflow-hidden rounded-full border-2 border-[#2B5B84] bg-[#132238] shadow-2xl p-1">
            <div className="relative h-full w-full rounded-full overflow-hidden">
              <Image
                src="/images/logo.jpg"
                alt="Escudo Oficial Fundación WALFA-CHESS"
                fill
                sizes="(max-width: 640px) 128px, 160px"
                className="object-cover scale-105"
                priority
              />
            </div>
          </div>
        </div>

        {/* Badge de Localización / Oficial */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#2B5B84] bg-[#132238] px-4 py-1.5 mb-6 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#5FA8D3] animate-pulse" aria-hidden="true" />
          <span className="text-xs font-bold text-[#F0F4F8] tracking-widest uppercase">
            República Dominicana
          </span>
        </div>

        {/* Título Principal */}
        <h1
          id="hero-heading"
          className="text-4xl font-black tracking-tight text-[#F0F4F8] sm:text-6xl lg:text-7xl max-w-4xl"
        >
          Fundación de Ajedrez{" "}
          <span className="text-[#5FA8D3] block sm:inline">WALFA-CHESS</span>
        </h1>

        {/* Descripción */}
        <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-[#94A3B8] leading-relaxed">
          Promoviendo la excelencia, disciplina y competitividad del ajedrez dominicano. Consulta torneos oficiales, clasificaciones y noticias en tiempo real.
        </p>

        {/* Botones de Acción */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link href="/inscripciones" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-black text-base px-8 py-3.5 shadow-lg shadow-[#5FA8D3]/20"
            >
              Inscríbete Ahora
            </Button>
          </Link>
          <Link href="/torneos" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto bg-[#132238] border border-[#2B5B84] text-[#F0F4F8] hover:bg-[#1a2d4a] hover:border-[#5FA8D3] text-base px-8 py-3.5 font-bold"
            >
              Ver Torneos
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-[#2B5B84]/40 max-w-3xl w-full text-center">
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#94A3B8]">
            <ShieldCheck className="h-4 w-4 text-[#5FA8D3] shrink-0" />
            <span>Torneos Validados</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#94A3B8]">
            <Award className="h-4 w-4 text-[#5FA8D3] shrink-0" />
            <span>Premios & Reconocimientos</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#94A3B8]">
            <Sparkles className="h-4 w-4 text-[#5FA8D3] shrink-0" />
            <span>Comunidad Activa</span>
          </div>
        </div>

      </div>
    </section>
  )
}

// Sección de Torneos Próximos
async function UpcomingTournamentsSection() {
  "use cache"
  cacheLife("minutes")

  const tournaments = await getUpcomingTournaments(3)

  return (
    <section
      className="py-20 bg-[#0B0F19] border-t border-[#2B5B84]/40"
      aria-labelledby="tournaments-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#5FA8D3] uppercase tracking-wider mb-2">
              <Trophy className="h-4 w-4" />
              <span>Competencias Oficiales</span>
            </div>
            <h2
              id="tournaments-heading"
              className="text-3xl font-extrabold tracking-tight text-[#F0F4F8] sm:text-4xl"
            >
              Próximos Torneos
            </h2>
            <p className="mt-2 text-base text-[#94A3B8]">
              Participa en los eventos oficiales organizados por WALFA-CHESS.
            </p>
          </div>
          <Link
            href="/torneos"
            className="mt-4 md:mt-0 inline-flex items-center gap-1 text-sm font-bold text-[#5FA8D3] hover:underline"
          >
            Ver calendario completo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {tournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-10 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B0F19] border border-[#2B5B84]">
              <Calendar className="h-7 w-7 text-[#5FA8D3]" />
            </div>
            <h3 className="text-xl font-bold text-[#F0F4F8]">Próximas convocatorias en preparación</h3>
            <p className="mt-2 text-sm text-[#94A3B8] max-w-md mx-auto">
              Estamos programando las fechas para el siguiente torneo nacional. Mantente atento a nuestras publicaciones.
            </p>
            <div className="mt-6">
              <Link href="/inscripciones">
                <Button className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-bold">
                  Preinscribirme
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// Estadísticas de la Fundación
function StatsSection() {
  const stats = [
    { label: "Torneos Realizados", value: "10+" },
    { label: "Jugadores Registrados", value: "150+" },
    { label: "Categorías Oficiales", value: "6+" },
    { label: "Provincias Conectadas", value: "8+" },
  ]

  return (
    <section className="bg-[#132238] border-y border-[#2B5B84] py-16" aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">Estadísticas de WALFA-CHESS</h2>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-xl bg-[#0B0F19]/40 border border-[#2B5B84]/50"
            >
              <dt className="text-xs sm:text-sm font-medium text-[#94A3B8]">{stat.label}</dt>
              <dd className="mt-2 text-3xl sm:text-5xl font-black text-[#5FA8D3] tracking-tight">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

// Sección de Noticias Recientes
async function RecentNewsSection() {
  const news = await getPublicNews(3)

  return (
    <section
      className="py-20 bg-[#0B0F19]"
      aria-labelledby="news-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2
              id="news-heading"
              className="text-3xl font-extrabold tracking-tight text-[#F0F4F8] sm:text-4xl"
            >
              Últimas Noticias & Novedades
            </h2>
            <p className="mt-2 text-base text-[#94A3B8]">
              Entérate de las actividades, premiaciones y crónicas del ajedrez dominicano.
            </p>
          </div>
          <Link
            href="/noticias"
            className="text-sm font-bold text-[#5FA8D3] hover:underline hidden sm:flex items-center gap-1"
            aria-label="Ver todas las noticias"
          >
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-10 text-center shadow-xl">
            <p className="text-sm text-[#94A3B8]">
              Las noticias y coberturas oficiales aparecerán aquí tras ser publicadas en el panel administrativo.
            </p>
            <div className="mt-4">
              <Link
                href="/noticias"
                className="inline-block text-sm font-bold text-[#5FA8D3] hover:underline"
              >
                Explorar archivo de artículos →
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<PageLoadingSpinner />}>
        <UpcomingTournamentsSection />
      </Suspense>
      <StatsSection />
      <Suspense fallback={<PageLoadingSpinner />}>
        <RecentNewsSection />
      </Suspense>
    </>
  )
}
