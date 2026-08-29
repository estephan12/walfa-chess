import type { Metadata } from "next"
import Link from "next/link"
import { Trophy, Newspaper, Users, Images, Plus, Settings, ClipboardList } from "lucide-react"
import { connection } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Dashboard",
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  description: string
  href: string
}

function StatCard({ title, value, icon: Icon, description, href }: StatCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-[#2B5B84] bg-[#132238] p-6 shadow-md hover:border-[#5FA8D3] hover:shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5FA8D3]"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-[#94A3B8]">{title}</p>
        <div className="rounded-xl bg-[#0B0F19] border border-[#2B5B84] p-2.5 group-hover:border-[#5FA8D3] transition-colors">
          <Icon className="h-5 w-5 text-[#5FA8D3]" aria-hidden="true" />
        </div>
      </div>
      <p className="text-4xl font-black text-[#5FA8D3] tracking-tight">{value}</p>
      <p className="mt-2 text-xs text-[#94A3B8]">{description}</p>
    </Link>
  )
}

export default async function AdminDashboardPage() {
  await connection()
  const supabase = await createClient()

  // Conteos paralelos
  const [
    { count: tournamentsCount },
    { count: inscriptionsCount },
    { count: newsCount },
    { count: playersCount },
  ] = await Promise.all([
    supabase.from("tournaments").select("*", { count: "exact", head: true }),
    supabase.from("inscriptions").select("*", { count: "exact", head: true }),
    supabase.from("news").select("*", { count: "exact", head: true }),
    supabase.from("players").select("*", { count: "exact", head: true }),
  ])

  const stats = [
    {
      title: "Torneos",
      value: tournamentsCount ?? 0,
      icon: Trophy,
      description: "Total de torneos registrados",
      href: "/admin/torneos",
    },
    {
      title: "Inscripciones",
      value: inscriptionsCount ?? 0,
      icon: ClipboardList,
      description: "Participantes registrados",
      href: "/admin/inscripciones",
    },
    {
      title: "Jugadores",
      value: playersCount ?? 0,
      icon: Users,
      description: "Jugadores en el padrón",
      href: "/admin/jugadores",
    },
    {
      title: "Noticias",
      value: newsCount ?? 0,
      icon: Newspaper,
      description: "Artículos publicados",
      href: "/admin/noticias",
    },
  ]

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#F0F4F8] tracking-tight">Panel de Control</h1>
        <p className="text-[#94A3B8] mt-1 text-sm">
          Administración y gestión general de la Fundación WALFA CHESS
        </p>
      </div>

      {/* Stats grid */}
      <div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Estadísticas generales"
      >
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-12">
        <h2 className="text-lg font-bold text-[#F0F4F8] mb-5">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/torneos/nuevo"
            className="flex items-center gap-4 rounded-2xl border border-[#2B5B84] bg-[#132238] p-5 text-sm font-bold text-[#F0F4F8] hover:border-[#5FA8D3] hover:bg-[#1a2d4a] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5FA8D3] shadow-md"
          >
            <div className="rounded-xl bg-[#0B0F19] p-2.5 border border-[#2B5B84]">
              <Trophy className="h-5 w-5 text-[#5FA8D3] shrink-0" aria-hidden="true" />
            </div>
            <span>Crear nuevo torneo</span>
          </Link>
          <Link
            href="/admin/noticias/nueva"
            className="flex items-center gap-4 rounded-2xl border border-[#2B5B84] bg-[#132238] p-5 text-sm font-bold text-[#F0F4F8] hover:border-[#5FA8D3] hover:bg-[#1a2d4a] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5FA8D3] shadow-md"
          >
            <div className="rounded-xl bg-[#0B0F19] p-2.5 border border-[#2B5B84]">
              <Newspaper className="h-5 w-5 text-[#5FA8D3] shrink-0" aria-hidden="true" />
            </div>
            <span>Publicar noticia</span>
          </Link>
          <Link
            href="/admin/configuracion"
            className="flex items-center gap-4 rounded-2xl border border-[#2B5B84] bg-[#132238] p-5 text-sm font-bold text-[#F0F4F8] hover:border-[#5FA8D3] hover:bg-[#1a2d4a] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5FA8D3] shadow-md"
          >
            <div className="rounded-xl bg-[#0B0F19] p-2.5 border border-[#2B5B84]">
              <Settings className="h-5 w-5 text-[#5FA8D3] shrink-0" aria-hidden="true" />
            </div>
            <span>Configuración institucional</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
