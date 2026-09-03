import type { Metadata } from "next"
import { connection } from "next/server"
import { Settings, Sparkles, Sliders } from "lucide-react"
import { getStatsRibbonConfig } from "@/lib/queries/settingsQueries"
import { StatsRibbonConfigForm } from "@/components/admin/StatsRibbonConfigForm"

export const metadata: Metadata = {
  title: "Configuración de Estadísticas & Sitio — Admin",
  description: "Administración de la cinta de métricas y ajustes generales de la plataforma WALFA-CHESS.",
}

export default async function ConfiguracionPage() {
  await connection()
  const { config, realStats } = await getStatsRibbonConfig()

  return (
    <div className="space-y-8 max-w-6xl">
      {/* HEADER DE LA SECCIÓN */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#2B5B84]/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5FA8D3]/10 border border-[#5FA8D3]/30 text-xs font-bold text-[#5FA8D3] uppercase tracking-wider mb-2">
            <Sliders className="h-3.5 w-3.5" />
            Panel de Control
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F0F4F8] tracking-tight">
            Configuración de Estadísticas
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#94A3B8]">
            Personaliza los datos de la cinta principal (Home Ribbon). Puedes elegir entre conteo automático calculado desde la base de datos o valores manuales personalizados.
          </p>
        </div>
      </div>

      {/* FORMULARIO DE CINTA DE ESTADÍSTICAS */}
      <StatsRibbonConfigForm initialConfig={config} realStats={realStats} />
    </div>
  )
}