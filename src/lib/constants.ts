// ══════════════════════════════════════════════════════════════
// WALFA CHESS — Constantes del Proyecto
// ══════════════════════════════════════════════════════════════

export const SITE_NAME = "WALFA-CHESS"
export const SITE_DESCRIPTION =
  "Plataforma oficial de ajedrez competitivo en República Dominicana. Torneos, clasificaciones, noticias y más."
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

// Paginación por defecto
export const PAGE_SIZE = 12
export const ADMIN_PAGE_SIZE = 20

// Supabase Storage buckets
export const STORAGE_BUCKETS = {
  TOURNAMENTS: "tournaments",
  NEWS: "news",
  GALLERY: "gallery",
  PLAYERS: "players",
  SPONSORS: "sponsors",
} as const

// Colores de estado para badges
export const STATUS_COLORS = {
  // Torneos
  draft:      "bg-slate-100 border border-slate-200 text-slate-700",
  published:  "bg-blue-50 border border-blue-200 text-[#1D64F2]",
  ongoing:    "bg-emerald-50 border border-emerald-300 text-emerald-700",
  finished:   "bg-indigo-50 border border-indigo-200 text-indigo-700",
  cancelled:  "bg-rose-50 border border-rose-200 text-rose-700",
  // Inscripciones
  pending:    "bg-amber-50 border border-amber-300 text-amber-800",
  confirmed:  "bg-emerald-50 border border-emerald-300 text-emerald-700",
  rejected:   "bg-rose-50 border border-rose-200 text-rose-700",
} as const

// Niveles de patrocinadores (orden de display)
export const SPONSOR_TIER_ORDER: Record<string, number> = {
  platinum: 1,
  gold:     2,
  silver:   3,
  bronze:   4,
  media:    5,
}

export const SPONSOR_TIER_LABELS: Record<string, string> = {
  platinum: "Platino",
  gold:     "Oro",
  silver:   "Plata",
  bronze:   "Bronce",
  media:    "Medios",
}

// Nav links públicos
export const PUBLIC_NAV_LINKS = [
  { href: "/torneos",       label: "Torneos" },
  { href: "/resultados",    label: "Resultados" },
  { href: "/clasificacion", label: "Clasificación" },
  { href: "/noticias",      label: "Noticias" },
  { href: "/galeria",       label: "Galería" },
  { href: "/nosotros",      label: "Nosotros" },
  { href: "/contacto",      label: "Contacto" },
] as const

// Nav links admin
export const ADMIN_NAV_LINKS = [
  { href: "/admin",                 label: "Dashboard",       icon: "LayoutDashboard" },
  { href: "/admin/torneos",         label: "Torneos",         icon: "Trophy" },
  { href: "/admin/inscripciones",   label: "Inscripciones",   icon: "ClipboardList" },
  { href: "/admin/noticias",        label: "Noticias",        icon: "Newspaper" },
  { href: "/admin/resultados",      label: "Resultados",      icon: "ListOrdered" },
  { href: "/admin/jugadores",       label: "Jugadores",       icon: "Users" },
  { href: "/admin/galeria",         label: "Galería",         icon: "Images" },
  { href: "/admin/patrocinadores",  label: "Patrocinadores",  icon: "Handshake" },
  { href: "/admin/configuracion",   label: "Configuración",   icon: "Settings" },
] as const
