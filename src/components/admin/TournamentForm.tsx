"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Upload,
  Loader2,
  Calendar,
  MapPin,
  Trophy,
  Clock,
  Users,
  DollarSign,
  FileText,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

import { tournamentSchema, type TournamentFormData } from "@/lib/schemas/tournamentSchema"
import {
  createTournamentAction,
  updateTournamentAction,
  uploadTournamentCoverAction,
} from "@/lib/actions/tournamentActions"
import { slugify } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Tournament } from "@/types"

interface TournamentFormProps {
  initialData?: Tournament | null
  isEditing?: boolean
}

export function TournamentForm({ initialData, isEditing = false }: TournamentFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initialData?.cover_image_url ?? null
  )

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentSchema) as any,
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      type: initialData?.type ?? "open",
      status: initialData?.status ?? "draft",
      description: initialData?.description ?? "",
      content: initialData?.content ?? "",
      cover_image_url: initialData?.cover_image_url ?? "",
      location: initialData?.location ?? "",
      location_maps_url: initialData?.location_maps_url ?? "",
      start_date: initialData?.start_date ? initialData.start_date.split("T")[0] : "",
      end_date: initialData?.end_date ? initialData.end_date.split("T")[0] : "",
      registration_deadline: initialData?.registration_deadline
        ? initialData.registration_deadline.split("T")[0]
        : "",
      max_participants: initialData?.max_participants ?? null,
      entry_fee: initialData?.entry_fee ?? 0,
      prize_pool: initialData?.prize_pool ?? "",
      time_control: initialData?.time_control ?? "15 min + 10 seg",
      rounds: initialData?.rounds ?? 5,
      inscription_type: initialData?.inscription_type ?? "form",
      inscription_url: initialData?.inscription_url ?? "",
      organizer_name: initialData?.organizer_name ?? "Fundación WALFA CHESS",
      organizer_contact: initialData?.organizer_contact ?? "info@walfachess.com",
      is_featured: initialData?.is_featured ?? false,
    },
  })

  // Auto-generación de slug al escribir título si es creación
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleVal = e.target.value
    setValue("title", titleVal)
    if (!isEditing) {
      setValue("slug", slugify(titleVal), { shouldValidate: true })
    }
  }

  // Manejador de subida de imagen de portada
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setServerError(null)

    const formData = new FormData()
    formData.append("file", file)

    const res = await uploadTournamentCoverAction(formData)

    if (res.success) {
      setValue("cover_image_url", res.data, { shouldValidate: true })
      setCoverPreview(res.data)
    } else {
      setServerError(res.error)
    }

    setIsUploading(false)
  }

  const onSubmit = async (data: TournamentFormData) => {
    setIsSubmitting(true)
    setServerError(null)

    const res = isEditing && initialData?.id
      ? await updateTournamentAction(initialData.id, data)
      : await createTournamentAction(data)

    if (res.success) {
      router.push("/admin/torneos")
      router.refresh()
    } else {
      setServerError(res.error)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8 max-w-5xl">
      {/* Barra de cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#2B5B84]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/torneos"
            className="p-2 rounded-xl bg-[#132238] border border-[#2B5B84] text-[#94A3B8] hover:text-[#F0F4F8] hover:border-[#5FA8D3] transition-colors"
            title="Volver a torneos"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#F0F4F8] tracking-tight">
              {isEditing ? "Editar Torneo" : "Crear Nuevo Torneo"}
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
              {isEditing
                ? "Actualiza las bases, fechas y estado del torneo"
                : "Completa los datos oficiales para publicar el evento"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/torneos">
            <Button
              type="button"
              variant="secondary"
              className="bg-[#132238] border border-[#2B5B84] text-[#F0F4F8] hover:bg-[#1a2d4a]"
            >
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-black shadow-md shadow-[#5FA8D3]/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                {isEditing ? "Guardar Cambios" : "Publicar Torneo"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Banner de error del servidor */}
      {serverError && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 flex items-start gap-3 text-rose-200 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-rose-400" />
          <div>
            <p className="font-bold">Error al procesar:</p>
            <p>{serverError}</p>
          </div>
        </div>
      )}

      {/* Sección 1: Información Básica */}
      <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-6 sm:p-8 shadow-xl space-y-6">
        <h2 className="text-lg font-bold text-[#F0F4F8] flex items-center gap-2 border-b border-[#2B5B84]/50 pb-3">
          <Trophy className="h-5 w-5 text-[#5FA8D3]" />
          Información Principal
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Título */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
              Título del Torneo <span className="text-[#5FA8D3]">*</span>
            </label>
            <input
              type="text"
              {...register("title")}
              onChange={handleTitleChange}
              placeholder="Ej: I Gran Abierto Nacional de Ajedrez WALFA 2026"
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-3 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30"
            />
            {errors.title && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
              Slug / Enlace URL <span className="text-[#5FA8D3]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-xs text-[#94A3B8]">/torneos/</span>
              <input
                type="text"
                {...register("slug")}
                placeholder="gran-abierto-walfa-2026"
                className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] pl-20 pr-4 py-3 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30 font-mono"
              />
            </div>
            {errors.slug && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{errors.slug.message}</p>
            )}
          </div>

          {/* Tipo de Torneo */}
          <div>
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
              Ritmo / Modalidad <span className="text-[#5FA8D3]">*</span>
            </label>
            <select
              {...register("type")}
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-3 text-sm text-[#F0F4F8] focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30"
            >
              <option value="open">Abierto (Open)</option>
              <option value="blitz">Blitz (Relámpago)</option>
              <option value="rapid">Rápidas (Rapid)</option>
              <option value="classical">Clásicas (Standard)</option>
              <option value="invitational">Por Invitación</option>
              <option value="simultaneous">Simultáneas</option>
              <option value="online">Online</option>
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
              Estado de Publicación <span className="text-[#5FA8D3]">*</span>
            </label>
            <select
              {...register("status")}
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-3 text-sm text-[#F0F4F8] focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30"
            >
              <option value="draft">Borrador (Solo visible en admin)</option>
              <option value="published">Publicado (Visible al público con inscripción)</option>
              <option value="ongoing">En Curso (Torneo activo hoy)</option>
              <option value="finished">Finalizado (Resultados completados)</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          {/* Modalidad de Inscripción */}
          <div>
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
              Tipo de Inscripción <span className="text-[#5FA8D3]">*</span>
            </label>
            <select
              {...register("inscription_type")}
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-3 text-sm text-[#F0F4F8] focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30"
            >
              <option value="form">Formulario Directo en la Web</option>
              <option value="external">Enlace Externo (Google Forms / Chess-Results)</option>
              <option value="closed">Inscripciones Cerradas</option>
            </select>
          </div>

          {/* Torneo Destacado */}
          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="is_featured"
              {...register("is_featured")}
              className="h-5 w-5 rounded border-[#2B5B84] bg-[#0B0F19] text-[#5FA8D3] focus:ring-[#5FA8D3]"
            />
            <label htmlFor="is_featured" className="text-sm font-bold text-[#F0F4F8] cursor-pointer">
              Marcar como Torneo Destacado (Aparecerá en portada)
            </label>
          </div>

          {/* Descripción breve */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
              Resumen Breve (Aparece en tarjetas y vistas previas)
            </label>
            <textarea
              {...register("description")}
              rows={2}
              placeholder="Breve resumen del torneo, requisitos de participación y objetivos del evento..."
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-3 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30"
            />
          </div>
        </div>
      </div>

      {/* Sección 2: Imagen de Portada */}
      <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-6 sm:p-8 shadow-xl space-y-6">
        <h2 className="text-lg font-bold text-[#F0F4F8] flex items-center gap-2 border-b border-[#2B5B84]/50 pb-3">
          <Upload className="h-5 w-5 text-[#5FA8D3]" />
          Banner / Portada del Torneo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-3">
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider">
              Subir imagen oficial (Recomendado: 1200x630 px)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              disabled={isUploading}
              className="w-full text-sm text-[#94A3B8] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border file:border-[#2B5B84] file:text-xs file:font-bold file:bg-[#0B0F19] file:text-[#5FA8D3] hover:file:bg-[#1a2d4a] cursor-pointer"
            />
            {isUploading && (
              <p className="text-xs text-[#5FA8D3] flex items-center gap-1.5 font-medium">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Subiendo imagen a Supabase Storage...
              </p>
            )}

            <div className="pt-2">
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                O ingresa una URL directa de imagen
              </label>
              <input
                type="url"
                {...register("cover_image_url")}
                onChange={(e) => setCoverPreview(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-2.5 text-xs text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:border-[#5FA8D3] focus:outline-none"
              />
            </div>
          </div>

          {/* Vista previa */}
          <div className="relative aspect-video rounded-xl border border-[#2B5B84] bg-[#0B0F19] overflow-hidden flex items-center justify-center">
            {coverPreview ? (
              <Image
                src={coverPreview}
                alt="Vista previa de portada"
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover"
              />
            ) : (
              <div className="text-center p-4">
                <Trophy className="h-8 w-8 text-[#2B5B84] mx-auto mb-1" />
                <span className="text-xs text-[#94A3B8]">Sin imagen seleccionada</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sección 3: Fechas y Ubicación */}
      <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-6 sm:p-8 shadow-xl space-y-6">
        <h2 className="text-lg font-bold text-[#F0F4F8] flex items-center gap-2 border-b border-[#2B5B84]/50 pb-3">
          <Calendar className="h-5 w-5 text-[#5FA8D3]" />
          Fechas y Sede del Evento
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
              Fecha de Inicio <span className="text-[#5FA8D3]">*</span>
            </label>
            <input
              type="date"
              {...register("start_date")}
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-3 text-sm text-[#F0F4F8] focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30"
            />
            {errors.start_date && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{errors.start_date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
              Fecha de Finalización
            </label>
            <input
              type="date"
              {...register("end_date")}
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-3 text-sm text-[#F0F4F8] focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
              Cierre de Inscripciones
            </label>
            <input
              type="date"
              {...register("registration_deadline")}
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-3 text-sm text-[#F0F4F8] focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
              Lugar / Sede Física
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-[#5FA8D3]" />
              <input
                type="text"
                {...register("location")}
                placeholder="Ej: Salón de Eventos del Club Náutico, Santo Domingo"
                className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] pl-11 pr-4 py-3 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
              Enlace de Google Maps
            </label>
            <input
              type="url"
              {...register("location_maps_url")}
              placeholder="https://maps.app.goo.gl/..."
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-3 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30"
            />
          </div>
        </div>
      </div>

      {/* Sección 4: Especificaciones Técnicas y Premios */}
      <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-6 sm:p-8 shadow-xl space-y-6">
        <h2 className="text-lg font-bold text-[#F0F4F8] flex items-center gap-2 border-b border-[#2B5B84]/50 pb-3">
          <Clock className="h-5 w-5 text-[#5FA8D3]" />
          Reglas Técnicas, Cupos & Premiación
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
              Ritmo de Tiempo
            </label>
            <input
              type="text"
              {...register("time_control")}
              placeholder="Ej: 90 min + 30 seg incremento"
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-3 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
              Número de Rondas
            </label>
            <input
              type="number"
              {...register("rounds")}
              placeholder="5"
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-3 text-sm text-[#F0F4F8] focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
              Límite de Participantes
            </label>
            <input
              type="number"
              {...register("max_participants")}
              placeholder="Ej: 64"
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-3 text-sm text-[#F0F4F8] focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
              Costo de Inscripción (DOP)
            </label>
            <input
              type="number"
              {...register("entry_fee")}
              placeholder="0 (Gratis) o ej: 500"
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-3 text-sm text-[#F0F4F8] focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
              Bolsa de Premios / Trofeos
            </label>
            <input
              type="text"
              {...register("prize_pool")}
              placeholder="Ej: RD$ 50,000 en premios + Trofeos para los primeros 3 lugares"
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-3 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30"
            />
          </div>
        </div>
      </div>

      {/* Sección 5: Bases Completas del Torneo */}
      <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-6 sm:p-8 shadow-xl space-y-6">
        <h2 className="text-lg font-bold text-[#F0F4F8] flex items-center gap-2 border-b border-[#2B5B84]/50 pb-3">
          <FileText className="h-5 w-5 text-[#5FA8D3]" />
          Bases y Reglamento Oficial
        </h2>

        <div>
          <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
            Contenido detallado (Sistema de desempate, horarios por ronda, arbitraje, etc.)
          </label>
          <textarea
            {...register("content")}
            rows={8}
            placeholder="1. SISTEMA DE JUEGO: Suizo a 5 rondas...&#10;2. DESEMPATES: Buchholz, Sonneborm-Berger...&#10;3. HORARIOS: Ronda 1 (9:00 AM)..."
            className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] p-4 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30 font-mono leading-relaxed"
          />
        </div>
      </div>

      {/* Botones finales */}
      <div className="flex justify-end gap-3 pt-4">
        <Link href="/admin/torneos">
          <Button
            type="button"
            variant="secondary"
            className="bg-[#132238] border border-[#2B5B84] text-[#F0F4F8] hover:bg-[#1a2d4a]"
          >
            Cancelar
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-black shadow-lg shadow-[#5FA8D3]/20"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              {isEditing ? "Guardar Cambios del Torneo" : "Publicar Torneo Oficial"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
