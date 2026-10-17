"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Trophy,
  Calendar,
  MapPin,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  User,
  Phone,
  MessageCircle,
  Mail,
} from "lucide-react"
import type { TournamentWithCategories } from "@/lib/queries/inscriptionQueries"
import { submitInscriptionAction } from "@/lib/actions/inscriptionActions"
import { formatDateRange, formatCurrency, formatDate } from "@/lib/utils"
import { DOMINICAN_PROVINCES } from "@/lib/constants"
import { Button } from "@/components/ui/button"

interface InscriptionFormProps {
  tournaments: TournamentWithCategories[]
  initialSlug?: string
}

export function InscriptionForm({ tournaments, initialSlug }: InscriptionFormProps) {
  // Encontrar el torneo inicial si viene por URL
  const defaultTournament =
    (initialSlug ? tournaments.find((t) => t.slug === initialSlug) : null) ??
    (tournaments.length > 0 ? tournaments[0] : null)

  const [selectedTournamentId, setSelectedTournamentId] = useState<string>(
    defaultTournament?.id ?? ""
  )
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [province, setProvince] = useState("")
  const [email, setEmail] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submittedData, setSubmittedData] = useState<{
    id: string
    tournamentTitle: string
    fullName: string
    phone: string
    province: string
    email?: string
  } | null>(null)

  const currentTournament = tournaments.find((t) => t.id === selectedTournamentId)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMessage(null)

    if (!selectedTournamentId) {
      setErrorMessage("Por favor, selecciona un torneo.")
      return
    }

    if (currentTournament?.is_full) {
      setErrorMessage("Los cupos para este torneo se encuentran agotados.")
      return
    }

    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMessage("Por favor, ingresa tu nombre y apellido (mínimo 3 caracteres).")
      return
    }

    if (!phone.trim() || phone.trim().replace(/\D/g, "").length < 7) {
      setErrorMessage("Por favor, ingresa un número de WhatsApp válido (mínimo 7 dígitos).")
      return
    }

    if (!province.trim()) {
      setErrorMessage("Por favor, selecciona la provincia de donde eres.")
      return
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage("Por favor, ingresa un correo electrónico válido o déjalo en blanco.")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await submitInscriptionAction({
        tournament_id: selectedTournamentId,
        full_name: fullName.trim(),
        phone: phone.trim(),
        province: province.trim(),
        email: email.trim() || undefined,
      })

      if (!result.success) {
        setErrorMessage(result.error ?? "Ocurrió un error inesperado al enviar la inscripción.")
      } else {
        setSubmittedData({
          id: result.data?.id ?? "",
          tournamentTitle: currentTournament?.title ?? "Torneo Oficial",
          fullName: fullName.trim(),
          phone: phone.trim(),
          province: province.trim(),
          email: email.trim() || undefined,
        })
      }
    } catch {
      setErrorMessage("Error de conexión con el servidor. Inténtalo nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleReset() {
    setFullName("")
    setPhone("")
    setProvince("")
    setEmail("")
    setErrorMessage(null)
    setSubmittedData(null)
  }

  // Vista de éxito / Confirmación
  if (submittedData) {
    return (
      <div className="rounded-2xl border-2 border-emerald-500/40 bg-white p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 border-2 border-emerald-500/40 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-4">
          Solicitud Registrada
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          ¡Inscripción Recibida!
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
          Hemos recibido los datos de registro para{" "}
          <strong className="text-slate-900">{submittedData.fullName}</strong> en{" "}
          <strong className="text-[#1D64F2]">{submittedData.tournamentTitle}</strong>.
        </p>

        {/* Resumen del ticket */}
        <div className="mt-8 p-6 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs sm:text-sm space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <span className="text-slate-500">Código de Referencia:</span>
            <span className="font-mono font-bold text-[#1D64F2]">
              #{submittedData.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <span className="text-slate-500">Participante:</span>
            <span className="font-bold text-slate-900">{submittedData.fullName}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <span className="text-slate-500">Provincia:</span>
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#1D64F2]" />
              {submittedData.province}
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <span className="text-slate-500">WhatsApp:</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" />
              {submittedData.phone}
            </span>
          </div>
          {submittedData.email && (
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="text-slate-500">Correo Electrónico:</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-500" />
                {submittedData.email}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Estado:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-[11px] font-bold">
              Pendiente de validación
            </span>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-500 leading-relaxed">
          El comité organizador verificará los datos y te contactará vía WhatsApp para confirmar tu participación y los detalles del certamen.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={handleReset}
            variant="secondary"
            className="w-full sm:w-auto bg-slate-100 border border-slate-200 text-slate-800 hover:bg-slate-200 font-bold text-sm px-6"
          >
            Inscribir a otra persona
          </Button>
          <Link href="/torneos" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-[#1D64F2] text-white hover:bg-[#1554cf] font-bold text-sm px-6">
              Ver más torneos <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Si no hay torneos disponibles
  if (tournaments.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm max-w-xl mx-auto">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 border border-blue-200">
          <Calendar className="h-7 w-7 text-[#1D64F2]" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No hay torneos con inscripciones abiertas</h2>
        <p className="mt-2 text-sm text-slate-600">
          En este momento no hay eventos con convocatorias activas para registro en línea. Te invitamos a revisar nuestro calendario o redes sociales para las próximas fechas oficiales.
        </p>
        <div className="mt-6">
          <Link href="/torneos">
            <Button className="bg-[#1D64F2] text-white hover:bg-[#1554cf] font-bold">
              Explorar Torneos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Selección del Torneo */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <label
          htmlFor="tournament_select"
          className="block text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2"
        >
          <Trophy className="h-4 w-4 text-[#1D64F2]" />
          1. Selecciona el Torneo *
        </label>
        <p className="text-xs text-slate-500 mb-4">
          Elige la competencia en la que deseas participar.
        </p>

        <select
          id="tournament_select"
          value={selectedTournamentId}
          onChange={(e) => {
            setSelectedTournamentId(e.target.value)
          }}
          required
          className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3.5 text-sm font-bold text-slate-900 focus:border-[#1D64F2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1D64F2] transition"
        >
          {tournaments.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title} — ({formatDate(t.start_date)}){" "}
              {t.is_full
                ? "— [CUPOS AGOTADOS]"
                : t.available_spots !== null
                ? `— (${t.available_spots} cupos disponibles)`
                : ""}
            </option>
          ))}
        </select>

        {/* Ficha rápida del torneo seleccionado */}
        {currentTournament && (
          <div className="mt-5 space-y-3">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="flex items-start gap-2.5">
                <Calendar className="h-4 w-4 text-[#1D64F2] shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block font-semibold">Fecha:</span>
                  <span className="text-slate-900 font-bold">
                    {formatDateRange(currentTournament.start_date, currentTournament.end_date)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#1D64F2] shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block font-semibold">Sede:</span>
                  <span className="text-slate-900 font-bold">
                    {currentTournament.location || "Por definir"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <DollarSign className="h-4 w-4 text-[#1D64F2] shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block font-semibold">Costo:</span>
                  <span className="text-[#1D64F2] font-black">
                    {currentTournament.entry_fee && currentTournament.entry_fee > 0
                      ? formatCurrency(currentTournament.entry_fee)
                      : "Gratis"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Trophy className="h-4 w-4 text-[#1D64F2] shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block font-semibold">Cupos:</span>
                  <span
                    className={`font-black ${
                      currentTournament.is_full
                        ? "text-rose-600 uppercase"
                        : typeof currentTournament.available_spots === "number" &&
                          currentTournament.available_spots <= 5
                        ? "text-amber-600"
                        : "text-emerald-700"
                    }`}
                  >
                    {currentTournament.is_full
                      ? "Agotados"
                      : typeof currentTournament.available_spots === "number"
                      ? `${currentTournament.available_spots} disponibles`
                      : "Sin límite"}
                  </span>
                </div>
              </div>
            </div>

            {/* Banner de alerta si está lleno o enlace a nómina */}
            {currentTournament.is_full ? (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>
                    Este torneo ha completado su límite máximo de{" "}
                    <strong>{currentTournament.max_participants} participantes</strong>. Los cupos
                    están agotados.
                  </span>
                </div>
                <Link
                  href={`/torneos/${currentTournament.slug}`}
                  target="_blank"
                  className="text-rose-700 underline font-bold shrink-0 hover:text-rose-900"
                >
                  Ver inscritos →
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-500 px-1">
                <span>
                  Actualmente hay <strong>{currentTournament.inscriptions_count || 0}</strong> jugadores
                  inscritos {currentTournament.max_participants ? `de ${currentTournament.max_participants} máx.` : ""}.
                </span>
                <Link
                  href={`/torneos/${currentTournament.slug}`}
                  target="_blank"
                  className="text-[#1D64F2] font-bold hover:underline inline-flex items-center gap-1"
                >
                  Ver nómina de inscritos <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Datos para el Registro */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-2">
            <User className="h-4 w-4 text-[#1D64F2]" />
            2. Datos del Participante
          </h2>
          <p className="text-xs text-slate-500">
            Completa tus datos personales para formalizar tu registro.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Nombre y Apellido */}
          <div>
            <label htmlFor="full_name" className="block text-xs font-bold text-slate-800 mb-2">
              Nombre y Apellido *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                id="full_name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Roberto Carlos Rodríguez"
                className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1D64F2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1D64F2]"
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <label htmlFor="phone" className="block text-xs font-bold text-slate-800 mb-2">
              WhatsApp *
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej. 809-555-0199"
                className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1D64F2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1D64F2]"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
              <MessageCircle className="h-3 w-3 text-emerald-600 inline shrink-0" />
              Te contactaremos por este medio con los detalles del torneo.
            </p>
          </div>

          {/* Provincia de procedencia */}
          <div>
            <label htmlFor="province" className="block text-xs font-bold text-slate-800 mb-2">
              Provincia de Procedencia *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                id="province"
                required
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 text-sm text-slate-900 focus:border-[#1D64F2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1D64F2] transition"
              >
                <option value="">Selecciona tu provincia...</option>
                {DOMINICAN_PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Correo Electrónico (opcional) */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-slate-800 mb-2">
              Correo Electrónico <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com (opcional)"
                className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1D64F2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1D64F2]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
          <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Botón de Envío */}
      <div className="text-center pt-2">
        {currentTournament?.is_full ? (
          <Button
            type="button"
            disabled
            size="lg"
            className="w-full sm:w-auto min-w-[260px] bg-rose-100 text-rose-700 border border-rose-200 font-bold text-base py-4 cursor-not-allowed shadow-none"
          >
            Cupos Agotados para este Torneo
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full sm:w-auto min-w-[260px] bg-[#1D64F2] text-white hover:bg-[#1554cf] font-bold text-base py-4 shadow-md"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> Procesando inscripción...
              </span>
            ) : (
              "Completar Inscripción"
            )}
          </Button>
        )}
        <p className="text-[11px] text-slate-500 mt-3">
          Al enviar este formulario confirmas tu solicitud para el torneo seleccionado.
        </p>
      </div>
    </form>
  )
}
