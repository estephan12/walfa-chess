import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

/**
 * proxy.ts — Auth guard para rutas protegidas (/admin)
 * Next.js 16: el archivo se llama proxy.ts (antes middleware.ts)
 */
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refrescar sesión (importante: no eliminar este bloque)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Proteger rutas /admin — redirigir a login si no está autenticado
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("next", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirigir al admin si ya está logueado y trata de acceder al login
  if (pathname.startsWith("/auth/login") && user) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Aplica proxy a todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico, sitemap.xml, robots.txt
     * - archivos con extensión (imágenes, fuentes, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)",
  ],
}
