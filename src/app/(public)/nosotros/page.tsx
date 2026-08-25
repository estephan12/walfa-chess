import type { Metadata } from "next"
import Image from "next/image"
import { Shield, Target, Award, Heart } from "lucide-react"

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce a la Fundación de Ajedrez WALFA CHESS — nuestra historia, misión y visión.",
}

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header con Escudo */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-16 pb-12 border-b border-[#2B5B84]/50">
        <div className="relative h-36 w-36 sm:h-44 sm:w-44 overflow-hidden rounded-full border-2 border-[#2B5B84] bg-[#132238] shadow-2xl p-1 shrink-0">
          <Image
            src="/images/logo.jpg"
            alt="Fundación WALFA CHESS"
            fill
            sizes="176px"
            className="object-cover scale-105"
          />
        </div>
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2B5B84] bg-[#132238] px-3.5 py-1 text-xs font-bold text-[#5FA8D3] uppercase tracking-wider mb-3">
            Fundación Institucional
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#F0F4F8] tracking-tight">
            Sobre WALFA CHESS
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            La Fundación de Ajedrez WALFA CHESS es una institución comprometida con el desarrollo, profesionalización y masificación del deporte ciencia en la República Dominicana.
          </p>
        </div>
      </div>

      {/* Pilares / Misión & Visión */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-8 shadow-lg">
          <div className="h-12 w-12 rounded-xl bg-[#0B0F19] border border-[#2B5B84] flex items-center justify-center mb-5">
            <Target className="h-6 w-6 text-[#5FA8D3]" />
          </div>
          <h2 className="text-xl font-bold text-[#F0F4F8] mb-2">Misión</h2>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Organizar torneos del más alto nivel técnico y ético, fomentando el talento ajedrecístico en jóvenes y adultos de todo el país.
          </p>
        </div>

        <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-8 shadow-lg">
          <div className="h-12 w-12 rounded-xl bg-[#0B0F19] border border-[#2B5B84] flex items-center justify-center mb-5">
            <Shield className="h-6 w-6 text-[#5FA8D3]" />
          </div>
          <h2 className="text-xl font-bold text-[#F0F4F8] mb-2">Visión</h2>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Posicionar a la República Dominicana como un referente del ajedrez competitivo en el Caribe y Latinoamérica.
          </p>
        </div>

        <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-8 shadow-lg">
          <div className="h-12 w-12 rounded-xl bg-[#0B0F19] border border-[#2B5B84] flex items-center justify-center mb-5">
            <Award className="h-6 w-6 text-[#5FA8D3]" />
          </div>
          <h2 className="text-xl font-bold text-[#F0F4F8] mb-2">Valores</h2>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Disciplina, excelencia deportiva, juego limpio, inclusión comunitaria y constante superación estratégica.
          </p>
        </div>
      </div>

    </div>
  )
}
