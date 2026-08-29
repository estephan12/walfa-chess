"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Loader2,
  Images,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Trophy,
  Sparkles,
} from "lucide-react"

import { albumSchema, type AlbumFormData } from "@/lib/schemas/gallerySchema"
import { createAlbumAction, updateAlbumAction } from "@/lib/actions/galleryActions"
import { slugify } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { GalleryAlbum } from "@/types"

interface AlbumFormProps {
  initialData?: GalleryAlbum | null
  isEditing?: boolean
  tournaments?: { id: string; title: string }[]
}

export function AlbumForm({
  initialData,
  isEditing = false,
  tournaments = [],
}: AlbumFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AlbumFormData>({
    resolver: zodResolver(albumSchema) as any,
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      cover_image_url: initialData?.cover_image_url ?? "",
      tournament_id: initialData?.tournament_id ?? "",
      is_published: initialData?.is_published ?? false,
      sort_order: initialData?.sort_order ?? 0,
    },
  })

  // Auto-generación de slug al escribir título en modo creación
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleVal = e.target.value
    if (!isEditing) {
      setValue("slug", slugify(titleVal), { shouldValidate: true })
    }
  }

  const onSubmit = async (data: AlbumFormData) => {
    setIsSubmitting(true)
    setServerError(null)

    try {
      if (isEditing && initialData) {
        const result = await updateAlbumAction(initialData.id, data)
        if (!result.success) {
          setServerError(result.error)
          return
        }
        router.push(`/admin/galeria/${initialData.id}`)
      } else {
        const result = await createAlbumAction(data)
        if (!result.success) {
          setServerError(result.error)
          return
        }
        // Redirigir al nuevo álbum para que pueda comenzar a subir fotos de inmediato
        router.push(`/admin/galeria/${result.data.id}`)
      }
      router.refresh()
    } catch (err: any) {
      setServerError(err.message || "Error al procesar la solicitud")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
      {/* Header con botón atrás */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#2B5B84]/50">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/galeria"
            className="p-2 rounded-xl bg-[#132238] border border-[#2B5B84] text-[#94A3B8] hover:text-[#F0F4F8] hover:border-[#5FA8D3] transition-colors"
            title="Volver a la galería"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#F0F4F8] tracking-tight">
              {isEditing ? "Editar Álbum" : "Crear Nuevo Álbum"}
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
              {isEditing
                ? "Modifica los datos del álbum. Podrás gestionar las fotografías más abajo."
                : "Registra los datos básicos del álbum para comenzar a subir fotografías."}
            </p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-[#5FA8D3] hover:bg-[#4A96C2] text-[#0B0F19] font-black shadow-lg shadow-[#5FA8D3]/20"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              {isEditing ? "Guardar Cambios" : "Crear y Subir Fotos"}
            </>
          )}
        </Button>
      </div>

      {serverError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{serverError}</div>
        </div>
      )}

      {/* Tarjeta de Datos Principales */}
      <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-[#F0F4F8] mb-2">
            Título del Álbum *
          </label>
          <input
            id="title"
            type="text"
            {...register("title", { onChange: handleTitleChange })}
            placeholder="Ej: Campeonato Nacional Superior 2024 — Ronda Final"
            className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-2.5 text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:border-[#5FA8D3] focus:outline-none focus:ring-1 focus:ring-[#5FA8D3] text-sm"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-400 font-medium">{errors.title.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="slug" className="block text-sm font-bold text-[#F0F4F8] mb-2">
              Slug / Identificador URL *
            </label>
            <input
              id="slug"
              type="text"
              {...register("slug")}
              placeholder="campeonato-nacional-2024"
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-2.5 text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:border-[#5FA8D3] focus:outline-none focus:ring-1 focus:ring-[#5FA8D3] text-sm font-mono"
            />
            {errors.slug && (
              <p className="mt-1 text-xs text-red-400 font-medium">{errors.slug.message}</p>
            )}
            <p className="mt-1 text-xs text-[#94A3B8]">
              Ruta en la web: /galeria/<strong>slug</strong>
            </p>
          </div>

          <div>
            <label htmlFor="tournament_id" className="block text-sm font-bold text-[#F0F4F8] mb-2">
              Torneo Asociado (Opcional)
            </label>
            <div className="relative">
              <select
                id="tournament_id"
                {...register("tournament_id")}
                className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-2.5 text-[#F0F4F8] focus:border-[#5FA8D3] focus:outline-none focus:ring-1 focus:ring-[#5FA8D3] text-sm"
              >
                <option value="">-- Sin vincular a torneo específico --</option>
                {tournaments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-1 text-xs text-[#94A3B8]">
              Si se vincula, este álbum aparecerá en la página del torneo.
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-bold text-[#F0F4F8] mb-2">
            Descripción o Crónica Fotográfica
          </label>
          <textarea
            id="description"
            rows={3}
            {...register("description")}
            placeholder="Fotografías de las rondas definitorias, podio y ceremonia de clausura celebrada en el Club..."
            className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-2.5 text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:border-[#5FA8D3] focus:outline-none focus:ring-1 focus:ring-[#5FA8D3] text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-[#2B5B84]/40">
          <div>
            <label htmlFor="sort_order" className="block text-sm font-bold text-[#F0F4F8] mb-2">
              Orden de Visualización
            </label>
            <input
              id="sort_order"
              type="number"
              {...register("sort_order")}
              placeholder="0"
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-2.5 text-[#F0F4F8] focus:border-[#5FA8D3] focus:outline-none focus:ring-1 focus:ring-[#5FA8D3] text-sm"
            />
            <p className="mt-1 text-xs text-[#94A3B8]">
              Número menor aparece primero en la galería pública.
            </p>
          </div>

          <div className="flex flex-col justify-center pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("is_published")}
                className="h-5 w-5 rounded border-[#2B5B84] bg-[#0B0F19] text-[#5FA8D3] focus:ring-[#5FA8D3] focus:ring-offset-[#0B0F19]"
              />
              <div>
                <span className="text-sm font-bold text-[#F0F4F8]">
                  Publicar Álbum Inmediatamente
                </span>
                <p className="text-xs text-[#94A3B8]">
                  Si está marcado, será visible en la página pública de Galería.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </form>
  )
}
