import type { Metadata } from "next"

export const instant = false

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Editar Torneo" }
}

export default async function EditarTorneoPage({ params }: Props) {
  const { id } = await params
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#F0F4F8]">Editar Torneo</h1>
      <p className="text-[#94A3B8] mt-2">ID: {id}</p>
    </div>
  )
}