import type { Metadata } from "next"
import Image from "next/image"
import { Shield, Target, Award } from "lucide-react"

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce a la Fundación de Ajedrez WALFA-CHESS — nuestra historia, misión y visión.",
}

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Header con Escudo */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-16 pb-12 border-b border-slate-200">
        <div className="relative h-36 w-36 sm:h-44 sm:w-44 overflow-hidden rounded-full border-2 border-slate-200 bg-white shadow-md p-1 shrink-0">
          <Image
            src="/images/logo.jpg"
            alt="Fundación WALFA-CHESS"
            fill
            sizes="176px"
            className="object-cover scale-105 rounded-full"
          />
        </div>
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-[#1D64F2] uppercase tracking-wider mb-3">
            Fundación Institucional
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Sobre WALFA-CHESS
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            La Fundación de Ajedrez WALFA-CHESS es una institución comprometida con el desarrollo, profesionalización y masificación del deporte ciencia en la República Dominicana.
          </p>
        </div>
      </div>

      {/* Pilares / Misión & Visión */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
            <Target className="h-6 w-6 text-[#1D64F2]" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Misión</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Organizar torneos del más alto nivel técnico y ético, fomentando el talento ajedrecístico en jóvenes y adultos de todo el país.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
            <Shield className="h-6 w-6 text-[#1D64F2]" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Visión</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Posicionar a la República Dominicana como un referente del ajedrez competitivo en el Caribe y Latinoamérica.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
            <Award className="h-6 w-6 text-[#1D64F2]" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Valores</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Disciplina, excelencia deportiva, juego limpio, inclusión comunitaria y constante superación estratégica.
          </p>
        </div>
      </div>
    </div>
  )
}
