import type { Metadata } from "next"

export const instant = false

interface Props { params: Promise<{ tournamentId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tournamentId } = await params
  return { title: `Resultados — ${tournamentId}` }
}

export default async function ResultadosTorneoPage({ params }: Props) {
  const { tournamentId } = await params
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-8 sm:p-12 shadow-xl">
        <h1 className="text-3xl sm:text-4xl font-black text-[#F0F4F8]">Resultados del Torneo</h1>
        <p className="mt-4 text-[#94A3B8]">ID del Torneo: {tournamentId}</p>
      </div>
    </div>
  )
}