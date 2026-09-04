"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ZoomIn, ChevronLeft, ChevronRight, X, ExternalLink } from "lucide-react"

export interface HomeGalleryImage {
  id: string
  url: string
  alt: string
  albumTitle?: string
  albumSlug?: string
}

interface Props {
  images: HomeGalleryImage[]
}

export function HomeGallerySection({ images }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const activeImage = lightboxIndex !== null ? images[lightboxIndex] : null

  const handlePrev = () => {
    if (lightboxIndex === null) return
    setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : images.length - 1))
  }

  const handleNext = () => {
    if (lightboxIndex === null) return
    setLightboxIndex((prev) => (prev! < images.length - 1 ? prev! + 1 : 0))
  }

  const handleClose = () => {
    setLightboxIndex(null)
  }

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm sm:text-base font-black tracking-wider text-[#0A1931] uppercase">
            GALERÍA DESTACADA
          </h2>
          <span className="text-xs text-slate-500 hidden sm:inline-block">
            Haz clic en cualquier imagen para verla en pantalla completa
          </span>
        </div>

        {/* Grid de Imágenes de Alta Calidad */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((item, index) => (
            <button
              key={item.id || index}
              onClick={() => setLightboxIndex(index)}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200 text-left focus:outline-none focus:ring-2 focus:ring-[#1D64F2]"
            >
              <Image
                src={item.url}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay con lupa en hover */}
              <div className="absolute inset-0 bg-[#0A1931]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center text-white backdrop-blur-[2px]">
                <div className="p-2 rounded-full bg-white/20 border border-white/30 mb-2">
                  <ZoomIn className="h-5 w-5 text-white" />
                </div>
                <p className="text-[11px] font-bold line-clamp-2 leading-tight">
                  {item.alt}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Botón centrado: VER TODA LA GALERÍA */}
        <div className="mt-8 text-center">
          <Link href="/galeria">
            <button className="inline-flex items-center justify-center px-6 py-2.5 rounded border border-[#1D64F2] text-[#1D64F2] hover:bg-[#1D64F2] hover:text-white font-extrabold text-xs uppercase tracking-wider transition-colors duration-200 shadow-sm cursor-pointer">
              VER TODA LA GALERÍA
            </button>
          </Link>
        </div>
      </div>

      {/* LIGHTBOX MODAL PANTALLA COMPLETA */}
      {activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Botón Cerrar */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors cursor-pointer"
            aria-label="Cerrar visor"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Flecha Anterior */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handlePrev()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors cursor-pointer"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Flecha Siguiente */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors cursor-pointer"
              aria-label="Foto siguiente"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Contenedor de la Imagen */}
          <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full h-[70vh] sm:h-[75vh]">
              <Image
                src={activeImage.url}
                alt={activeImage.alt}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-contain"
              />
            </div>

            {/* Pie de foto / Información del Álbum */}
            <div className="mt-4 text-center max-w-xl text-white space-y-2">
              <p className="text-sm sm:text-base font-semibold text-slate-100">
                {activeImage.alt}
              </p>
              {activeImage.albumSlug && (
                <Link
                  href={`/galeria/${activeImage.albumSlug}`}
                  className="inline-flex items-center gap-1.5 text-xs text-[#5FA8D3] hover:underline font-bold"
                >
                  <span>Ver álbum completo: {activeImage.albumTitle}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}
              <p className="text-xs text-slate-400">
                {lightboxIndex! + 1} de {images.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
