"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Maximize2,
  Images,
} from "lucide-react"
import type { GalleryImage } from "@/types"

interface GalleryLightboxProps {
  images: GalleryImage[]
  albumTitle: string
}

export function GalleryLightbox({ images, albumTitle }: GalleryLightboxProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const activeImage = selectedIndex !== null ? images[selectedIndex] : null

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return
    setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : images.length - 1))
  }, [selectedIndex, images.length])

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return
    setSelectedIndex((prev) => (prev! < images.length - 1 ? prev! + 1 : 0))
  }, [selectedIndex, images.length])

  const handleClose = useCallback(() => {
    setSelectedIndex(null)
  }, [])

  // Atajos de teclado: Flecha izquierda, Flecha derecha, Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return

      if (e.key === "Escape") {
        handleClose()
      } else if (e.key === "ArrowLeft") {
        handlePrev()
      } else if (e.key === "ArrowRight") {
        handleNext()
      }
    }

    if (selectedIndex !== null) {
      window.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [selectedIndex, handlePrev, handleNext, handleClose])

  if (images.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center my-8 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 mb-4">
          <Images className="h-7 w-7 text-[#1D64F2]" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Fotografías en preparación</h3>
        <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
          La cobertura audiovisual de este evento está en proceso de edición y clasificación. Vuelve a consultar pronto.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Cuadrícula de Fotografías */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {images.map((img, index) => (
          <div
            key={img.id}
            onClick={() => setSelectedIndex(index)}
            className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#1D64F2]/50"
          >
            <Image
              src={img.url}
              alt={img.alt_text || `${albumTitle} - Foto ${index + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {/* Overlay sutil al hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <div className="flex items-center justify-between w-full text-xs text-white font-semibold">
                <span className="truncate pr-2">{img.caption || `Foto #${index + 1}`}</span>
                <div className="rounded-lg bg-black/60 border border-white/20 p-1.5 text-white">
                  <Maximize2 className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Lightbox a Pantalla Completa */}
      {selectedIndex !== null && activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visor de fotografía"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-all animate-in fade-in duration-200"
          onClick={handleClose}
        >
          {/* Barra Superior de Control */}
          <div
            className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between z-20 pointer-events-auto bg-gradient-to-b from-black/80 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-bold text-white">
                {selectedIndex + 1} / {images.length}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-300 hidden sm:inline truncate max-w-md">
                {albumTitle}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={activeImage.url}
                target="_blank"
                rel="noreferrer"
                download
                className="p-2.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
                title="Descargar o abrir fotografía en alta resolución"
              >
                <Download className="h-5 w-5" />
              </a>
              <button
                type="button"
                onClick={handleClose}
                className="p-2.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
                title="Cerrar visor (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Botones de Navegación Lateral */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Fotografía anterior"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrev()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-slate-800/80 border border-slate-700 p-3 text-white hover:bg-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-[#1D64F2]"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                aria-label="Fotografía siguiente"
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-slate-800/80 border border-slate-700 p-3 text-white hover:bg-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-[#1D64F2]"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Contenedor Central de la Imagen */}
          <div
            className="relative h-[80vh] w-[90vw] sm:w-[85vw] max-w-6xl flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage.url}
              alt={activeImage.alt_text || `${albumTitle} - Vista ampliada`}
              fill
              className="object-contain select-none"
              priority
            />
          </div>

          {/* Pie de foto / Epígrafe */}
          {activeImage.caption && (
            <div
              className="absolute bottom-0 inset-x-0 p-4 sm:p-6 text-center z-20 pointer-events-auto bg-gradient-to-t from-black/80 to-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl mx-auto line-clamp-2">
                {activeImage.caption}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
