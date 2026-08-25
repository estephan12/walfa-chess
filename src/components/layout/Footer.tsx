"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Mail } from "lucide-react"
import { SITE_NAME, PUBLIC_NAV_LINKS } from "@/lib/constants"

export function Footer() {
  const [year, setYear] = useState(2026)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="border-t border-[#2B5B84] bg-[#132238] text-[#F0F4F8]" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[#2B5B84] bg-[#0B0F19]">
                <Image
                  src="/images/logo.jpg"
                  alt="Logo WALFA CHESS"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold tracking-wider text-[#94A3B8] uppercase">
                  Fundación de Ajedrez
                </span>
                <span className="text-base font-black tracking-tight text-[#F0F4F8] leading-tight">
                  WALFA <span className="text-[#5FA8D3]">★</span> CHESS
                </span>
              </div>
            </Link>
            <p className="text-[#94A3B8] text-sm leading-relaxed">
              Plataforma oficial de la Fundación de Ajedrez WALFA CHESS. Impulsando el ajedrez competitivo y formativo en República Dominicana.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-bold text-[#F0F4F8] uppercase tracking-wider mb-4">
              Navegación
            </h3>
            <ul className="space-y-2.5" role="list">
              {PUBLIC_NAV_LINKS.slice(0, 4).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#94A3B8] hover:text-[#5FA8D3] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5FA8D3] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#F0F4F8] uppercase tracking-wider mb-4">
              Institucional
            </h3>
            <ul className="space-y-2.5" role="list">
              {PUBLIC_NAV_LINKS.slice(4).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#94A3B8] hover:text-[#5FA8D3] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5FA8D3] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/inscripciones"
                  className="text-sm font-semibold text-[#5FA8D3] hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5FA8D3] rounded"
                >
                  Inscripciones Abiertas →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-sm font-bold text-[#F0F4F8] uppercase tracking-wider mb-4">
              Contacto
            </h3>
            <ul className="space-y-2.5" role="list">
              <li>
                <a
                  href="mailto:info@walfachess.com"
                  className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#5FA8D3] transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0 text-[#5FA8D3]" aria-hidden="true" />
                  info@walfachess.com
                </a>
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram de WALFA CHESS"
                className="text-xs font-semibold text-[#94A3B8] hover:text-[#5FA8D3] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5FA8D3] rounded"
              >
                Instagram
              </a>
              <span className="text-[#2B5B84]" aria-hidden="true">·</span>
              <a
                href="#"
                aria-label="Facebook de WALFA CHESS"
                className="text-xs font-semibold text-[#94A3B8] hover:text-[#5FA8D3] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5FA8D3] rounded"
              >
                Facebook
              </a>
              <span className="text-[#2B5B84]" aria-hidden="true">·</span>
              <a
                href="#"
                aria-label="YouTube de WALFA CHESS"
                className="text-xs font-semibold text-[#94A3B8] hover:text-[#5FA8D3] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5FA8D3] rounded"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-[#2B5B84] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#94A3B8]">
            &copy; {year} {SITE_NAME}. Todos los derechos reservados.
          </p>
          <p className="text-xs text-[#94A3B8]">
            República Dominicana
          </p>
        </div>
      </div>
    </footer>
  )
}
