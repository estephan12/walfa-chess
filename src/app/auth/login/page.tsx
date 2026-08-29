"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { ChessKnightIcon } from "@/components/shared/ChessKnightIcon"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") ?? "/admin"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError("Credenciales incorrectas. Por favor verifica tu correo y contraseña.")
      setIsLoading(false)
      return
    }

    router.push(next)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2"
        >
          Correo electrónico
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-3 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30 transition-colors"
            placeholder="admin@walfachess.com"
            aria-describedby={error ? "login-error" : undefined}
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-xs font-bold text-[#F0F4F8] uppercase tracking-wider mb-2"
        >
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-4 py-3 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:border-[#5FA8D3] focus:outline-none focus:ring-2 focus:ring-[#5FA8D3]/30 transition-colors pr-10"
            placeholder="••••••••"
            aria-describedby={error ? "login-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F0F4F8] focus-visible:outline-none cursor-pointer"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          id="login-error"
          role="alert"
          className="rounded-xl bg-rose-950/60 border border-rose-500/50 p-3.5 text-xs font-medium text-rose-300"
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-black py-3 text-sm rounded-xl shadow-lg shadow-[#5FA8D3]/10"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Verificando credenciales...
          </>
        ) : (
          "Acceder al Panel"
        )}
      </Button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="relative h-16 w-16 rounded-2xl border border-[#2B5B84] bg-[#132238] shadow-xl flex items-center justify-center p-2 mb-4">
            <ChessKnightIcon className="h-11 w-auto text-[#5FA8D3]" />
          </div>
          <span className="text-xs font-bold text-[#5FA8D3] uppercase tracking-widest mb-1">
            Fundación de Ajedrez
          </span>
          <h1 className="text-2xl font-black text-[#F0F4F8] tracking-tight">
            WALFA<span className="text-[#5FA8D3]">-</span>CHESS
          </h1>
          <p className="text-[#94A3B8] text-xs mt-1">Panel de Administración</p>
        </div>

        {/* Form card with Suspense boundary */}
        <div className="bg-[#132238] border border-[#2B5B84] rounded-2xl shadow-2xl p-8 sm:p-10">
          <h2 className="text-xl font-bold text-[#F0F4F8] mb-6 text-center">
            Iniciar Sesión
          </h2>

          <Suspense fallback={<LoadingSpinner size="md" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
