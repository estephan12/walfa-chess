"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ExternalLink, Edit3, Trash2, Loader2 } from "lucide-react"
import { deleteTournamentAction } from "@/lib/actions/tournamentActions"

interface AdminTournamentActionsProps {
  id: string
  slug: string
  title: string
  status: string
}

export function AdminTournamentActions({
  id,
  slug,
  title,
  status,
}: AdminTournamentActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar el torneo "${title}"? Esta acción no se puede deshacer.`
    )
    if (!confirmed) return

    setIsDeleting(true)
    const res = await deleteTournamentAction(id)

    if (res.success) {
      router.refresh()
    } else {
      alert(res.error ?? "Error al eliminar el torneo")
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {status !== "draft" && (
        <Link
          href={`/torneos/${slug}`}
          target="_blank"
          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#5FA8D3] hover:bg-[#0B0F19] transition-colors"
          title="Ver en web pública"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      )}

      <Link
        href={`/admin/torneos/${id}`}
        className="p-1.5 rounded-lg text-[#5FA8D3] hover:text-[#4A96C2] hover:bg-[#0B0F19] transition-colors font-medium text-xs flex items-center gap-1"
        title="Editar torneo"
      >
        <Edit3 className="h-4 w-4" />
        <span>Editar</span>
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
        title="Eliminar torneo"
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>
    </div>
  )
}
