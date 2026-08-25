import type { Metadata } from "next"
import { Trophy, CheckCircle, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Inscripciones",
  description: "Inscríbete en los torneos oficiales de la Fundación WALFA CHESS.",
}

export default function InscripcionesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#2B5B84] bg-[#132238] px-3.5 py-1 text-xs font-bold text-[#5FA8D3] uppercase tracking-wider mb-3">
          Registro Oficial
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#F0F4F8] tracking-tight">Inscripciones a Torneos</h1>
        <p className="mt-3 text-base text-[#94A3B8]">
          Formulario de registro para los torneos y competencias de la Fundación WALFA CHESS.
        </p>
      </div>

      <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-8 sm:p-10 shadow-xl text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B0F19] border border-[#2B5B84]">
          <Clock className="h-7 w-7 text-[#5FA8D3]" />
        </div>
        <h2 className="text-xl font-bold text-[#F0F4F8]">Próxima apertura de inscripciones</h2>
        <p className="mt-2 text-sm text-[#94A3B8] max-w-md mx-auto">
          Los formularios de inscripción para el próximo evento se habilitarán en cuanto se publique la convocatoria oficial.
        </p>
        
        <div className="mt-8 pt-6 border-t border-[#2B5B84]/50 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="p-4 rounded-xl bg-[#0B0F19]/50 border border-[#2B5B84]/40 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-[#5FA8D3] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#F0F4F8]">Categorías Abiertas</p>
              <p className="text-[11px] text-[#94A3B8]">Sub-14, Sub-18, Abierto y Máster</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#0B0F19]/50 border border-[#2B5B84]/40 flex items-start gap-3">
            <Trophy className="h-5 w-5 text-[#5FA8D3] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#F0F4F8]">Premios Oficiales</p>
              <p className="text-[11px] text-[#94A3B8]">Trofeos, medallas y premios en metálico</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
