// ══════════════════════════════════════════════════════════════
// WALFA CHESS — Constantes del Proyecto
// ══════════════════════════════════════════════════════════════

export const SITE_NAME = "WALFA CHESS"
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
  draft:      "bg-[#132238] border border-[#2B5B84] text-[#94A3B8]",
  published:  "bg-[#132238] border border-[#5FA8D3] text-[#5FA8D3]",
  ongoing:    "bg-emerald-950/60 border border-emerald-500/40 text-emerald-400",
  finished:   "bg-indigo-950/60 border border-indigo-500/40 text-indigo-300",
  cancelled:  "bg-rose-950/60 border border-rose-500/40 text-rose-300",
  // Inscripciones
  pending:    "bg-amber-950/60 border border-amber-500/40 text-amber-300",
  confirmed:  "bg-emerald-950/60 border border-emerald-500/40 text-emerald-400",
  rejected:   "bg-rose-950/60 border border-rose-500/40 text-rose-300",
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
