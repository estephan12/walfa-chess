import type { Metadata } from "next"
import { Mail, MapPin, MessageSquare } from "lucide-react"

export const metadata: Metadata = {
  title: "Contacto",
  description: "Canales de contacto oficial de la Fundación WALFA-CHESS.",
}

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#2B5B84] bg-[#132238] px-3.5 py-1 text-xs font-bold text-[#5FA8D3] uppercase tracking-wider mb-3">
          Atención & Soporte
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#F0F4F8] tracking-tight">Contacto Oficial</h1>
        <p className="mt-3 text-base text-[#94A3B8]">
          Estamos a tu disposición para consultas de inscripciones, patrocinios y torneos.
        </p>
      </div>

      <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-8 sm:p-10 shadow-xl space-y-6">
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl bg-[#0B0F19] border border-[#2B5B84] flex items-center justify-center shrink-0">
            <Mail className="h-5 w-5 text-[#5FA8D3]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#F0F4F8]">Correo Electrónico</h2>
            <p className="text-xs text-[#94A3B8] mb-1">Para consultas generales y prensa</p>
            <a
              href="mailto:info@walfachess.com"
              className="text-base font-semibold text-[#5FA8D3] hover:underline"
            >
              info@walfachess.com
            </a>
          </div>
        </div>

        <div className="border-t border-[#2B5B84]/50 pt-6 flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl bg-[#0B0F19] border border-[#2B5B84] flex items-center justify-center shrink-0">
            <MapPin className="h-5 w-5 text-[#5FA8D3]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#F0F4F8]">Sede Principal</h2>
            <p className="text-xs text-[#94A3B8] mb-1">República Dominicana</p>
            <p className="text-sm font-medium text-[#F0F4F8]">
              Santo Domingo, República Dominicana
            </p>
          </div>
        </div>

        <div className="border-t border-[#2B5B84]/50 pt-6 flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl bg-[#0B0F19] border border-[#2B5B84] flex items-center justify-center shrink-0">
            <MessageSquare className="h-5 w-5 text-[#5FA8D3]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#F0F4F8]">Redes Sociales</h2>
            <p className="text-xs text-[#94A3B8] mb-2">Síguenos para avisos de último minuto</p>
            <div className="flex gap-4">
              <a href="#" className="text-sm font-semibold text-[#5FA8D3] hover:underline">Instagram</a>
              <a href="#" className="text-sm font-semibold text-[#5FA8D3] hover:underline">Facebook</a>
              <a href="#" className="text-sm font-semibold text-[#5FA8D3] hover:underline">YouTube</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
