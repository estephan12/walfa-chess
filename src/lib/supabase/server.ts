import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Cliente Supabase para uso en Server Components, Server Actions y Route Handlers.
 * Maneja automáticamente el refresh de sesión mediante cookies.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // setAll puede fallar en Server Components (read-only context).
            // Ignorar — el middleware se encargará del refresh.
          }
        },
      },
    }
  )
}

/**
 * Cliente Supabase con Service Role — solo para operaciones de admin server-side.
 * NUNCA usar en el cliente.
 */
export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
