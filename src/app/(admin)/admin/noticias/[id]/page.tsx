import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { connection } from "next/server"
import { getNewsById } from "@/lib/queries/newsQueries"
import { getAllTournamentsAdmin } from "@/lib/queries/tournamentQueries"
import { NewsForm } from "@/components/admin/NewsForm"

export const instant = false

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const news = await getNewsById(id)
  return {
    title: news ? `Editar: ${news.title}` : "Editar Noticia",
  }
}

export default async function EditarNoticiaPage({ params }: Props) {
  await connection()
  const { id } = await params
  const [news, tournaments] = await Promise.all([
    getNewsById(id),
    getAllTournamentsAdmin(),
  ])

  if (!news) {
    notFound()
  }

  const tournamentOptions = tournaments.map((t) => ({
    id: t.id,
    title: t.title,
  }))

  return (
    <div className="py-2">
      <NewsForm
        initialData={news}
        isEditing={true}
        tournaments={tournamentOptions}
      />
    </div>
  )
}