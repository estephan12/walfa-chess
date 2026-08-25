import type { Metadata } from "next"

export const instant = false

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return { title: slug }
}

export default async function NoticiaPage({ params }: Props) {
  const { slug } = await params
  return (
    <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-8 sm:p-12 shadow-xl">
        <h1 className="text-3xl sm:text-4xl font-black text-[#F0F4F8]">{slug}</h1>
        <p className="mt-4 text-[#94A3B8]">Detalle del artículo en preparación.</p>
      </div>
    </article>
  )
}