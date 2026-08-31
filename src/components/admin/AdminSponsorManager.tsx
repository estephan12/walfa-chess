"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  Loader2,
  Handshake,
  CheckCircle2,
  XCircle,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SponsorModal } from "@/components/admin/SponsorModal"
import { SPONSOR_TIER_LABELS } from "@/lib/constants"
import {
  deleteSponsorAction,
  toggleSponsorActiveAction,
} from "@/lib/actions/sponsorActions"
import type { Sponsor, SponsorTier } from "@/types"

interface AdminSponsorManagerProps {
  initialSponsors: Sponsor[]
}

const TIER_BADGE_CLASSES: Record<SponsorTier, string> = {
  platinum: "bg-slate-800/80 border border-slate-400/50 text-slate-200",
  gold: "bg-amber-950/60 border border-amber-500/50 text-amber-300",
  silver: "bg-zinc-800/80 border border-zinc-400/50 text-zinc-200",
  bronze: "bg-orange-950/60 border border-orange-600/50 text-orange-300",
  media: "bg-sky-950/60 border border-sky-500/50 text-sky-300",
}

export function AdminSponsorManager({ initialSponsors }: AdminSponsorManagerProps) {
  const router = useRouter()
  const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors)
  const [tierFilter, setTierFilter] = useState<string>("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleOpenCreate = () => {
    setSelectedSponsor(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor)
    setIsModalOpen(true)
  }

  const handleToggleActive = async (sponsor: Sponsor) => {
    setTogglingId(sponsor.id)
    const newStatus = !sponsor.is_active

    // Optimistic UI
    setSponsors((prev) =>
      prev.map((s) => (s.id === sponsor.id ? { ...s, is_active: newStatus } : s))
    )

    const res = await toggleSponsorActiveAction(sponsor.id, newStatus)
    if (!res.success) {
      alert(res.error ?? "Error al alternar estado")
      // Revertir en caso de error
      setSponsors((prev) =>
        prev.map((s) => (s.id === sponsor.id ? { ...s, is_active: !newStatus } : s))
      )
    } else {
      router.refresh()
    }
    setTogglingId(null)
  }

  const handleDelete = async (sponsor: Sponsor) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar al patrocinador "${sponsor.name}"?`
    )
    if (!confirmed) return

    setDeletingId(sponsor.id)
    const res = await deleteSponsorAction(sponsor.id)

    if (res.success) {
      setSponsors((prev) => prev.filter((s) => s.id !== sponsor.id))
      router.refresh()
    } else {
      alert(res.error ?? "Error al eliminar el patrocinador")
    }
    setDeletingId(null)
  }

  const filteredSponsors = sponsors.filter((s) => {
    if (tierFilter === "all") return true
    return s.tier === tierFilter
  })

  return (
    <div className="space-y-6">
      {/* Barra de herramientas */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#132238] p-4 rounded-2xl border border-[#2B5B84]">
        <div className="flex items-center gap-3">
          <label htmlFor="tier-filter" className="text-xs font-semibold text-[#94A3B8] shrink-0">
            Filtrar por nivel:
          </label>
          <select
            id="tier-filter"
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-3 py-1.5 text-xs text-[#F0F4F8] focus:border-[#5FA8D3] focus:outline-none"
          >
            <option value="all">Todos los niveles ({sponsors.length})</option>
            {Object.entries(SPONSOR_TIER_LABELS).map(([tier, label]) => {
              const count = sponsors.filter((s) => s.tier === tier).length
              return (
                <option key={tier} value={tier}>
                  {label} ({count})
                </option>
              )
            })}
          </select>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-[#5FA8D3]/10"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Patrocinador</span>
        </Button>
      </div>

      {/* Listado / Tabla */}
      {filteredSponsors.length === 0 ? (
        <div className="rounded-2xl border border-[#2B5B84] bg-[#132238] p-12 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B0F19] border border-[#2B5B84]">
            <Handshake className="h-7 w-7 text-[#5FA8D3]" />
          </div>
          <h3 className="text-lg font-bold text-[#F0F4F8]">No hay patrocinadores registrados</h3>
          <p className="mt-1.5 text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto">
            {tierFilter !== "all"
              ? "No existen patrocinadores para el nivel seleccionado."
              : "Registra los aliados institucionales y marcas patrocinadoras de los torneos WALFA-CHESS."}
          </p>
          {tierFilter === "all" && (
            <div className="mt-6">
              <Button
                onClick={handleOpenCreate}
                className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-bold text-xs"
              >
                Agregar primer patrocinador
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#2B5B84] bg-[#132238] shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2B5B84]/60 bg-[#0B0F19]/60 text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                <th className="px-5 py-3.5">Logo & Empresa</th>
                <th className="px-5 py-3.5">Nivel</th>
                <th className="px-5 py-3.5">Orden</th>
                <th className="px-5 py-3.5">Estado</th>
                <th className="px-5 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2B5B84]/40 text-xs sm:text-sm">
              {filteredSponsors.map((sponsor) => (
                <tr
                  key={sponsor.id}
                  className="hover:bg-[#0B0F19]/40 transition-colors group"
                >
                  {/* Logo y Nombre */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative h-12 w-16 shrink-0 rounded-lg bg-white/5 border border-[#2B5B84] p-1 flex items-center justify-center overflow-hidden">
                        {sponsor.logo_url ? (
                          <Image
                            src={sponsor.logo_url}
                            alt={sponsor.name}
                            fill
                            className="object-contain p-1"
                            sizes="64px"
                          />
                        ) : (
                          <Handshake className="h-5 w-5 text-[#94A3B8]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#F0F4F8] truncate">{sponsor.name}</p>
                        {sponsor.website_url ? (
                          <a
                            href={sponsor.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#5FA8D3] hover:underline mt-0.5 truncate max-w-[200px]"
                          >
                            <Globe className="h-3 w-3 shrink-0" />
                            <span className="truncate">{sponsor.website_url.replace(/^https?:\/\//, "")}</span>
                            <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-[#94A3B8]/60">Sin enlace</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Nivel */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        TIER_BADGE_CLASSES[sponsor.tier]
                      }`}
                    >
                      {SPONSOR_TIER_LABELS[sponsor.tier]}
                    </span>
                  </td>

                  {/* Orden */}
                  <td className="px-5 py-4 whitespace-nowrap text-xs font-mono text-[#94A3B8]">
                    #{sponsor.sort_order}
                  </td>

                  {/* Estado / Switch */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(sponsor)}
                      disabled={togglingId === sponsor.id}
                      className="inline-flex items-center gap-1.5 cursor-pointer group/toggle focus:outline-none"
                      title={sponsor.is_active ? "Desactivar" : "Activar"}
                    >
                      {togglingId === sponsor.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-[#5FA8D3]" />
                      ) : sponsor.is_active ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-950/40 border border-emerald-500/40 px-2 py-0.5 rounded-full group-hover/toggle:border-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-semibold bg-slate-900/60 border border-slate-700 px-2 py-0.5 rounded-full group-hover/toggle:border-slate-500">
                          <XCircle className="h-3 w-3" />
                          Inactivo
                        </span>
                      )}
                    </button>
                  </td>

                  {/* Acciones */}
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(sponsor)}
                        className="p-1.5 rounded-lg text-[#5FA8D3] hover:text-[#4A96C2] hover:bg-[#0B0F19] transition-colors cursor-pointer"
                        title="Editar patrocinador"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(sponsor)}
                        disabled={deletingId === sponsor.id}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Eliminar patrocinador"
                      >
                        {deletingId === sponsor.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal CRUD */}
      <SponsorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sponsorToEdit={selectedSponsor}
        onSuccess={() => router.refresh()}
      />
    </div>
  )
}
