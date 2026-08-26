"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Upload,
  Loader2,
  Newspaper,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Trophy,
  Globe,
} from "lucide-react"

import { newsSchema, type NewsFormData } from "@/lib/schemas/newsSchema"
import {
  createNewsAction,
  updateNewsAction,
  uploadNewsCoverAction,
} from "@/lib/actions/newsActions"
import { slugify } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { RichTextEditor } from "@/components/admin/RichTextEditor"
import type { News } from "@/types"

interface NewsFormProps {
  initialData?: News | null
  isEditing?: boolean
  tournaments?: { id: string; title: string }[]
}

export function NewsForm({
  initialData,
  isEditing = false,
  tournaments = [],
}: NewsFormProps) {
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
    control,
    formState: { errors },
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema) as any,
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      excerpt: initialData?.excerpt ?? "",
      content: initialData?.content ?? "",
      cover_image_url: initialData?.cover_image_url ?? "",
      status: initialData?.status ?? "draft",
      is_featured: initialData?.is_featured ?? false,
      tournament_id: initialData?.tournament_id ?? "",
      meta_title: initialData?.meta_title ?? "",
      meta_description: initialData?.meta_description ?? "",
    },
  })

  // Auto-generación de slug al escribir título en modo creación
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

    const res = await uploadNewsCoverAction(formData)

    if (res.success) {
      setValue("cover_image_url", res.data, { shouldValidate: true })
      setCoverPreview(res.data)
    } else {
      setServerError(res.error)
    }

    setIsUploading(false)
  }

  const onSubmit = async (data: NewsFormData) => {
    setIsSubmitting(true)
    setServerError(null)

    try {
      const res = isEditing && initialData?.id
        ? await updateNewsAction(initialData.id, data)
        : await createNewsAction(data)

      if (res?.success) {
        router.push("/admin/noticias")
        router.refresh()
      } else {
        setServerError(res?.error ?? "Error al procesar la noticia")
        setIsSubmitting(false)
      }
    } catch (err: any) {
      console.error("Error inesperado en onSubmit:", err)
      setServerError(err?.message ?? "Error inesperado de comunicación")
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8 max-w-5xl">
      {/* Barra de cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#2B5B84]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/noticias"
            className="p-2 rounded-xl bg-[#132238] border border-[#2B5B84] text-[#94A3B8] hover:text-[#F0F4F8] hover:border-[#5FA8D3] transition-colors"
            title="Volver a noticias"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#F0F4F8] tracking-tight">
              {isEditing ? "Editar Noticia" : "Nueva Noticia"}
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
              {isEditing
                ? "Actualiza el contenido, portada o estado de publicación"
                : "Redacta un nuevo artículo, crónica o comunicado de prensa"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/noticias">
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
                {isEditing ? "Guardar Cambios" : "Guardar Noticia"}
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

      {/* Sección 1: Información Principal */}
      <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-6 sm:p-8 shadow-xl space-y-6">
        <h2 className="text-lg font-bold text-[#F0F4F8] flex items-center gap-2 border-b border-[#2B5B84]/50 pb-3">
          <Newspaper className="h-5 w-5 text-[#5FA8D3]" />
          Datos del Artículo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Título */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
              Título del Artículo <span className="text-[#5FA8D3]">*</span>
            </label>
            <input
              type="text"
              {...register("title")}
              onChange={handleTitleChange}
              placeholder="Ej: Gran éxito en el Campeonato Nacional WALFA Chess 2026"
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-3 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30"
            />
            {errors.title && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* Slug */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
              Slug / Enlace URL <span className="text-[#5FA8D3]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-xs text-[#94A3B8]">/noticias/</span>
              <input
                type="text"
                {...register("slug")}
                placeholder="campeonato-nacional-walfa-2026"
                className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] pl-20 pr-4 py-3 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30 font-mono"
              />
            </div>
            {errors.slug && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{errors.slug.message}</p>
            )}
          </div>

          {/* Estado de publicación */}
          <div>
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
              Estado de Publicación <span className="text-[#5FA8D3]">*</span>
            </label>
            <select
              {...register("status")}
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-3 text-sm text-[#F0F4F8] focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30"
            >
              <option value="draft">Borrador (Oculto al público)</option>
              <option value="published">Publicado (Visible en el sitio web)</option>
            </select>
          </div>

          {/* Torneo Vinculado (Opcional) */}
          <div>
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-[#5FA8D3]" />
              Torneo Relacionado (Opcional)
            </label>
            <select
              {...register("tournament_id")}
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-3 text-sm text-[#F0F4F8] focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30"
            >
              <option value="">Ninguno / Noticia General</option>
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Noticia Destacada */}
          <div className="md:col-span-2 flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="is_featured"
              {...register("is_featured")}
              className="h-5 w-5 rounded border-[#2B5B84] bg-[#0B0F19] text-[#5FA8D3] focus:ring-[#5FA8D3]"
            />
            <label htmlFor="is_featured" className="text-sm font-bold text-[#F0F4F8] cursor-pointer flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#5FA8D3]" />
              Marcar como Noticia Destacada (Aparecerá en portada del blog)
            </label>
          </div>

          {/* Resumen / Excerpt */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
              Resumen Breve (Aparece en tarjetas y vistas previas)
            </label>
            <textarea
              {...register("excerpt")}
              rows={2}
              placeholder="Breve introducción o resumen para captar la atención de los lectores..."
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-3 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30"
            />
            {errors.excerpt && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{errors.excerpt.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Sección 2: Imagen de Portada */}
      <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-6 sm:p-8 shadow-xl space-y-6">
        <h2 className="text-lg font-bold text-[#F0F4F8] flex items-center gap-2 border-b border-[#2B5B84]/50 pb-3">
          <Upload className="h-5 w-5 text-[#5FA8D3]" />
          Imagen de Portada
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-3">
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider">
              Subir imagen de cabecera (Recomendado: 1200x630 px)
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
                <Newspaper className="h-8 w-8 text-[#2B5B84] mx-auto mb-1" />
                <span className="text-xs text-[#94A3B8]">Sin imagen seleccionada</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sección 3: Editor de Contenido Enriquecido */}
      <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#2B5B84]/50 pb-3">
          <h2 className="text-lg font-bold text-[#F0F4F8] flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-[#5FA8D3]" />
            Cuerpo del Artículo <span className="text-[#5FA8D3]">*</span>
          </h2>
          <span className="text-xs text-[#94A3B8]">Formato enriquecido (TipTap)</span>
        </div>

        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              content={field.value}
              onChange={field.onChange}
              placeholder="Redacta los detalles del evento, partidas clave, premiación y declaraciones..."
            />
          )}
        />
        {errors.content && (
          <p className="text-xs text-rose-400 font-medium">{errors.content.message}</p>
        )}
      </div>

      {/* Sección 4: Metadatos SEO */}
      <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-6 sm:p-8 shadow-xl space-y-6">
        <h2 className="text-lg font-bold text-[#F0F4F8] flex items-center gap-2 border-b border-[#2B5B84]/50 pb-3">
          <Globe className="h-5 w-5 text-[#5FA8D3]" />
          Optimización para Buscadores (SEO Opcional)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
              Meta Título (SEO)
            </label>
            <input
              type="text"
              {...register("meta_title")}
              placeholder="Título optimizado para Google (ej: Torneo Walfa Chess 2026 - Crónica y Ganadores)"
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-3 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:border-[#5FA8D3] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">
              Meta Descripción (SEO)
            </label>
            <input
              type="text"
              {...register("meta_description")}
              placeholder="Descripción breve para motores de búsqueda (máx 160 caracteres)"
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-3 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:border-[#5FA8D3] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Botones finales */}
      <div className="flex justify-end gap-3 pt-4">
        <Link href="/admin/noticias">
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
              {isEditing ? "Guardar Cambios de la Noticia" : "Publicar Noticia"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
