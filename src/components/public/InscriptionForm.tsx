"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Trophy,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Hash,
  MessageSquare,
} from "lucide-react"
import type { TournamentWithCategories } from "@/lib/queries/inscriptionQueries"
import { submitInscriptionAction } from "@/lib/actions/inscriptionActions"
import { formatDateRange, formatCurrency, formatDate } from "@/lib/utils"
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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [fideId, setFideId] = useState("")
  const [notes, setNotes] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submittedData, setSubmittedData] = useState<{
    id: string
    tournamentTitle: string
    fullName: string
    email: string
  } | null>(null)

  const currentTournament = tournaments.find((t) => t.id === selectedTournamentId)
  const availableCategories = currentTournament?.categories ?? []

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMessage(null)

    if (!selectedTournamentId) {
      setErrorMessage("Por favor, selecciona un torneo.")
      return
    }

    if (!fullName.trim()) {
      setErrorMessage("Por favor, ingresa tu nombre completo.")
      return
    }

    if (!email.trim()) {
      setErrorMessage("Por favor, ingresa tu correo electrónico.")
      return
    }

    if (!phone.trim()) {
      setErrorMessage("Por favor, ingresa tu número de teléfono / WhatsApp.")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await submitInscriptionAction({
        tournament_id: selectedTournamentId,
        category_id: selectedCategoryId || null,
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        fide_id: fideId.trim() || null,
        notes: notes.trim() || null,
      })

      if (!res.success) {
        setErrorMessage(res.error)
      } else {
        setSubmittedData({
          id: res.data.id,
          tournamentTitle: res.data.tournamentTitle,
          fullName: fullName.trim(),
          email: email.trim(),
        })
      }
    } catch {
      setErrorMessage("Ocurrió un problema de conexión al enviar la inscripción. Intente de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleReset() {
    setFullName("")
    setEmail("")
    setPhone("")
    setFideId("")
    setNotes("")
    setSelectedCategoryId("")
    setErrorMessage(null)
    setSubmittedData(null)
  }

  // Vista de éxito / Confirmación
  if (submittedData) {
    return (
      <div className="rounded-3xl border-2 border-[#5FA8D3]/50 bg-[#132238] p-8 sm:p-12 shadow-2xl text-center max-w-2xl mx-auto">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-400">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-4 py-1 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-4">
          Solicitud Registrada
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-[#F0F4F8] tracking-tight">
          ¡Inscripción Recibida!
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#94A3B8] max-w-lg mx-auto">
          Hemos recibido los datos de registro para{" "}
          <strong className="text-[#F0F4F8]">{submittedData.fullName}</strong> en{" "}
          <strong className="text-[#5FA8D3]">{submittedData.tournamentTitle}</strong>.
        </p>

        {/* Resumen del ticket */}
        <div className="mt-8 p-6 rounded-2xl bg-[#0B0F19] border border-[#2B5B84] text-left text-xs sm:text-sm space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-[#2B5B84]/50">
            <span className="text-[#94A3B8]">Código de Referencia:</span>
            <span className="font-mono font-bold text-[#5FA8D3]">
              #{submittedData.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-[#2B5B84]/50">
            <span className="text-[#94A3B8]">Correo Registrado:</span>
            <span className="font-bold text-[#F0F4F8]">{submittedData.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#94A3B8]">Estado:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
              Pendiente de validación
            </span>
          </div>
        </div>

        <p className="mt-6 text-xs text-[#94A3B8] leading-relaxed">
          El comité organizador verificará los datos técnicos y te contactará vía WhatsApp o correo electrónico para confirmar tu participación y los detalles del certamen.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={handleReset}
            variant="secondary"
            className="w-full sm:w-auto bg-[#0B0F19] border border-[#2B5B84] text-[#F0F4F8] hover:bg-[#1a2d4a] font-bold text-sm px-6"
          >
            Inscribir a otro jugador
          </Button>
          <Link href="/torneos" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-black text-sm px-6">
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
      <div className="rounded-3xl border border-[#2B5B84] bg-[#132238] p-10 text-center shadow-2xl max-w-xl mx-auto">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B0F19] border border-[#2B5B84]">
          <Calendar className="h-7 w-7 text-[#5FA8D3]" />
        </div>
        <h2 className="text-xl font-bold text-[#F0F4F8]">No hay torneos con inscripciones abiertas</h2>
        <p className="mt-2 text-sm text-[#94A3B8]">
          En este momento no hay eventos con convocatorias activas para registro en línea. Te invitamos a revisar nuestro calendario o redes sociales para las próximas fechas oficiales.
        </p>
        <div className="mt-6">
          <Link href="/torneos">
            <Button className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-bold">
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
      <div className="rounded-3xl border border-[#2B5B84] bg-[#132238] p-6 sm:p-8 shadow-xl">
        <label
          htmlFor="tournament_select"
          className="block text-sm font-bold text-[#F0F4F8] uppercase tracking-wider mb-2 flex items-center gap-2"
        >
          <Trophy className="h-4 w-4 text-[#5FA8D3]" />
          1. Selecciona el Torneo *
        </label>
        <p className="text-xs text-[#94A3B8] mb-4">
          Elige la competencia en la que deseas participar.
        </p>

        <select
          id="tournament_select"
          value={selectedTournamentId}
          onChange={(e) => {
            setSelectedTournamentId(e.target.value)
            setSelectedCategoryId("")
          }}
          required
          className="w-full rounded-xl bg-[#0B0F19] border border-[#2B5B84] px-4 py-3.5 text-sm font-bold text-[#F0F4F8] focus:border-[#5FA8D3] focus:outline-none focus:ring-1 focus:ring-[#5FA8D3] transition"
        >
          {tournaments.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title} — ({formatDate(t.start_date)})
            </option>
          ))}
        </select>

        {/* Ficha rápida del torneo seleccionado */}
        {currentTournament && (
          <div className="mt-5 p-5 rounded-2xl bg-[#0B0F19]/60 border border-[#2B5B84]/50 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="flex items-start gap-2.5">
              <Calendar className="h-4 w-4 text-[#5FA8D3] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#94A3B8] block font-semibold">Fecha:</span>
                <span className="text-[#F0F4F8] font-bold">
                  {formatDateRange(currentTournament.start_date, currentTournament.end_date)}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-[#5FA8D3] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#94A3B8] block font-semibold">Sede:</span>
                <span className="text-[#F0F4F8] font-bold">
                  {currentTournament.location || "Por definir"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <DollarSign className="h-4 w-4 text-[#5FA8D3] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#94A3B8] block font-semibold">Costo:</span>
                <span className="text-[#5FA8D3] font-black">
                  {currentTournament.entry_fee && currentTournament.entry_fee > 0
                    ? formatCurrency(currentTournament.entry_fee)
                    : "Gratis"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Categoría (si aplica) */}
      {availableCategories.length > 0 && (
        <div className="rounded-3xl border border-[#2B5B84] bg-[#132238] p-6 sm:p-8 shadow-xl">
          <label
            htmlFor="category_select"
            className="block text-sm font-bold text-[#F0F4F8] uppercase tracking-wider mb-2 flex items-center gap-2"
          >
            <ShieldCheck className="h-4 w-4 text-[#5FA8D3]" />
            2. Categoría o Rama
          </label>
          <p className="text-xs text-[#94A3B8] mb-4">
            Selecciona la categoría correspondiente a tu Elo o edad.
          </p>

          <select
            id="category_select"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full rounded-xl bg-[#0B0F19] border border-[#2B5B84] px-4 py-3.5 text-sm font-bold text-[#F0F4F8] focus:border-[#5FA8D3] focus:outline-none focus:ring-1 focus:ring-[#5FA8D3] transition"
          >
            <option value="">Categoría General / Abierta</option>
            {availableCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
                {cat.max_rating ? ` (Hasta Elo ${cat.max_rating})` : ""}
                {cat.prize ? ` — Premio: ${cat.prize}` : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 3. Datos del Jugador */}
      <div className="rounded-3xl border border-[#2B5B84] bg-[#132238] p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <h2 className="text-sm font-bold text-[#F0F4F8] uppercase tracking-wider mb-1 flex items-center gap-2">
            <User className="h-4 w-4 text-[#5FA8D3]" />
            {availableCategories.length > 0 ? "3. Datos del Jugador" : "2. Datos del Jugador"}
          </h2>
          <p className="text-xs text-[#94A3B8]">
            Información personal y de contacto para el listado oficial y emparejamientos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Nombre */}
          <div className="sm:col-span-2">
            <label htmlFor="full_name" className="block text-xs font-bold text-[#F0F4F8] mb-2">
              Nombre Completo *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-[#94A3B8]" />
              <input
                id="full_name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. José Raúl Capablanca"
                className="w-full rounded-xl bg-[#0B0F19] border border-[#2B5B84] pl-10 pr-4 py-3 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/50 focus:border-[#5FA8D3] focus:outline-none focus:ring-1 focus:ring-[#5FA8D3]"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-[#F0F4F8] mb-2">
              Correo Electrónico *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[#94A3B8]" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full rounded-xl bg-[#0B0F19] border border-[#2B5B84] pl-10 pr-4 py-3 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/50 focus:border-[#5FA8D3] focus:outline-none focus:ring-1 focus:ring-[#5FA8D3]"
              />
            </div>
          </div>

          {/* Teléfono / WhatsApp */}
          <div>
            <label htmlFor="phone" className="block text-xs font-bold text-[#F0F4F8] mb-2">
              Teléfono / WhatsApp *
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-[#94A3B8]" />
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej. 809-555-0199"
                className="w-full rounded-xl bg-[#0B0F19] border border-[#2B5B84] pl-10 pr-4 py-3 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/50 focus:border-[#5FA8D3] focus:outline-none focus:ring-1 focus:ring-[#5FA8D3]"
              />
            </div>
          </div>

          {/* FIDE ID */}
          <div className="sm:col-span-2">
            <label htmlFor="fide_id" className="block text-xs font-bold text-[#F0F4F8] mb-2">
              FIDE ID <span className="text-[#94A3B8] font-normal">(opcional)</span>
            </label>
            <div className="relative">
              <Hash className="absolute left-3.5 top-3.5 h-4 w-4 text-[#94A3B8]" />
              <input
                id="fide_id"
                type="text"
                value={fideId}
                onChange={(e) => setFideId(e.target.value)}
                placeholder="Ej. 34105423 (dejar en blanco si no tiene)"
                className="w-full rounded-xl bg-[#0B0F19] border border-[#2B5B84] pl-10 pr-4 py-3 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/50 focus:border-[#5FA8D3] focus:outline-none focus:ring-1 focus:ring-[#5FA8D3]"
              />
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-1.5">
              Si estás federado ante la FIDE, indícalo para agilizar el emparejamiento técnico.
            </p>
          </div>

          {/* Notas o comentarios */}
          <div className="sm:col-span-2">
            <label htmlFor="notes" className="block text-xs font-bold text-[#F0F4F8] mb-2">
              Comentarios o Club / Asociación <span className="text-[#94A3B8] font-normal">(opcional)</span>
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-[#94A3B8]" />
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Club de Ajedrez Santo Domingo Este / Solicito bye en ronda 1 si está permitido..."
                className="w-full rounded-xl bg-[#0B0F19] border border-[#2B5B84] pl-10 pr-4 py-3 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/50 focus:border-[#5FA8D3] focus:outline-none focus:ring-1 focus:ring-[#5FA8D3]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/50 flex items-start gap-3 text-rose-200 text-sm">
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Botón de Envío */}
      <div className="text-center pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="w-full sm:w-auto min-w-[260px] bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-black text-base py-4 shadow-xl shadow-[#5FA8D3]/20"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" /> Procesando inscripción...
            </span>
          ) : (
            "Completar Inscripción Oficial"
          )}
        </Button>
        <p className="text-[11px] text-[#94A3B8] mt-3">
          Al enviar este formulario aceptas las bases y el código de disciplina del certamen.
        </p>
      </div>
    </form>
  )
}
