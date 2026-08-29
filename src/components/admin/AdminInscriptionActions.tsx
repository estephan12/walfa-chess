"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, X, Trash2, RotateCcw, Loader2 } from "lucide-react"
import {
  updateInscriptionStatusAction,
  deleteInscriptionAction,
} from "@/lib/actions/inscriptionActions"
import type { InscriptionStatus } from "@/types"

interface AdminInscriptionActionsProps {
  inscriptionId: string
  currentStatus: InscriptionStatus
  playerName: string
}

export function AdminInscriptionActions({
  inscriptionId,
  currentStatus,
  playerName,
}: AdminInscriptionActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleStatusChange(newStatus: InscriptionStatus) {
    if (isLoading) return
    setIsLoading(true)
    try {
      const res = await updateInscriptionStatusAction(inscriptionId, newStatus)
      if (res.success) {
        router.refresh()
      } else {
        alert(res.error)
      }
    } catch {
      alert("Error al actualizar la inscripción.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (isLoading) return
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar la inscripción de "${playerName}"? Esta acción no se puede deshacer.`
    )
    if (!confirmed) return

    setIsLoading(true)
    try {
      const res = await deleteInscriptionAction(inscriptionId)
      if (res.success) {
        router.refresh()
      } else {
        alert(res.error)
      }
    } catch {
      alert("Error al eliminar la inscripción.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-end p-2 text-[#5FA8D3]">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      {currentStatus !== "confirmed" && (
        <button
          type="button"
          onClick={() => handleStatusChange("confirmed")}
          title="Confirmar y aprobar participante"
          className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-800/60 transition cursor-pointer"
        >
          <Check className="h-4 w-4" />
        </button>
      )}

      {currentStatus !== "rejected" && (
        <button
          type="button"
          onClick={() => handleStatusChange("rejected")}
          title="Rechazar solicitud"
          className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-400 hover:bg-rose-800/60 transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {currentStatus !== "pending" && (
        <button
          type="button"
          onClick={() => handleStatusChange("pending")}
          title="Volver a poner en revisión (Pendiente)"
          className="p-1.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 hover:bg-amber-800/60 transition cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      )}

      <button
        type="button"
        onClick={handleDelete}
        title="Eliminar inscripción"
        className="p-1.5 rounded-lg bg-[#0B0F19] border border-[#2B5B84] text-[#94A3B8] hover:text-rose-400 hover:border-rose-500/50 transition cursor-pointer ml-1"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
