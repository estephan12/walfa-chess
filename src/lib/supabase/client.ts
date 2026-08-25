import { createBrowserClient } from "@supabase/ssr"

/**
 * Cliente Supabase para uso en componentes del lado del cliente (CSR).
 * Usa las claves públicas — seguro exponer.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
