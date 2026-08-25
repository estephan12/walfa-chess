import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Combina clases de Tailwind de forma segura */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convierte un texto en un slug URL-amigable
 * Ej: "Gran Torneo WALFA 2025" → "gran-torneo-walfa-2025"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // elimina diacríticos
    .replace(/[^a-z0-9\s-]/g, "")      // elimina caracteres especiales
    .replace(/\s+/g, "-")              // espacios → guiones
    .replace(/-+/g, "-")               // múltiples guiones → uno
    .trim()
    .replace(/^-|-$/g, "")             // elimina guiones al inicio/fin
}

/**
 * Formatea una fecha ISO para display en español (República Dominicana)
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  }
): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("es-DO", options).format(d)
}

/**
 * Formatea una fecha corta: "22 ago. 2025"
 */
export function formatDateShort(date: string | Date): string {
  return formatDate(date, { day: "numeric", month: "short", year: "numeric" })
}

/**
 * Formatea un rango de fechas
 */
export function formatDateRange(start: string, end?: string | null): string {
  if (!end) return formatDate(start)
  const s = new Date(start)
  const e = new Date(end)
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return `${s.getDate()}–${formatDate(end, { day: "numeric", month: "long", year: "numeric" })}`
  }
  return `${formatDateShort(start)} – ${formatDateShort(end)}`
}

/**
 * Formatea un valor monetario en DOP
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "Gratis"
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Trunca un texto a N caracteres
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "…"
}

/**
 * Retorna el estado visual de un torneo
 */
export function getTournamentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: "Borrador",
    published: "Publicado",
    ongoing: "En curso",
    finished: "Finalizado",
    cancelled: "Cancelado",
  }
  return labels[status] ?? status
}

/**
 * Retorna el label del tipo de torneo
 */
export function getTournamentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    open: "Abierto",
    invitational: "Por invitación",
    online: "Online",
    blitz: "Blitz",
    rapid: "Rápidas",
    classical: "Clásicas",
    simultaneous: "Simultáneas",
  }
  return labels[type] ?? type
}

/**
 * Genera la URL completa del sitio
 */
export function siteUrl(path: string = ""): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  return `${base}${path}`
}
