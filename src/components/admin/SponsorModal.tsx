"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { X, Upload, Loader2, Link as LinkIcon, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SPONSOR_TIER_LABELS } from "@/lib/constants"
import {
  createSponsorAction,
  updateSponsorAction,
  uploadSponsorLogoAction,
} from "@/lib/actions/sponsorActions"
import type { Sponsor, SponsorTier } from "@/types"

interface SponsorModalProps {
  isOpen: boolean
  onClose: () => void
  sponsorToEdit?: Sponsor | null
  onSuccess: () => void
}

export function SponsorModal({
  isOpen,
  onClose,
  sponsorToEdit,
  onSuccess,
}: SponsorModalProps) {
  const [name, setName] = useState("")
  const [tier, setTier] = useState<SponsorTier>("bronze")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [sortOrder, setSortOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)

  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      if (sponsorToEdit) {
        setName(sponsorToEdit.name)
        setTier(sponsorToEdit.tier)
        setWebsiteUrl(sponsorToEdit.website_url ?? "")
        setLogoUrl(sponsorToEdit.logo_url ?? "")
        setSortOrder(sponsorToEdit.sort_order)
        setIsActive(sponsorToEdit.is_active)
      } else {
        setName("")
        setTier("bronze")
        setWebsiteUrl("")
        setLogoUrl("")
        setSortOrder(0)
        setIsActive(true)
      }
      setErrorMessage(null)
    }
  }, [isOpen, sponsorToEdit])

  // Manejo de tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSaving && !isUploading) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, isSaving, isUploading, onClose])

  if (!isOpen) return null

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setErrorMessage(null)

    const formData = new FormData()
    formData.append("file", file)

    const res = await uploadSponsorLogoAction(formData)
    if (res.success) {
      setLogoUrl(res.data)
    } else {
      setErrorMessage(res.error ?? "Error al subir la imagen")
    }
    setIsUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!name.trim()) {
      setErrorMessage("El nombre del patrocinador es obligatorio")
      return
    }

    setIsSaving(true)

    const payload = {
      name: name.trim(),
      tier,
      website_url: websiteUrl.trim() || null,
      logo_url: logoUrl.trim() || null,
      sort_order: Number(sortOrder) || 0,
      is_active: isActive,
    }

    const res = sponsorToEdit
      ? await updateSponsorAction(sponsorToEdit.id, payload)
      : await createSponsorAction(payload)

    if (res.success) {
      setIsSaving(false)
      onSuccess()
      onClose()
    } else {
      setErrorMessage(res.error ?? "Ocurrió un error al procesar la solicitud")
      setIsSaving(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-[#2B5B84] bg-[#132238] shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2B5B84]/60 bg-[#0B0F19]/60">
          <h2 className="text-lg font-bold text-[#F0F4F8]">
            {sponsorToEdit ? "Editar Patrocinador" : "Nuevo Patrocinador"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving || isUploading}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F0F4F8] hover:bg-[#132238] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-950/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-[#F0F4F8] mb-1.5">
              Nombre de la Empresa o Entidad <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Banco BHD, Banreservas, Claro..."
              className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-3.5 py-2.5 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:border-[#5FA8D3] focus:outline-none"
            />
          </div>

          {/* Nivel / Tier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#F0F4F8] mb-1.5">
                Nivel de Patrocinio
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as SponsorTier)}
                className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-3 py-2.5 text-sm text-[#F0F4F8] focus:border-[#5FA8D3] focus:outline-none"
              >
                {Object.entries(SPONSOR_TIER_LABELS).map(([val, label]) => (
                  <option key={val} value={val} className="bg-[#0B0F19] text-[#F0F4F8]">
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F0F4F8] mb-1.5">
                Orden de Visualización
              </label>
              <input
                type="number"
                min="0"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] px-3.5 py-2.5 text-sm text-[#F0F4F8] focus:border-[#5FA8D3] focus:outline-none"
              />
              <p className="text-[10px] text-[#94A3B8] mt-1">Menor número aparece primero</p>
            </div>
          </div>

          {/* Sitio Web */}
          <div>
            <label className="block text-xs font-semibold text-[#F0F4F8] mb-1.5">
              Sitio Web Oficial (Opcional)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#94A3B8]">
                <LinkIcon className="h-4 w-4" />
              </span>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://empresa.com"
                className="w-full rounded-xl border border-[#2B5B84] bg-[#0B0F19] pl-9 pr-3.5 py-2.5 text-sm text-[#F0F4F8] placeholder-[#94A3B8]/60 focus:border-[#5FA8D3] focus:outline-none"
              />
            </div>
          </div>

          {/* Subida de Logo */}
          <div>
            <label className="block text-xs font-semibold text-[#F0F4F8] mb-1.5">
              Logo Corporativo (PNG, SVG, JPG o WebP)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleFileUpload}
              className="hidden"
            />

            {logoUrl ? (
              <div className="relative flex items-center justify-between p-3 rounded-xl border border-[#2B5B84] bg-[#0B0F19]">
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-24 bg-white/10 rounded-lg p-1 flex items-center justify-center overflow-hidden border border-white/20">
                    <Image
                      src={logoUrl}
                      alt="Logo preview"
                      fill
                      className="object-contain p-1"
                      sizes="96px"
                    />
                  </div>
                  <div className="text-xs">
                    <p className="text-[#F0F4F8] font-medium truncate max-w-[200px]">Logo cargado</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="text-[#5FA8D3] hover:underline font-semibold text-[11px] mt-0.5 block text-left"
                    >
                      Reemplazar imagen
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLogoUrl("")}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                  title="Quitar logo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-[#2B5B84] hover:border-[#5FA8D3] bg-[#0B0F19]/40 hover:bg-[#0B0F19] transition-all cursor-pointer group"
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 text-[#5FA8D3] animate-spin" />
                    <span className="text-xs text-[#94A3B8]">Subiendo a Storage...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-[#94A3B8] group-hover:text-[#5FA8D3] transition-colors mb-2" />
                    <span className="text-xs font-semibold text-[#F0F4F8]">
                      Haz clic para subir el logo
                    </span>
                    <span className="text-[11px] text-[#94A3B8] mt-0.5">
                      Fondo transparente (PNG o SVG) recomendado
                    </span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Toggle Activo */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-[#2B5B84]/60 bg-[#0B0F19]/40">
            <div>
              <p className="text-xs font-semibold text-[#F0F4F8]">Estado del Patrocinador</p>
              <p className="text-[11px] text-[#94A3B8]">
                {isActive ? "Visible en la web pública" : "Oculto del público"}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isActive ? "bg-[#5FA8D3]" : "bg-slate-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving || isUploading}
              className="border-[#2B5B84] text-[#94A3B8] hover:text-[#F0F4F8] hover:bg-[#0B0F19]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSaving || isUploading}
              className="bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-bold"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Guardando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>{sponsorToEdit ? "Actualizar" : "Guardar Patrocinador"}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
