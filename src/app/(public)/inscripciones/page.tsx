import type { Metadata } from "next"
import { Suspense } from "react"
import { Trophy, CheckCircle, Clock, ShieldAlert } from "lucide-react"
import { getOpenTournamentsForInscription } from "@/lib/queries/inscriptionQueries"
import { InscriptionForm } from "@/components/public/InscriptionForm"
import { PageLoadingSpinner } from "@/components/shared/LoadingSpinner"

export const metadata: Metadata = {
  title: "Inscripciones a Torneos",
  description: "Formulario oficial de inscripción para los torneos y competencias de la Fundación WALFA-CHESS.",
}

export const instant = false

interface InscripcionesPageProps {
  searchParams: Promise<{ torneo?: string }>
}

async function InscriptionContent({ searchParams }: InscripcionesPageProps) {
  const { torneo: initialSlug } = await searchParams
  const tournaments = await getOpenTournamentsForInscription()

  return <InscriptionForm tournaments={tournaments} initialSlug={initialSlug} />
}

export default function InscripcionesPage({ searchParams }: InscripcionesPageProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-bold text-[#1D64F2] uppercase tracking-wider mb-3">
          <Trophy className="h-3.5 w-3.5" />
          Registro Oficial
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Inscripción a Torneos
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Completa el formulario oficial para reservar tu cupo en los torneos y competencias de la Fundación WALFA-CHESS.
        </p>
      </div>

      {/* Formulario con Suspense */}
      <div className="mb-14">
        <Suspense fallback={<PageLoadingSpinner />}>
          <InscriptionContent searchParams={searchParams} />
        </Suspense>
      </div>

      {/* Guía informativa / Preguntas frecuentes */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#1D64F2]" />
          Información Importante para Participantes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-600">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-[#1D64F2]" /> 1. Validación
            </p>
            <p>
              Toda solicitud pasa por una revisión técnica del comité organizador para validar la categoría según tu Elo.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-[#1D64F2]" /> 2. Confirmación
            </p>
            <p>
              Recibirás un mensaje de WhatsApp o correo confirmando tu número de partida y mesa asignada previo a la primera ronda.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-[#1D64F2]" /> 3. Puntualidad
            </p>
            <p>
              El día inaugural deberás presentar tu documento de identidad con 30 minutos de antelación al inicio de la ronda 1.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
