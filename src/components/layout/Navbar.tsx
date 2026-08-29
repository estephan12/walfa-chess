"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { PUBLIC_NAV_LINKS, SITE_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChessKnightIcon } from "@/components/shared/ChessKnightIcon"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2B5B84] bg-[#132238]/95 backdrop-blur supports-[backdrop-filter]:bg-[#132238]/90">
      <nav
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Navegación principal"
      >
        {/* Logo oficial */}
        <Link
          href="/"
          className="flex items-center gap-3 font-bold group transition-transform hover:scale-[1.02]"
          aria-label={`${SITE_NAME} — Inicio`}
        >
          <div className="relative h-11 w-11 rounded-xl border border-[#2B5B84] bg-[#0B0F19] shadow-md shadow-black/40 flex items-center justify-center p-1.5 group-hover:border-[#5FA8D3] transition-colors shrink-0">
            <ChessKnightIcon className="h-8 w-auto text-[#5FA8D3] transition-transform group-hover:scale-110" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-wider text-[#94A3B8] uppercase">
              Fundación de Ajedrez
            </span>
            <span className="text-lg font-black tracking-tight text-[#F0F4F8] leading-none">
              WALFA<span className="text-[#5FA8D3]">-</span>CHESS
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1" role="list">
          {PUBLIC_NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-[#94A3B8] hover:text-[#5FA8D3] hover:bg-[#0B0F19]/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5FA8D3]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <Link href="/inscripciones" className="hidden sm:block">
            <Button
              size="sm"
              className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-bold shadow-md shadow-[#5FA8D3]/10"
            >
              Inscríbete
            </Button>
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden rounded-lg p-2 text-[#94A3B8] hover:text-[#F0F4F8] hover:bg-[#0B0F19]/40 border border-[#2B5B84]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5FA8D3]"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-[#2B5B84] bg-[#132238] shadow-xl"
        >
          <ul className="space-y-1 px-4 py-4" role="list">
            {PUBLIC_NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-2.5 rounded-lg text-base font-medium text-[#94A3B8]",
                    "hover:text-[#5FA8D3] hover:bg-[#0B0F19]/60 transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5FA8D3]"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-3 pb-1">
              <Link href="/inscripciones" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-bold">
                  Inscríbete
                </Button>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
