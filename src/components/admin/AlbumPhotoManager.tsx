"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Upload,
  Loader2,
  Trash2,
  Star,
  CheckCircle2,
  AlertCircle,
  Images,
  ExternalLink,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  uploadAlbumPhotoAction,
  deleteAlbumImageAction,
  setAlbumCoverAction,
} from "@/lib/actions/galleryActions"
import type { GalleryImage } from "@/types"

interface AlbumPhotoManagerProps {
  albumId: string
  coverImageUrl?: string | null
  initialImages: GalleryImage[]
}

export function AlbumPhotoManager({
  albumId,
  coverImageUrl,
  initialImages = [],
}: AlbumPhotoManagerProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [images, setImages] = useState<GalleryImage[]>(initialImages)
  const [currentCover, setCurrentCover] = useState<string | null>(coverImageUrl ?? null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setFeedback(null)
    const fileList = Array.from(files)
    setUploadProgress({ current: 0, total: fileList.length })

    let successCount = 0
    let lastUploadedCover: string | null = null

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      const formData = new FormData()
      formData.append("file", file)
      formData.append("alt_text", file.name.replace(/\.[^/.]+$/, ""))

      try {
        const res = await uploadAlbumPhotoAction(albumId, formData)
        if (res.success && res.data) {
          successCount++
          setImages((prev) => [res.data, ...prev])
          if (!currentCover && !lastUploadedCover) {
            lastUploadedCover = res.data.url
          }
        }
      } catch (err) {
        console.error("Error subiendo foto:", err)
      }

      setUploadProgress({ current: i + 1, total: fileList.length })
    }

    if (lastUploadedCover) {
      setCurrentCover(lastUploadedCover)
    }

    setIsUploading(false)
    setUploadProgress(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    setFeedback({
      type: "success",
      message: `Se subieron ${successCount} de ${fileList.length} fotografías correctamente.`,
    })
    router.refresh()
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta fotografía de forma permanente?")) return

    setActionLoadingId(imageId)
    setFeedback(null)

    try {
      const res = await deleteAlbumImageAction(albumId, imageId)
      if (res.success) {
        setImages((prev) => prev.filter((img) => img.id !== imageId))
        setFeedback({ type: "success", message: "Fotografía eliminada correctamente." })
        router.refresh()
      } else {
        setFeedback({ type: "error", message: res.error })
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Error al eliminar" })
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleSetCover = async (imageUrl: string) => {
    setActionLoadingId(imageUrl)
    setFeedback(null)

    try {
      const res = await setAlbumCoverAction(albumId, imageUrl)
      if (res.success) {
        setCurrentCover(imageUrl)
        setFeedback({ type: "success", message: "Portada del álbum actualizada con éxito." })
        router.refresh()
      } else {
        setFeedback({ type: "error", message: res.error })
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Error al fijar portada" })
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm font-medium ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100 uppercase font-bold"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Zona de Subida de Fotos */}
      <div className="rounded-2xl border-2 border-dashed border-[#2B5B84] bg-[#132238]/60 p-8 text-center transition-colors hover:border-[#5FA8D3]">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFilesSelected}
          className="hidden"
          id="album-photos-upload"
          disabled={isUploading}
        />

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B0F19] border border-[#2B5B84] mb-4">
          {isUploading ? (
            <Loader2 className="h-7 w-7 text-[#5FA8D3] animate-spin" />
          ) : (
            <Upload className="h-7 w-7 text-[#5FA8D3]" />
          )}
        </div>

        <h3 className="text-base font-bold text-[#F0F4F8]">
          {isUploading
            ? `Subiendo fotografías (${uploadProgress?.current}/${uploadProgress?.total})...`
            : "Sube fotografías al álbum"}
        </h3>
        <p className="text-xs text-[#94A3B8] mt-1 max-w-md mx-auto">
          Selecciona una o múltiples imágenes (JPG, PNG, WEBP — máx 15MB cada una). Las fotos se guardan automáticamente en la nube.
        </p>

        <div className="mt-5 flex items-center justify-center gap-3">
          <Button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#5FA8D3] hover:bg-[#4A96C2] text-[#0B0F19] font-black text-sm px-6"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando archivos...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Seleccionar Fotos
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Barra de Estadísticas de Fotos */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <Images className="h-5 w-5 text-[#5FA8D3]" />
          <h2 className="text-lg font-bold text-[#F0F4F8]">Fotografías del Álbum</h2>
          <span className="rounded-full bg-[#0B0F19] border border-[#2B5B84] px-2.5 py-0.5 text-xs font-black text-[#5FA8D3]">
            {images.length}
          </span>
        </div>
      </div>

      {/* Cuadrícula de Fotografías */}
      {images.length === 0 ? (
        <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-12 text-center">
          <p className="text-sm text-[#94A3B8]">
            Este álbum aún no tiene fotografías. Utiliza el botón superior para cargar la primera foto.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => {
            const isCover = currentCover === img.url
            const isLoadingThis = actionLoadingId === img.id || actionLoadingId === img.url

            return (
              <div
                key={img.id}
                className={`group relative rounded-2xl overflow-hidden border bg-[#0B0F19] transition-all shadow-md ${
                  isCover
                    ? "border-[#5FA8D3] ring-2 ring-[#5FA8D3]/50"
                    : "border-[#2B5B84] hover:border-[#5FA8D3]"
                }`}
              >
                {/* Imagen */}
                <div className="relative aspect-square w-full overflow-hidden bg-[#0B0F19]">
                  <Image
                    src={img.url}
                    alt={img.alt_text || "Foto de galería"}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Badge de Portada */}
                  {isCover && (
                    <div className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 rounded-md bg-[#5FA8D3] px-2 py-1 text-[11px] font-black text-[#0B0F19] shadow-md">
                      <Star className="h-3 w-3 fill-[#0B0F19]" />
                      Portada
                    </div>
                  )}

                  {/* Overlay con Acciones al Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 z-10">
                    <div className="flex justify-end gap-1.5">
                      <a
                        href={img.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-[#132238]/90 text-[#F0F4F8] hover:text-[#5FA8D3] transition-colors"
                        title="Ver imagen en tamaño completo"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>

                    <div className="flex items-center gap-2 justify-between">
                      {!isCover && (
                        <button
                          type="button"
                          disabled={isLoadingThis}
                          onClick={() => handleSetCover(img.url)}
                          className="px-2.5 py-1 rounded-lg bg-[#5FA8D3] text-[#0B0F19] text-xs font-black hover:bg-[#4A96C2] transition-colors inline-flex items-center gap-1"
                          title="Fijar esta imagen como portada del álbum"
                        >
                          <Star className="h-3 w-3" />
                          Portada
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={isLoadingThis}
                        onClick={() => handleDeleteImage(img.id)}
                        className="p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-600 transition-colors ml-auto"
                        title="Eliminar fotografía"
                      >
                        {isLoadingThis ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
