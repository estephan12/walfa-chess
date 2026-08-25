import { cn } from "@/lib/utils"
import { getTournamentStatusLabel } from "@/lib/utils"
import { STATUS_COLORS } from "@/lib/constants"

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colorClass =
    STATUS_COLORS[status as keyof typeof STATUS_COLORS] ??
    "bg-gray-100 text-gray-700"

  const label = getTournamentStatusLabel(status)

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        colorClass,
        className
      )}
      aria-label={`Estado: ${label}`}
    >
      {label}
    </span>
  )
}
