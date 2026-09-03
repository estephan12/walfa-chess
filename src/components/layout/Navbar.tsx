"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Menu,
  X,
  MapPin,
  Mail,
  ChevronDown,
} from "lucide-react"
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/shared/SocialIcons"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "INICIO" },
    { href: "/torneos", label: "TORNEOS", hasDropdown: true },
    { href: "/resultados", label: "RESULTADOS", hasDropdown: true },
    { href: "/clasificacion", label: "CLASIFICACIÓN" },
    { href: "/noticias", label: "NOTICIAS" },
    { href: "/galeria", label: "GALERÍA" },
    { href: "/contacto", label: "CONTACTO" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* ─── Top Contact & Social Bar ─── */}
      <div className="bg-[#061224] text-[#CBD5E1] border-b border-white/10 text-xs py-2 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="h-3.5 w-3.5 text-[#1D64F2] shrink-0" />
              <span>Santiago de los Caballeros, Rep. Dom.</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <Mail className="h-3.5 w-3.5 text-[#1D64F2] shrink-0" />
              <a
                href="mailto:info@walfa-chess.com"
                className="hover:text-white transition-colors"
              >
                info@walfa-chess.com
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <span className="hidden md:inline text-[11px] text-slate-400 mr-1">
              Síguenos:
            </span>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-slate-300 hover:text-[#1D64F2] transition-colors"
            >
              <FacebookIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-slate-300 hover:text-pink-400 transition-colors"
            >
              <InstagramIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-slate-300 hover:text-red-500 transition-colors"
            >
              <YoutubeIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* ─── Main Navigation Bar ─── */}
      <nav
        className="bg-[#0A1931] border-b border-[#1E293B]"
        aria-label="Navegación principal"
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo oficial */}
          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0"
            aria-label="WALFA-CHESS — Inicio"
          >
            <div className="relative h-11 w-11 rounded-full overflow-hidden border border-white/20 bg-white/5 flex items-center justify-center p-0.5 shadow">
              <Image
                src="/images/logo.jpg"
                alt="Logo WALFA-CHESS"
                width={44}
                height={44}
                className="object-cover rounded-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white leading-none">
                WALFA<span className="text-[#1D64F2]">-</span>CHESS
              </span>
              <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase mt-0.5">
                FUNDACIÓN DE AJEDREZ
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden xl:flex items-center gap-6" role="list">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href)

              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1 text-[13px] font-bold uppercase tracking-wider transition-colors py-2",
                      isActive
                        ? "text-white border-b-2 border-[#1D64F2]"
                        : "text-slate-300 hover:text-white"
                    )}
                  >
                    <span>{link.label}</span>
                    {link.hasDropdown && (
                      <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Right Action: Inscripciones CTA & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link href="/inscripciones" className="hidden sm:inline-block">
              <button className="bg-[#1D64F2] hover:bg-[#1554cf] active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-md shadow-md transition duration-200">
                INSCRIPCIONES
              </button>
            </Link>

            {/* Mobile menu trigger */}
            <button
              type="button"
              className="xl:hidden rounded-md p-2 text-slate-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#1D64F2]"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {isOpen && (
          <div
            id="mobile-menu"
            className="xl:hidden border-t border-slate-700 bg-[#0A1931] shadow-2xl px-4 py-5"
          >
            <ul className="space-y-2" role="list">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href)

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-bold uppercase tracking-wider transition-colors",
                        isActive
                          ? "bg-[#1D64F2] text-white"
                          : "text-slate-200 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <span>{link.label}</span>
                      {link.hasDropdown && (
                        <ChevronDown className="h-4 w-4 opacity-75" />
                      )}
                    </Link>
                  </li>
                )
              })}
              <li className="pt-3">
                <Link
                  href="/inscripciones"
                  onClick={() => setIsOpen(false)}
                  className="block"
                >
                  <button className="w-full bg-[#1D64F2] hover:bg-[#1554cf] text-white font-extrabold text-xs uppercase tracking-wider py-3 rounded-md shadow">
                    INSCRIPCIONES
                  </button>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
