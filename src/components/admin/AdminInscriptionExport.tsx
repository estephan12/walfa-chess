"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { InscriptionWithRelations } from "@/lib/queries/inscriptionQueries"

interface AdminInscriptionExportProps {
  inscriptions: InscriptionWithRelations[]
}

export function AdminInscriptionExport({ inscriptions }: AdminInscriptionExportProps) {
  function handleExportCSV() {
    if (inscriptions.length === 0) {
      alert("No hay registros para exportar.")
      return
    }

    const headers = [
      "ID",
      "Nombre Completo",
      "Email",
      "Teléfono",
      "FIDE ID",
      "Torneo",
      "Categoría",
      "Estado",
      "Notas",
      "Fecha de Registro",
    ]

    const rows = inscriptions.map((ins) => [
      ins.id,
      `"${(ins.full_name || "").replace(/"/g, '""')}"`,
      `"${(ins.email || "").replace(/"/g, '""')}"`,
      `"${(ins.phone || "").replace(/"/g, '""')}"`,
      `"${(ins.fide_id || "").replace(/"/g, '""')}"`,
      `"${(ins.tournament?.title || "").replace(/"/g, '""')}"`,
      `"${(ins.category?.name || "General").replace(/"/g, '""')}"`,
      ins.status === "confirmed" ? "Confirmada" : ins.status === "rejected" ? "Rechazada" : "Pendiente",
      `"${(ins.notes || "").replace(/"/g, '""')}"`,
      new Date(ins.created_at).toLocaleDateString("es-DO"),
    ])

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute(
      "download",
      `walfa-chess-inscripciones-${new Date().toISOString().split("T")[0]}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button
      type="button"
      onClick={handleExportCSV}
      variant="secondary"
      size="sm"
      className="bg-[#132238] border border-[#2B5B84] text-[#F0F4F8] hover:bg-[#1a2d4a] hover:border-[#5FA8D3] font-bold text-xs"
    >
      <Download className="h-4 w-4 mr-1.5 text-[#5FA8D3]" />
      Exportar CSV ({inscriptions.length})
    </Button>
  )
}
