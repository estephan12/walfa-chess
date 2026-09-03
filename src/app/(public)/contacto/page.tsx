import type { Metadata } from "next"
import { Mail, MapPin, MessageSquare } from "lucide-react"
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/shared/SocialIcons"

export const metadata: Metadata = {
  title: "Contacto",
  description: "Canales de contacto oficial de la Fundación WALFA-CHESS.",
}

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-[#1D64F2] uppercase tracking-wider mb-3">
          Atención & Soporte
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Contacto Oficial</h1>
        <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto">
          Estamos a tu disposición para consultas de inscripciones, patrocinios y torneos.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm space-y-6">
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Mail className="h-5 w-5 text-[#1D64F2]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Correo Electrónico</h2>
            <p className="text-xs text-slate-500 mb-1">Para consultas generales y prensa</p>
            <a
              href="mailto:info@walfa-chess.com"
              className="text-base font-semibold text-[#1D64F2] hover:underline"
            >
              info@walfa-chess.com
            </a>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <MapPin className="h-5 w-5 text-[#1D64F2]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Sede Principal</h2>
            <p className="text-xs text-slate-500 mb-1">República Dominicana</p>
            <p className="text-sm font-medium text-slate-800">
              Santiago de los Caballeros, República Dominicana
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <MessageSquare className="h-5 w-5 text-[#1D64F2]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Redes Sociales</h2>
            <p className="text-xs text-slate-500 mb-3">Síguenos para avisos de último minuto</p>
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D64F2] hover:underline"
              >
                <FacebookIcon className="h-4 w-4" /> Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E1306C] hover:underline"
              >
                <InstagramIcon className="h-4 w-4" /> Instagram
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF0000] hover:underline"
              >
                <YoutubeIcon className="h-4 w-4" /> YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
