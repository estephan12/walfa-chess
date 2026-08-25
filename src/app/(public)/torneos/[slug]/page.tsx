import type { Metadata } from "next"

export const instant = false

interface TorneoPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: TorneoPageProps): Promise<Metadata> {
  const { slug } = await params
  return { title: `Torneo — ${slug}` }
}

export default async function TorneoPage({ params }: TorneoPageProps) {
  const { slug } = await params
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-8 sm:p-12 shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#2B5B84] bg-[#0B0F19] px-3.5 py-1 text-xs font-bold text-[#5FA8D3] uppercase tracking-wider mb-4">
          Detalle Oficial
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#F0F4F8]">{slug}</h1>
        <p className="mt-4 text-[#94A3B8]">Información, bases y registro del torneo.</p>
      </div>
    </div>
  )
}