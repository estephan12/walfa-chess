import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Calendar,
  MapPin,
  Trophy,
  Clock,
  Users,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Images,
} from "lucide-react"

import { getTournamentBySlug } from "@/lib/queries/tournamentQueries"
import { getAlbumByTournamentId } from "@/lib/queries/galleryQueries"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Button } from "@/components/ui/button"
import { cacheLife } from "next/cache"
import {
  formatDate,
  formatDateRange,
  getTournamentTypeLabel,
  formatCurrency,
} from "@/lib/utils"

export const instant = false

interface TorneoPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: TorneoPageProps): Promise<Metadata> {
  const { slug } = await params
  const tournament = await getTournamentBySlug(slug)

  if (!tournament) {
    return { title: "Torneo no encontrado | WALFA-CHESS" }
  }

  return {
    title: `${tournament.title} | Torneo Oficial WALFA-CHESS`,
    description:
      tournament.description ??
      `Bases, horarios, premios e inscripción para ${tournament.title}.`,
    openGraph: {
      title: tournament.title,
      description: tournament.description ?? "",
      images: tournament.cover_image_url ? [tournament.cover_image_url] : ["/images/logo.jpg"],
    },
  }
}

export default async function TorneoPage({ params }: TorneoPageProps) {
  const { slug } = await params
  const tournament = await getTournamentBySlug(slug)

  if (!tournament) {
    notFound()
  }

  const album = await getAlbumByTournamentId(tournament.id)

  const isRegistrationOpen =
    tournament.status === "published" && tournament.inscription_type !== "closed"

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-24">
      {/* Barra de navegación superior / Volver */}
      <div className="border-b border-slate-200 bg-slate-50/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/torneos"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#1D64F2] hover:text-[#1554cf] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al calendario de torneos
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
        {/* Banner de Portada Hero */}
        <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md mb-10">
          {tournament.cover_image_url ? (
            <Image
              src={tournament.cover_image_url}
              alt={tournament.title}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-400">
              <Trophy className="h-20 w-20 opacity-40" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Badges sobre la portada */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-[#0A1931]/90 backdrop-blur border border-white/20 px-3.5 py-1.5 text-xs font-bold text-white uppercase tracking-wider">
                {getTournamentTypeLabel(tournament.type)}
              </span>
              <StatusBadge status={tournament.status} />
            </div>

            {tournament.prize_pool && (
              <div className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-[#0A1931]/90 backdrop-blur border border-white/20 px-4 py-1.5 text-xs font-bold text-white">
                <Trophy className="h-4 w-4 text-[#1D64F2]" /> {tournament.prize_pool}
              </div>
            )}
          </div>
        </div>

        {/* Grid Principal: Info Técnica + Sidebar de Inscripción */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Columna Principal (2 columnas) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Título & Resumen */}
            <div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {tournament.title}
              </h1>

              {tournament.organizer_name && (
                <p className="mt-3 text-xs sm:text-sm font-semibold text-[#1D64F2] flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" /> Organizado por: {tournament.organizer_name}
                </p>
              )}

              {tournament.description && (
                <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed">
                  {tournament.description}
                </p>
              )}
            </div>

            {/* Ficha Técnica / Grilla de Detalles */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#1D64F2]" /> Especificaciones Técnicas
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                {/* Fechas */}
                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <Calendar className="h-5 w-5 text-[#1D64F2] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Fecha del Evento</p>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {formatDateRange(tournament.start_date, tournament.end_date)}
                    </p>
                  </div>
                </div>

                {/* Ritmo */}
                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <Clock className="h-5 w-5 text-[#1D64F2] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Ritmo de Juego</p>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {tournament.time_control || "Por definir"}
                    </p>
                  </div>
                </div>

                {/* Rondas */}
                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <Trophy className="h-5 w-5 text-[#1D64F2] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Rondas Programadas</p>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {tournament.rounds ? `${tournament.rounds} Rondas` : "Por confirmar"}
                    </p>
                  </div>
                </div>

                {/* Cupo */}
                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <Users className="h-5 w-5 text-[#1D64F2] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Límite de Jugadores</p>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {tournament.max_participants
                        ? `${tournament.max_participants} Participantes`
                        : "Sin límite establecido"}
                    </p>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="sm:col-span-2 flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-start gap-3.5">
                    <MapPin className="h-5 w-5 text-[#1D64F2] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">Sede Oficial</p>
                      <p className="font-bold text-slate-900 mt-0.5">
                        {tournament.location || "Sede por confirmar"}
                      </p>
                    </div>
                  </div>

                  {tournament.location_maps_url && (
                    <a
                      href={tournament.location_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#1D64F2] hover:underline shrink-0 mt-1"
                    >
                      Abrir Mapa <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Bases & Reglamento Técnico */}
            {tournament.content && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#1D64F2]" /> Bases y Reglamento Oficial
                </h2>
                <div className="text-sm text-slate-800 whitespace-pre-line font-mono leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-200">
                  {tournament.content}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Lateral (1 columna) */}
          <div className="space-y-6">
            {/* Tarjeta de Registro / Costo */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm sticky top-24">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D64F2] uppercase tracking-wider mb-2">
                <Trophy className="h-4 w-4" /> Registro Oficial
              </div>

              <div className="mt-2 mb-6">
                <p className="text-xs text-slate-500 uppercase font-bold">Costo de Inscripción</p>
                <p className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                  {tournament.entry_fee && tournament.entry_fee > 0
                    ? formatCurrency(tournament.entry_fee)
                    : "Gratis"}
                </p>
              </div>

              {tournament.registration_deadline && (
                <div className="mb-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <p className="text-slate-500">Cierre de inscripciones:</p>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {formatDate(tournament.registration_deadline)}
                  </p>
                </div>
              )}

              {isRegistrationOpen ? (
                <div className="space-y-3">
                  <Link
                    href={
                      tournament.inscription_type === "external" && tournament.inscription_url
                        ? tournament.inscription_url
                        : `/inscripciones?torneo=${tournament.slug}`
                    }
                    target={tournament.inscription_type === "external" ? "_blank" : undefined}
                    className="block w-full"
                  >
                    <Button
                      size="lg"
                      className="w-full bg-[#1D64F2] text-white hover:bg-[#1554cf] font-bold text-base py-4 shadow-md"
                    >
                      Inscribirme Ahora
                    </Button>
                  </Link>
                  <p className="text-[11px] text-center text-slate-500">
                    Inscripción sujeta a validación y disponibilidad de cupos.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <p className="text-xs font-bold text-slate-500">
                    Inscripciones cerradas para este torneo
                  </p>
                </div>
              )}

              {/* Premios en el sidebar */}
              {tournament.prize_pool && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase">Premios Destacados</p>
                  <p className="text-sm font-bold text-slate-900 mt-1 flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1D64F2] shrink-0 mt-0.5" />
                    {tournament.prize_pool}
                  </p>
                </div>
              )}

              {/* Contacto de dudas */}
              {tournament.organizer_contact && (
                <div className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-500">
                  <p className="font-bold text-slate-900">¿Dudas sobre el evento?</p>
                  <p className="mt-1">{tournament.organizer_contact}</p>
                </div>
              )}
            </div>

            {/* Tarjeta de Álbum Fotográfico Oficial si existe */}
            {album && (
              <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D64F2] uppercase tracking-wider">
                  <Images className="h-4 w-4" /> Cobertura Multimedia
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {album.title}
                </h3>
                <p className="text-xs text-slate-600">
                  {album.image_count} fotografías oficiales disponibles en alta resolución.
                </p>
                <Link href={`/galeria/${album.slug}`} className="block pt-1">
                  <Button
                    variant="secondary"
                    className="w-full bg-slate-100 border border-slate-200 text-[#1D64F2] hover:bg-slate-200 font-bold text-xs"
                  >
                    Ver Fotos Oficiales →
                  </Button>
                </Link>
              </div>
            )}

            {/* Tarjeta de Resultados si el torneo ya inició o finalizó */}
            {(tournament.status === "finished" || tournament.status === "ongoing") && (
              <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D64F2] uppercase tracking-wider">
                  <Trophy className="h-4 w-4" /> Posiciones Oficiales
                </div>
                <p className="text-xs text-slate-600">
                  Consulta el podio de ganadores, clasificación por categorías y desempates técnicos.
                </p>
                <Link href={`/resultados/${tournament.id}`} className="block pt-1">
                  <Button
                    variant="secondary"
                    className="w-full bg-slate-100 border border-slate-200 text-[#1D64F2] hover:bg-slate-200 font-bold text-xs"
                  >
                    Ver Resultados & Podio →
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}