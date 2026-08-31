import type { Metadata } from "next"
import { connection } from "next/server"
import { Handshake, Award, CheckCircle, ShieldCheck } from "lucide-react"
import { getAllSponsorsAdmin } from "@/lib/queries/sponsorQueries"
import { AdminSponsorManager } from "@/components/admin/AdminSponsorManager"

export const metadata: Metadata = {
  title: "Gestión de Patrocinadores",
  description: "Administración de empresas patrocinadoras y aliados institucionales de WALFA-CHESS.",
}

export default async function AdminSponsorsPage() {
  await connection()
  const sponsors = await getAllSponsorsAdmin()

  const totalSponsors = sponsors.length
  const activeSponsors = sponsors.filter((s) => s.is_active).length
  const platinumGold = sponsors.filter(
    (s) => s.tier === "platinum" || s.tier === "gold"
  ).length

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#2B5B84] bg-[#132238] px-3.5 py-1 text-xs font-bold text-[#5FA8D3] uppercase tracking-wider mb-2">
          <Handshake className="h-3.5 w-3.5" />
          <span>Alianzas Estratégicas</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#F0F4F8] tracking-tight">
          Patrocinadores & Marcas Aliadas
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Gestiona las empresas e instituciones que respaldan el circuito de ajedrez WALFA-CHESS.
        </p>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#94A3B8]">Total Registrados</span>
            <Handshake className="h-4 w-4 text-[#5FA8D3]" />
          </div>
          <p className="text-3xl font-black text-[#F0F4F8]">{totalSponsors}</p>
        </div>

        <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#94A3B8]">Patrocinadores Activos</span>
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">{activeSponsors}</p>
        </div>

        <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#94A3B8]">Nivel Platino & Oro</span>
            <Award className="h-4 w-4 text-amber-300" />
          </div>
          <p className="text-3xl font-black text-amber-300">{platinumGold}</p>
        </div>
      </div>

      {/* Gestor y tabla */}
      <AdminSponsorManager initialSponsors={sponsors} />
    </div>
  )
}