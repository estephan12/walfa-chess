"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail } from "lucide-react"
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/shared/SocialIcons"
import { SITE_NAME } from "@/lib/constants"

export function Footer() {
  const [currentYear, setCurrentYear] = useState(2026)

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="bg-[#081426] text-slate-300 border-t border-slate-800" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="flex flex-col">
            <Link href="/" className="flex items-center gap-3 mb-4 group inline-flex w-fit">
              <div className="relative h-11 w-11 rounded-full overflow-hidden border border-white/20 bg-white/5 flex items-center justify-center p-0.5 shadow">
                <Image
                  src="/images/logo.jpg"
                  alt="Logo WALFA-CHESS"
                  width={44}
                  height={44}
                  className="object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white leading-none">
                  WALFA<span className="text-[#1D64F2]">-</span>CHESS
                </span>
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">
                  FUNDACIÓN DE AJEDREZ
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mt-1">
              Desarrollamos el talento, fortalecemos valores y construimos un mejor futuro a través del ajedrez.
            </p>
          </div>

          {/* Col 2: Enlaces Rápidos */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              ENLACES RÁPIDOS
            </h3>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-medium">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                Inicio
              </Link>
              <Link href="/noticias" className="text-slate-400 hover:text-white transition-colors">
                Noticias
              </Link>
              <Link href="/torneos" className="text-slate-400 hover:text-white transition-colors">
                Torneos
              </Link>
              <Link href="/galeria" className="text-slate-400 hover:text-white transition-colors">
                Galería
              </Link>
              <Link href="/resultados" className="text-slate-400 hover:text-white transition-colors">
                Resultados
              </Link>
              <Link href="/contacto" className="text-slate-400 hover:text-white transition-colors">
                Contacto
              </Link>
              <Link href="/clasificacion" className="text-slate-400 hover:text-white transition-colors">
                Clasificación
              </Link>
              <Link href="/inscripciones" className="text-slate-400 hover:text-[#1D64F2] transition-colors">
                Inscripciones
              </Link>
            </div>
          </div>

          {/* Col 3: Torneos */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              TORNEOS
            </h3>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>
                <Link href="/torneos" className="hover:text-white transition-colors">
                  Calendario
                </Link>
              </li>
              <li>
                <Link href="/torneos" className="hover:text-white transition-colors">
                  Reglamentos
                </Link>
              </li>
              <li>
                <Link href="/torneos" className="hover:text-white transition-colors">
                  Sistema de Competencia
                </Link>
              </li>
              <li>
                <Link href="/torneos" className="hover:text-white transition-colors">
                  Premios
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacto */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              CONTACTO
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#1D64F2] shrink-0 mt-0.5" />
                <span>Santiago de los Caballeros, República Dominicana</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#1D64F2] shrink-0" />
                <a href="tel:8091234567" className="hover:text-white transition-colors">
                  (809) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#1D64F2] shrink-0" />
                <a href="mailto:info@walfa-chess.com" className="hover:text-white transition-colors">
                  info@walfa-chess.com
                </a>
              </li>
            </ul>

            {/* Redes sociales con sus colores característicos */}
            <div className="flex items-center gap-2.5 mt-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-7 h-7 rounded bg-[#1877F2] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-sm"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-7 h-7 rounded bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-sm"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-7 h-7 rounded bg-[#FF0000] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-sm"
              >
                <YoutubeIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Barra inferior de copyright */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {currentYear} {SITE_NAME}. Todos los derechos reservados.</p>
          <p>República Dominicana</p>
        </div>
      </div>
    </footer>
  )
}
