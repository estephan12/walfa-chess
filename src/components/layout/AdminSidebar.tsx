"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, Trophy, Newspaper, ListOrdered,
  Users, Images, Handshake, Settings, LogOut, ChevronRight, ClipboardList
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ADMIN_NAV_LINKS, SITE_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { ChessKnightIcon } from "@/components/shared/ChessKnightIcon"

const iconMap = {
  LayoutDashboard, Trophy, Newspaper, ListOrdered,
  Users, Images, Handshake, Settings, ClipboardList,
} as Record<string, React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>>

interface AdminSidebarProps {
  userEmail: string
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <aside
      className="w-64 shrink-0 bg-[#132238] border-r border-[#2B5B84] text-[#F0F4F8] flex flex-col min-h-screen"
      aria-label="Panel de administración"
    >
      {/* Logo */}
      <Link href="/admin" className="flex items-center gap-3 px-5 py-5 border-b border-[#2B5B84] hover:bg-[#0B0F19]/20 transition-colors">
        <div className="relative h-10 w-10 rounded-xl border border-[#2B5B84] bg-[#0B0F19] flex items-center justify-center p-1.5 shrink-0">
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

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Menú admin">
        <p className="px-3 mb-2 text-xs font-bold text-[#94A3B8] uppercase tracking-widest">
          Gestión
        </p>
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
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5FA8D3]",
                    isActive
                      ? "bg-[#5FA8D3] text-[#0B0F19] font-bold shadow-sm"
                      : "text-[#94A3B8] hover:text-[#F0F4F8] hover:bg-[#0B0F19]/50"
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

      {/* User / Logout */}
      <div className="border-t border-[#2B5B84] px-3 py-4 bg-[#0B0F19]/30">
        <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg bg-[#132238] border border-[#2B5B84]/50">
          <div className="h-7 w-7 rounded-full bg-[#5FA8D3]/20 border border-[#5FA8D3]/40 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-[#5FA8D3]" aria-hidden="true">
              {userEmail ? userEmail.charAt(0).toUpperCase() : "A"}
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] truncate" title={userEmail}>
            {userEmail}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
            "text-[#94A3B8] hover:text-[#F0F4F8] hover:bg-[#0B0F19]/50 transition-colors cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5FA8D3]"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
