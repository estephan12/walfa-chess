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
      <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-12 text-center my-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B0F19] border border-[#2B5B84] mb-4">
          <Images className="h-7 w-7 text-[#5FA8D3]" />
        </div>
        <h3 className="text-lg font-bold text-[#F0F4F8]">Fotografías en preparación</h3>
        <p className="text-sm text-[#94A3B8] mt-1 max-w-md mx-auto">
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
            className="group relative aspect-4/3 cursor-pointer overflow-hidden rounded-2xl border border-[#2B5B84] bg-[#132238] shadow-md transition-all duration-300 hover:border-[#5FA8D3] hover:shadow-xl hover:shadow-[#5FA8D3]/10"
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <div className="flex items-center justify-between w-full text-xs text-[#F0F4F8] font-semibold">
                <span className="truncate pr-2">{img.caption || `Foto #${index + 1}`}</span>
                <div className="rounded-lg bg-[#0B0F19]/80 border border-[#2B5B84] p-1.5 text-[#5FA8D3]">
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
              <span className="rounded-full bg-[#132238] border border-[#2B5B84] px-3 py-1 text-xs font-black text-[#5FA8D3]">
                {selectedIndex + 1} / {images.length}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#94A3B8] hidden sm:inline truncate max-w-md">
                {albumTitle}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={activeImage.url}
                target="_blank"
                rel="noreferrer"
                download
                className="p-2.5 rounded-full bg-[#132238] border border-[#2B5B84] text-[#F0F4F8] hover:text-[#5FA8D3] hover:border-[#5FA8D3] transition-colors"
                title="Descargar o abrir fotografía en alta resolución"
              >
                <Download className="h-5 w-5" />
              </a>
              <button
                type="button"
                onClick={handleClose}
                className="p-2.5 rounded-full bg-[#132238] border border-[#2B5B84] text-[#F0F4F8] hover:text-[#5FA8D3] hover:border-[#5FA8D3] transition-colors"
                title="Cerrar visor (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Botón Anterior */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handlePrev()
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[#132238]/90 border border-[#2B5B84] text-[#F0F4F8] hover:text-[#5FA8D3] hover:border-[#5FA8D3] transition-all shadow-xl hover:scale-110"
            title="Fotografía anterior (Flecha Izquierda)"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Botón Siguiente */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[#132238]/90 border border-[#2B5B84] text-[#F0F4F8] hover:text-[#5FA8D3] hover:border-[#5FA8D3] transition-all shadow-xl hover:scale-110"
            title="Fotografía siguiente (Flecha Derecha)"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Contenedor Central de la Imagen */}
          <div
            className="relative h-[80vh] w-[90vw] max-w-6xl max-h-[80vh] flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-full w-full">
              <Image
                src={activeImage.url}
                alt={activeImage.alt_text || `${albumTitle} - Fotografía`}
                fill
                sizes="(max-width: 1280px) 90vw, 1200px"
                className="object-contain select-none"
                priority
              />
            </div>
          </div>

          {/* Pie de Foto Inferior */}
          {(activeImage.caption || activeImage.alt_text) && (
            <div
              className="absolute bottom-0 inset-x-0 p-4 sm:p-6 text-center z-20 pointer-events-auto bg-gradient-to-t from-black/90 via-black/50 to-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-sm sm:text-base font-medium text-[#F0F4F8] max-w-2xl mx-auto drop-shadow-md">
                {activeImage.caption || activeImage.alt_text}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
