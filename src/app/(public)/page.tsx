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
import { getStatsRibbonConfig } from "@/lib/queries/settingsQueries"
import { getFeaturedGalleryImages } from "@/lib/queries/galleryQueries"
import { getActiveSponsors } from "@/lib/queries/sponsorQueries"
import { TournamentCard } from "@/components/public/TournamentCard"
import { NewsCard } from "@/components/public/NewsCard"
import { HomeGallerySection } from "@/components/public/HomeGallerySection"
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
            className="object-cover object-center"
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
const ICONS_MAP: Record<string, any> = {
  users: Users,
  trophy: Trophy,
  award: Award,
  globe: Globe,
}

async function StatsRibbon() {
  const { displayStats } = await getStatsRibbonConfig()

  return (
    <section className="bg-[#081830] text-white py-10 border-y border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {displayStats.map((stat, index) => {
            const Icon = ICONS_MAP[stat.icon] || Users
            return (
              <div
                key={index}
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

// ─── 4. Galería Destacada Interactiva ───
async function FeaturedGallerySection() {
  const dbImages = await getFeaturedGalleryImages(5)

  // Fotos de alta definición oficiales de WALFA-CHESS
  const fallbackImages = [
    {
      id: "f1",
      url: "https://jmdblmwokglcwkkabjzy.supabase.co/storage/v1/object/public/gallery/albums/a6126d85-dd92-4337-b1e3-8d464529914c/album-a6126d85-dd92-4337-b1e3-8d464529914c-1788311102217-tj293f.jpg",
      alt: "Torneo Infantil y Juvenil WALFA-CHESS",
      albumTitle: "WALFA-CHESS VERANO PUERTO PLATA 2026",
      albumSlug: "walfa-chess-verano-puerto-plata-2026",
    },
    {
      id: "f2",
      url: "https://jmdblmwokglcwkkabjzy.supabase.co/storage/v1/object/public/gallery/albums/a6126d85-dd92-4337-b1e3-8d464529914c/album-a6126d85-dd92-4337-b1e3-8d464529914c-1788311138579-4o52o5.jpg",
      alt: "Ceremonia de Clausura y Premiación",
      albumTitle: "WALFA-CHESS VERANO PUERTO PLATA 2026",
      albumSlug: "walfa-chess-verano-puerto-plata-2026",
    },
    {
      id: "f3",
      url: "https://jmdblmwokglcwkkabjzy.supabase.co/storage/v1/object/public/gallery/albums/a6126d85-dd92-4337-b1e3-8d464529914c/album-a6126d85-dd92-4337-b1e3-8d464529914c-1788311139733-mv5a1b.jpg",
      alt: "Ronda de Competencia Oficial",
      albumTitle: "WALFA-CHESS VERANO PUERTO PLATA 2026",
      albumSlug: "walfa-chess-verano-puerto-plata-2026",
    },
    {
      id: "f4",
      url: "https://jmdblmwokglcwkkabjzy.supabase.co/storage/v1/object/public/gallery/albums/a6126d85-dd92-4337-b1e3-8d464529914c/album-a6126d85-dd92-4337-b1e3-8d464529914c-1788311140507-5lrna7.jpg",
      alt: "Ajedrecistas en Partida de Apertura",
      albumTitle: "WALFA-CHESS VERANO PUERTO PLATA 2026",
      albumSlug: "walfa-chess-verano-puerto-plata-2026",
    },
    {
      id: "f5",
      url: "https://jmdblmwokglcwkkabjzy.supabase.co/storage/v1/object/public/news/covers/news-1788084008775-8eowrat.jpg",
      alt: "Maestro Internacional Josué Araujo - Medalla de Oro",
      albumTitle: "Logros y Campeonatos",
      albumSlug: "walfa-chess-verano-puerto-plata-2026",
    },
  ]

  const displayImages = dbImages.length > 0 
    ? [...dbImages, ...fallbackImages.slice(dbImages.length)].slice(0, 5)
    : fallbackImages

  return <HomeGallerySection images={displayImages} />
}

// ─── 5. Patrocinadores y Colaboradores ───
async function SponsorsRowSection() {
  const dbSponsors = await getActiveSponsors()

  const fallbackSponsors = [
    {
      id: "mock-1",
      name: "integratec - Soluciones Tecnológicas",
      logo: "/mockup/sponsor-1.png",
      website_url: null,
    },
    {
      id: "mock-2",
      name: "ESCUELA DE TALENTOS KENDRY MORON",
      logo: "/mockup/sponsor-2.png",
      website_url: null,
    },
    {
      id: "mock-3",
      name: "CANAL DE ONIEL SANTANA STREAMING",
      logo: "/mockup/sponsor-3.png",
      website_url: null,
    },
    {
      id: "mock-4",
      name: "WALFA-TECH TECNOLOGÍA E INNOVACIÓN",
      logo: "/mockup/sponsor-4.png",
      website_url: null,
    },
  ]

  const sponsors = dbSponsors.length > 0
    ? dbSponsors.map((s) => ({
        id: s.id,
        name: s.name,
        logo: s.logo_url || "/mockup/sponsor-1.png",
        website_url: s.website_url,
      }))
    : fallbackSponsors

  return (
    <section className="bg-white pb-16 pt-4" aria-labelledby="sponsors-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado con línea horizontal que se extiende */}
        <div className="flex items-center gap-4 mb-8">
          <h2
            id="sponsors-heading"
            className="text-xs sm:text-sm font-black tracking-wider text-[#0A1931] uppercase shrink-0"
          >
            PATROCINADORES Y COLABORADORES
          </h2>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 items-center">
          {sponsors.map((sponsor) => {
            const cardContent = (
              <div className="h-20 sm:h-24 relative flex items-center justify-center p-3 sm:p-4 rounded-xl border border-slate-100 hover:border-slate-300 bg-white transition-all duration-200 shadow-sm hover:shadow-md group">
                <div className="relative h-12 sm:h-14 w-full flex items-center justify-center">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 160px, (max-width: 1024px) 220px, 280px"
                  />
                </div>
              </div>
            )

            if (sponsor.website_url) {
              return (
                <a
                  key={sponsor.id}
                  href={sponsor.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D64F2] rounded-xl"
                  title={`Visitar web de ${sponsor.name}`}
                >
                  {cardContent}
                </a>
              )
            }

            return <div key={sponsor.id}>{cardContent}</div>
          })}
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
      <Suspense fallback={<div className="h-24 bg-[#081830]" />}>
        <StatsRibbon />
      </Suspense>
      <Suspense fallback={<div className="h-64 bg-white" />}>
        <FeaturedGallerySection />
      </Suspense>
      <Suspense fallback={<div className="h-24 bg-white" />}>
        <SponsorsRowSection />
      </Suspense>
    </>
  )
}
