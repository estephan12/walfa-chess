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
  User,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Award,
  Hash,
  Shield,
  Calendar,
  Flag,
  Building2,
  Trash2,
} from "lucide-react"

import { playerSchema, CHESS_TITLES, type PlayerFormData } from "@/lib/schemas/playerSchema"
import {
  createPlayerAction,
  updatePlayerAction,
  uploadPlayerPhotoAction,
} from "@/lib/actions/playerActions"
import { slugify } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Player } from "@/types"

interface PlayerFormProps {
  initialData?: Player | null
  isEditing?: boolean
}

export function PlayerForm({
  initialData,
  isEditing = false,
}: PlayerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialData?.photo_url ?? null
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PlayerFormData>({
    resolver: zodResolver(playerSchema) as any,
    defaultValues: {
      full_name: initialData?.full_name ?? "",
      slug: initialData?.slug ?? "",
      title: initialData?.title ?? "",
      club: initialData?.club ?? "",
      birth_date: initialData?.birth_date ? initialData.birth_date.split("T")[0] : "",
      nationality: initialData?.nationality ?? "DO",
      fide_id: initialData?.fide_id ?? "",
      fide_rating: initialData?.fide_rating ?? ("" as any),
      local_rating: initialData?.local_rating ?? ("" as any),
      photo_url: initialData?.photo_url ?? "",
      bio: initialData?.bio ?? "",
      is_active: initialData?.is_active ?? true,
    },
  })

  const watchedFullName = watch("full_name")

  // Generador automático de slug
  const handleGenerateSlug = () => {
    if (watchedFullName) {
      const generated = slugify(watchedFullName)
      setValue("slug", generated, { shouldValidate: true })
    }
  }

  // Subida de foto
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no debe superar los 5MB.")
      return
    }

    setIsUploading(true)
    setServerError(null)

    const formData = new FormData()
    formData.append("file", file)

    const res = await uploadPlayerPhotoAction(formData)

    if (res.success) {
      setPhotoPreview(res.data)
      setValue("photo_url", res.data, { shouldValidate: true })
    } else {
      setServerError(res.error ?? "Error al subir la fotografía")
    }

    setIsUploading(false)
  }

  const handleRemovePhoto = () => {
    setPhotoPreview(null)
    setValue("photo_url", "", { shouldValidate: true })
  }

  const onSubmit = async (data: PlayerFormData) => {
    setIsSubmitting(true)
    setServerError(null)

    try {
      let res
      if (isEditing && initialData?.id) {
        res = await updatePlayerAction(initialData.id, data)
      } else {
        res = await createPlayerAction(data)
      }

      if (res.success) {
        router.push("/admin/jugadores")
        router.refresh()
      } else {
        setServerError(res.error ?? "Ocurrió un error al guardar el jugador")
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    } catch (err: any) {
      setServerError(err?.message ?? "Error inesperado del servidor")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl">
      {/* Mensaje de error general */}
      {serverError && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 flex items-start gap-3 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-200">Error al procesar:</p>
            <p className="mt-0.5">{serverError}</p>
          </div>
        </div>
      )}

      {/* SECCIÓN 1: Perfil y Fotografía */}
      <div className="bg-[#132238] border border-[#2B5B84]/50 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-[#2B5B84]/40 pb-4">
          <User className="h-5 w-5 text-[#5FA8D3]" />
          <h2 className="text-lg font-bold text-[#F0F4F8]">Perfil del Jugador</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Avatar / Foto */}
          <div className="flex flex-col items-center justify-center p-4 border border-dashed border-[#2B5B84] rounded-2xl bg-[#0B0F19]/40 text-center">
            <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-[#5FA8D3]/50 bg-[#0B0F19] flex items-center justify-center shadow-lg group">
              {photoPreview ? (
                <Image
                  src={photoPreview}
                  alt="Foto del jugador"
                  fill
                  className="object-cover"
                />
              ) : (
                <User className="h-16 w-16 text-[#94A3B8]/40" />
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <Loader2 className="h-7 w-7 animate-spin text-[#5FA8D3]" />
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-2 w-full max-w-[200px]">
              <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#5FA8D3]/20 border border-[#5FA8D3]/40 text-xs font-semibold text-[#5FA8D3] hover:bg-[#5FA8D3]/30 transition-colors">
                <Upload className="h-3.5 w-3.5" />
                <span>{photoPreview ? "Cambiar Foto" : "Subir Foto"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              {photoPreview && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center justify-center gap-1 text-xs text-rose-400 hover:text-rose-300 py-1 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Quitar foto</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-2">JPG, PNG o WEBP (máx. 5MB)</p>
          </div>

          {/* Datos básicos */}
          <div className="md:col-span-2 space-y-4">
            {/* Nombre Completo */}
            <div>
              <label className="block text-sm font-medium text-[#F0F4F8] mb-1.5">
                Nombre Completo <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                {...register("full_name")}
                placeholder="Ej. Ramón Mateo"
                className="w-full bg-[#0B0F19] border border-[#2B5B84] rounded-xl px-4 py-2.5 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#5FA8D3] focus:ring-1 focus:ring-[#5FA8D3] transition-all"
              />
              {errors.full_name && (
                <p className="text-xs text-rose-400 mt-1">{errors.full_name.message}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-[#F0F4F8]">
                  Identificador Slug <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateSlug}
                  className="text-xs text-[#5FA8D3] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Sparkles className="h-3 w-3" />
                  Auto-generar
                </button>
              </div>
              <input
                type="text"
                {...register("slug")}
                placeholder="ej-ramon-mateo"
                className="w-full bg-[#0B0F19] border border-[#2B5B84] rounded-xl px-4 py-2.5 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#5FA8D3] focus:ring-1 focus:ring-[#5FA8D3] transition-all"
              />
              {errors.slug && (
                <p className="text-xs text-rose-400 mt-1">{errors.slug.message}</p>
              )}
            </div>

            {/* Título Oficial y Club */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#F0F4F8] mb-1.5 flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-[#5FA8D3]" />
                  Título Oficial
                </label>
                <select
                  {...register("title")}
                  className="w-full bg-[#0B0F19] border border-[#2B5B84] rounded-xl px-4 py-2.5 text-sm text-[#F0F4F8] focus:outline-none focus:border-[#5FA8D3] focus:ring-1 focus:ring-[#5FA8D3] transition-all"
                >
                  <option value="">Sin título oficial</option>
                  {CHESS_TITLES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#F0F4F8] mb-1.5 flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-[#5FA8D3]" />
                  Club / Asociación
                </label>
                <input
                  type="text"
                  {...register("club")}
                  placeholder="Ej. Club de Ajedrez Walfa"
                  className="w-full bg-[#0B0F19] border border-[#2B5B84] rounded-xl px-4 py-2.5 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#5FA8D3] focus:ring-1 focus:ring-[#5FA8D3] transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: Calificaciones y Datos de Competencia */}
      <div className="bg-[#132238] border border-[#2B5B84]/50 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-[#2B5B84]/40 pb-4">
          <Shield className="h-5 w-5 text-[#5FA8D3]" />
          <h2 className="text-lg font-bold text-[#F0F4F8]">Calificaciones y Clasificación</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* FIDE ID */}
          <div>
            <label className="block text-sm font-medium text-[#F0F4F8] mb-1.5 flex items-center gap-1.5">
              <Hash className="h-4 w-4 text-[#5FA8D3]" />
              FIDE ID
            </label>
            <input
              type="text"
              {...register("fide_id")}
              placeholder="Ej. 6400123"
              className="w-full bg-[#0B0F19] border border-[#2B5B84] rounded-xl px-4 py-2.5 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#5FA8D3] focus:ring-1 focus:ring-[#5FA8D3] transition-all"
            />
            <p className="text-[11px] text-[#94A3B8] mt-1">Código oficial FIDE</p>
          </div>

          {/* Elo FIDE */}
          <div>
            <label className="block text-sm font-medium text-[#F0F4F8] mb-1.5 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-amber-400" />
              Elo FIDE (Estándar)
            </label>
            <input
              type="number"
              min={0}
              max={3200}
              {...register("fide_rating")}
              placeholder="Ej. 2400"
              className="w-full bg-[#0B0F19] border border-[#2B5B84] rounded-xl px-4 py-2.5 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#5FA8D3] focus:ring-1 focus:ring-[#5FA8D3] transition-all"
            />
            <p className="text-[11px] text-[#94A3B8] mt-1">Dejar vacío si no tiene rating</p>
          </div>

          {/* Elo Nacional / Local */}
          <div>
            <label className="block text-sm font-medium text-[#F0F4F8] mb-1.5 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-emerald-400" />
              Elo Nacional / Local
            </label>
            <input
              type="number"
              min={0}
              max={3200}
              {...register("local_rating")}
              placeholder="Ej. 2450"
              className="w-full bg-[#0B0F19] border border-[#2B5B84] rounded-xl px-4 py-2.5 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#5FA8D3] focus:ring-1 focus:ring-[#5FA8D3] transition-all"
            />
            <p className="text-[11px] text-[#94A3B8] mt-1">Rating local / FDA</p>
          </div>
        </div>

        {/* Nacionalidad y Fecha de Nacimiento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block text-sm font-medium text-[#F0F4F8] mb-1.5 flex items-center gap-1.5">
              <Flag className="h-4 w-4 text-[#5FA8D3]" />
              Nacionalidad (Código ISO)
            </label>
            <input
              type="text"
              maxLength={3}
              {...register("nationality")}
              placeholder="DO"
              className="w-full bg-[#0B0F19] border border-[#2B5B84] rounded-xl px-4 py-2.5 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/50 uppercase focus:outline-none focus:border-[#5FA8D3] focus:ring-1 focus:ring-[#5FA8D3] transition-all"
            />
            <p className="text-[11px] text-[#94A3B8] mt-1">Ej. DO (Rep. Dominicana), US, CU, ES</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#F0F4F8] mb-1.5 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-[#5FA8D3]" />
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              {...register("birth_date")}
              className="w-full bg-[#0B0F19] border border-[#2B5B84] rounded-xl px-4 py-2.5 text-sm text-[#F0F4F8] focus:outline-none focus:border-[#5FA8D3] focus:ring-1 focus:ring-[#5FA8D3] transition-all"
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: Biografía y Estado */}
      <div className="bg-[#132238] border border-[#2B5B84]/50 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-[#2B5B84]/40 pb-4">
          <Sparkles className="h-5 w-5 text-[#5FA8D3]" />
          <h2 className="text-lg font-bold text-[#F0F4F8]">Biografía y Trayectoria</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#F0F4F8] mb-1.5">
            Resumen de Trayectoria / Palmarés
          </label>
          <textarea
            {...register("bio")}
            rows={4}
            placeholder="Logros destacados, campeonatos obtenidos, experiencia internacional..."
            className="w-full bg-[#0B0F19] border border-[#2B5B84] rounded-xl px-4 py-2.5 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#5FA8D3] focus:ring-1 focus:ring-[#5FA8D3] transition-all"
          />
        </div>

        {/* Toggle Estado Activo */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#0B0F19]/50 border border-[#2B5B84]/40">
          <div>
            <p className="text-sm font-semibold text-[#F0F4F8]">Jugador Activo en Ranking</p>
            <p className="text-xs text-[#94A3B8]">
              Determina si el jugador aparece en la tabla de clasificación pública.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register("is_active")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#0B0F19] border border-[#2B5B84] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#94A3B8] peer-checked:after:bg-[#0B0F19] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5FA8D3] peer-checked:border-[#5FA8D3]"></div>
          </label>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#2B5B84]/40">
        <Link
          href="/admin/jugadores"
          className="px-5 py-2.5 rounded-xl border border-[#2B5B84] text-sm font-semibold text-[#94A3B8] hover:text-[#F0F4F8] hover:bg-[#132238] transition-colors"
        >
          Cancelar
        </Link>
        <Button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="px-7 py-2.5 rounded-xl bg-[#5FA8D3] hover:bg-[#4A96C2] text-[#0B0F19] font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>{isEditing ? "Actualizar Jugador" : "Registrar Jugador"}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
