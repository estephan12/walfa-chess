import { Suspense } from "react"
import { cacheLife } from "next/cache"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  Calendar,
  UserPlus,
  Users,
  Trophy,
  Award,
  Globe,
  MapPin,
  ArrowRight,
} from "lucide-react"

import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants"
import { getUpcomingTournaments } from "@/lib/queries/tournamentQueries"
import { getPublicNews } from "@/lib/queries/newsQueries"
import { TournamentCard } from "@/components/public/TournamentCard"
import { NewsCard } from "@/components/public/NewsCard"
import { PageLoadingSpinner } from "@/components/shared/LoadingSpinner"

export const metadata: Metadata = {
  title: `${SITE_NAME} — Fundación de Ajedrez`,
  description: SITE_DESCRIPTION,
}

// ─── 1. Hero Section ───
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0A1931] text-white">
      {/* Background Image / Chess Piece Graphic on Desktop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 h-full opacity-35 lg:opacity-90">
          <Image
            src="/mockup/hero-chess-hd.jpg"
            alt="Rey de Ajedrez Dorado WALFA-CHESS"
            fill
            priority
            className="object-cover object-right"
          />
          {/* Gradient overlay for seamless blending on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1931] via-[#0A1931]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1931] via-transparent to-transparent" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="max-w-2xl">
          {/* Subtítulo azul eléctrico */}
          <span className="inline-block text-[#1D64F2] font-black tracking-widest text-xs sm:text-sm uppercase mb-3">
            BIENVENIDOS A
          </span>

          {/* Gran Título Principal */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none uppercase">
            WALFA-CHESS
          </h1>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-wide mt-2 uppercase">
            FUNDACIÓN DE AJEDREZ
          </h2>

          {/* Párrafo descriptivo */}
          <p className="mt-5 text-sm sm:text-base text-slate-200 max-w-xl leading-relaxed">
            Promovemos el ajedrez como herramienta de formación, disciplina y
            desarrollo integral para niños, jóvenes y adultos.
          </p>

          {/* Botones de acción */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/torneos">
              <button className="inline-flex items-center gap-2 bg-[#1D64F2] hover:bg-[#1554cf] active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded shadow-lg transition duration-200">
                <Calendar className="h-4 w-4" />
                <span>PRÓXIMOS TORNEOS</span>
              </button>
            </Link>

            <Link href="/inscripciones">
              <button className="inline-flex items-center gap-2 bg-transparent hover:bg-white/10 active:scale-95 text-white border border-white/80 font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded transition duration-200">
                <UserPlus className="h-4 w-4" />
                <span>INSCRÍBETE AHORA</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 2. Sección Combinada: Próximos Torneos & Noticias ───
// Datos de respaldo idénticos a la maqueta por si no hay datos en BD
const MOCK_TOURNAMENTS = [
  {
    id: "mock-1",
    title: "WALFA-CHESS Blitz San Pedro 2026",
    slug: "walfa-chess-blitz-san-pedro-2026",
    start_date: "2026-02-22T09:00:00Z",
    end_date: "2026-02-22T18:00:00Z",
    location: "Recinto UASD, San Pedro",
    cover_image_url: "/mockup/tournament-1.jpg",
    type: "blitz" as const,
    status: "published" as const,
    inscription_type: "open" as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-2",
    title: "Match Internacional GM Lelys Martínez vs MI Josue Araujo",
    slug: "match-internacional-lelys-martinez-vs-josue-araujo",
    start_date: "2026-03-06T14:00:00Z",
    end_date: "2026-03-06T20:00:00Z",
    location: "Presencial - Santiago",
    cover_image_url: "/mockup/tournament-2.jpg",
    type: "blitz" as const,
    status: "published" as const,
    inscription_type: "open" as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-3",
    title: "Gran Simultánea GM Lesly Martínez Duany",
    slug: "gran-simultanea-gm-lesly-martinez-duany",
    start_date: "2026-02-28T10:00:00Z",
    end_date: "2026-02-28T16:00:00Z",
    location: "Parque Ercilia Pepín",
    cover_image_url: "/mockup/tournament-3.jpg",
    type: "blitz" as const,
    status: "published" as const,
    inscription_type: "open" as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const MOCK_NEWS = [
  {
    id: "mock-n1",
    title: "WALFA-CHESS continúa impulsando el ajedrez en todo el país",
    slug: "walfa-chess-continua-impulsando-el-ajedrez-en-todo-el-pais",
    published_at: "2025-05-15T12:00:00Z",
    cover_image_url: "/mockup/news-1.jpg",
    is_published: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-n2",
    title: "Excelente participación en el Torneo Blitz Higuey 2026",
    slug: "excelente-participacion-en-el-torneo-blitz-higuey-2026",
    published_at: "2025-05-10T12:00:00Z",
    cover_image_url: "/mockup/news-2.jpg",
    is_published: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-n3",
    title: "Escuela de Talentos Kendry Moron sigue formando campeones",
    slug: "escuela-de-talentos-kendry-moron-sigue-formando-campeones",
    published_at: "2025-05-05T12:00:00Z",
    cover_image_url: "/mockup/news-3.jpg",
    is_published: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

async function TournamentsAndNewsSection() {
  "use cache"
  cacheLife("minutes")

  const dbTournaments = await getUpcomingTournaments(3)
  const dbNews = await getPublicNews(3)

  const tournamentsToDisplay =
    dbTournaments && dbTournaments.length > 0 ? dbTournaments : MOCK_TOURNAMENTS
  const newsToDisplay = dbNews && dbNews.length > 0 ? dbNews : MOCK_NEWS

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* ─── Columna Izquierda: PRÓXIMOS TORNEOS (8 cols) ─── */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-wider text-[#0A1931] uppercase mb-6">
                PRÓXIMOS TORNEOS
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {tournamentsToDisplay.map((tournament) => (
                  <TournamentCard key={tournament.id} tournament={tournament as any} />
                ))}
              </div>
            </div>

            {/* Botón centrado: VER TODOS LOS TORNEOS */}
            <div className="mt-8 text-center">
              <Link href="/torneos">
                <button className="inline-flex items-center justify-center px-6 py-2.5 rounded border border-[#1D64F2] text-[#1D64F2] hover:bg-[#1D64F2] hover:text-white font-extrabold text-xs uppercase tracking-wider transition-colors duration-200 shadow-sm">
                  VER TODOS LOS TORNEOS
                </button>
              </Link>
            </div>
          </div>

          {/* ─── Columna Derecha: NOTICIAS (4 cols) ─── */}
          <div className="lg:col-span-4 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200 pt-8 lg:pt-0 lg:pl-8">
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-wider text-[#0A1931] uppercase mb-6">
                NOTICIAS
              </h2>

              <div className="space-y-4 divide-y divide-slate-100">
                {newsToDisplay.map((item) => (
                  <NewsCard key={item.id} news={item as any} variant="compact" />
                ))}
              </div>
            </div>

            {/* Enlace: VER TODAS LAS NOTICIAS → */}
            <div className="mt-8 pt-4 border-t border-slate-100">
              <Link
                href="/noticias"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D64F2] hover:text-[#1554cf] uppercase tracking-wider transition-colors"
              >
                <span>VER TODAS LAS NOTICIAS</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 3. Cinta de Estadísticas (Full-width Stats Bar) ───
function StatsRibbon() {
  const stats = [
    {
      icon: Users,
      value: "+1,200",
      label: "Jugadores Formados",
    },
    {
      icon: Trophy,
      value: "+80",
      label: "Torneos Realizados",
    },
    {
      icon: Award,
      value: "+150",
      label: "Campeones Destacados",
    },
    {
      icon: Globe,
      value: "+15",
      label: "Provincias Alcanzadas",
    },
  ]

  return (
    <section className="bg-[#081830] text-white py-10 border-y border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="flex items-center justify-center gap-3 sm:gap-4 text-left"
              >
                <div className="text-white opacity-80 shrink-0">
                  <Icon className="h-8 w-8 sm:h-10 sm:w-10 stroke-[1.5]" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-300 font-medium leading-tight mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── 4. Galería Destacada ───
function FeaturedGallerySection() {
  const galleryItems = [
    { src: "/mockup/gallery-1.jpg", alt: "Torneo Infantil WALFA-CHESS" },
    { src: "/mockup/gallery-2.jpg", alt: "Trofeos y Premiaciones Oficiales" },
    { src: "/mockup/gallery-3.jpg", alt: "Ceremonia de Clausura y Diplomas" },
    { src: "/mockup/gallery-4.jpg", alt: "Sala de Juego y Competencia" },
    { src: "/mockup/gallery-5.jpg", alt: "Jugador Concentrado en Apertura" },
  ]

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-sm sm:text-base font-black tracking-wider text-[#0A1931] uppercase mb-6">
          GALERÍA DESTACADA
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-900 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        {/* Botón centrado: VER TODA LA GALERÍA */}
        <div className="mt-8 text-center">
          <Link href="/galeria">
            <button className="inline-flex items-center justify-center px-6 py-2.5 rounded border border-[#1D64F2] text-[#1D64F2] hover:bg-[#1D64F2] hover:text-white font-extrabold text-xs uppercase tracking-wider transition-colors duration-200 shadow-sm">
              VER TODA LA GALERÍA
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── 5. Patrocinadores y Colaboradores ───
function SponsorsRowSection() {
  const sponsors = [
    {
      name: "integratec - Soluciones Tecnológicas",
      logo: "/mockup/sponsor-1.jpg",
    },
    {
      name: "ESCUELA DE TALENTOS KENDRY MORON",
      logo: "/mockup/sponsor-2.jpg",
    },
    {
      name: "CANAL DE ONIEL SANTANA STREAMING",
      logo: "/mockup/sponsor-3.jpg",
    },
    {
      name: "WALFA-TECH TECNOLOGÍA E INNOVACIÓN",
      logo: "/mockup/sponsor-4.jpg",
    },
  ]

  return (
    <section className="bg-white pb-16 pt-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado con línea horizontal que se extiende */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-xs sm:text-sm font-black tracking-wider text-[#0A1931] uppercase shrink-0">
            PATROCINADORES Y COLABORADORES
          </h2>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          {sponsors.map((sponsor, index) => (
            <div
              key={index}
              className="h-16 relative flex items-center justify-center p-2 rounded-lg border border-slate-100 hover:border-slate-200 bg-white transition duration-200"
            >
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={180}
                height={50}
                className="object-contain max-h-12 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Página Principal ───
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<PageLoadingSpinner />}>
        <TournamentsAndNewsSection />
      </Suspense>
      <StatsRibbon />
      <FeaturedGallerySection />
      <SponsorsRowSection />
    </>
  )
}
