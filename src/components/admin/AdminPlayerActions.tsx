"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit3, Trash2, Loader2, Award } from "lucide-react"
import { deletePlayerAction } from "@/lib/actions/playerActions"

interface AdminPlayerActionsProps {
  id: string
  fullName: string
  title?: string | null
}

export function AdminPlayerActions({
  id,
  fullName,
  title,
}: AdminPlayerActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    const playerDesc = title ? `${title} ${fullName}` : fullName
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar al jugador "${playerDesc}"? Esta acción no se puede deshacer.`
    )
    if (!confirmed) return

    setIsDeleting(true)
    const res = await deletePlayerAction(id)

    if (res.success) {
      router.refresh()
    } else {
      alert(res.error ?? "Error al eliminar el jugador")
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/admin/jugadores/${id}`}
        className="p-1.5 rounded-lg text-[#5FA8D3] hover:text-[#4A96C2] hover:bg-[#0B0F19] transition-colors font-medium text-xs flex items-center gap-1"
        title="Editar jugador"
      >
        <Edit3 className="h-4 w-4" />
        <span>Editar</span>
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
        title="Eliminar jugador"
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
