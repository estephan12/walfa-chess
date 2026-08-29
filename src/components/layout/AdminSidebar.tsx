"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Trophy,
  Newspaper,
  ListOrdered,
  Users,
  Images,
  Handshake,
  Settings,
  LogOut,
  ChevronRight,
  ClipboardList,
  Menu,
  X,
  ExternalLink,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ADMIN_NAV_LINKS, SITE_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { ChessKnightIcon } from "@/components/shared/ChessKnightIcon"

const iconMap = {
  LayoutDashboard,
  Trophy,
  Newspaper,
  ListOrdered,
  Users,
  Images,
  Handshake,
  Settings,
  ClipboardList,
} as Record<string, React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>>

interface AdminSidebarProps {
  userEmail: string
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Cerrar menú móvil al navegar
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Bloquear scroll del body cuando el menú móvil esté desplegado
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileOpen])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const navContent = (
    <>
      {/* Encabezado del Menú */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#2B5B84] bg-[#0B0F19]/40">
        <Link
          href="/admin"
          onClick={() => setIsMobileOpen(false)}
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <div className="relative h-10 w-10 rounded-xl border border-[#2B5B84] bg-[#0B0F19] flex items-center justify-center p-1.5 shrink-0 shadow-sm">
            <ChessKnightIcon className="h-7 w-auto text-[#5FA8D3]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold tracking-wider text-[#94A3B8] uppercase">
              Admin Panel
            </span>
            <span className="font-extrabold text-sm tracking-tight text-[#F0F4F8] leading-tight">
              WALFA<span className="text-[#5FA8D3]">-</span>CHESS
            </span>
          </div>
        </Link>

        {/* Botón para cerrar drawer en móvil */}
        <button
          type="button"
          onClick={() => setIsMobileOpen(false)}
          className="p-2 rounded-xl text-[#94A3B8] hover:text-[#F0F4F8] hover:bg-[#0B0F19] border border-[#2B5B84] lg:hidden transition-colors cursor-pointer"
          aria-label="Cerrar menú"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Lista de Enlaces */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Menú admin">
        <div className="flex items-center justify-between px-3 mb-2">
          <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest">
            Gestión
          </p>
          <Link
            href="/"
            target="_blank"
            className="text-[11px] text-[#5FA8D3] hover:underline flex items-center gap-1 lg:hidden"
          >
            Ver web <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <ul role="list" className="space-y-1">
          {ADMIN_NAV_LINKS.map((link) => {
            const Icon = iconMap[link.icon]
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href)

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5FA8D3]",
                    isActive
                      ? "bg-[#5FA8D3] text-[#0B0F19] font-bold shadow-md shadow-[#5FA8D3]/20"
                      : "text-[#94A3B8] hover:text-[#F0F4F8] hover:bg-[#0B0F19]/60"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {Icon && (
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive ? "text-[#0B0F19]" : "text-[#5FA8D3]"
                      )}
                      aria-hidden={true}
                    />
                  )}
                  {link.label}
                  {isActive && (
                    <ChevronRight className="ml-auto h-3.5 w-3.5 text-[#0B0F19]" aria-hidden="true" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Usuario / Cerrar Sesión */}
      <div className="border-t border-[#2B5B84] p-3.5 bg-[#0B0F19]/40 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#132238] border border-[#2B5B84]/50">
          <div className="h-8 w-8 rounded-full bg-[#5FA8D3]/20 border border-[#5FA8D3]/40 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-[#5FA8D3]" aria-hidden="true">
              {userEmail ? userEmail.charAt(0).toUpperCase() : "A"}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#F0F4F8] truncate" title={userEmail}>
              {userEmail}
            </p>
            <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider">
              Administrador
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex-1 hidden lg:flex items-center justify-center gap-1.5 rounded-xl border border-[#2B5B84] px-3 py-2 text-xs font-bold text-[#94A3B8] hover:text-[#5FA8D3] hover:bg-[#0B0F19] transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Sitio Web
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold",
              "text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-rose-900/40 transition-colors cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            )}
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* ── BARRA SUPERIOR PARA MÓVILES (lg:hidden) ── */}
      <header className="lg:hidden sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#2B5B84] bg-[#132238]/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-[#132238]/90">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="rounded-xl border border-[#2B5B84] bg-[#0B0F19] p-2 text-[#F0F4F8] hover:border-[#5FA8D3] hover:text-[#5FA8D3] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5FA8D3] cursor-pointer shadow-sm"
            aria-label="Abrir menú de administración"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/admin" className="flex items-center gap-2 font-bold">
            <div className="relative h-8 w-8 rounded-lg border border-[#2B5B84] bg-[#0B0F19] flex items-center justify-center p-1 shrink-0">
              <ChessKnightIcon className="h-5 w-auto text-[#5FA8D3]" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xs tracking-tight text-[#F0F4F8] leading-none">
                WALFA<span className="text-[#5FA8D3]">-</span>CHESS
              </span>
              <span className="text-[9px] font-semibold text-[#5FA8D3] uppercase tracking-wider">
                Admin
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-xl text-xs font-bold text-[#94A3B8] hover:text-[#5FA8D3] border border-[#2B5B84] bg-[#0B0F19] transition-colors flex items-center gap-1.5 shadow-sm"
            title="Ver sitio web público"
          >
            <span className="text-[11px]">Web</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <div
            className="h-8 w-8 rounded-full bg-[#5FA8D3]/20 border border-[#5FA8D3]/40 flex items-center justify-center text-xs font-bold text-[#5FA8D3] shadow-sm"
            title={userEmail}
          >
            {userEmail ? userEmail.charAt(0).toUpperCase() : "A"}
          </div>
        </div>
      </header>

      {/* ── TELÓN DE FONDO PARA MÓVIL (BACKDROP) ── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── MENÚ LATERAL MÓVIL (DRAWER SLIDE-OVER) ── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#132238] border-r border-[#2B5B84] text-[#F0F4F8] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Panel de administración móvil"
      >
        {navContent}
      </aside>

      {/* ── BARRA LATERAL FIJA EN ESCRITORIO (DESKTOP) ── */}
      <aside
        className="hidden lg:flex lg:w-64 lg:shrink-0 bg-[#132238] border-r border-[#2B5B84] text-[#F0F4F8] flex-col min-h-screen sticky top-0 h-screen"
        aria-label="Panel de administración de escritorio"
      >
        {navContent}
      </aside>
    </>
  )
}
