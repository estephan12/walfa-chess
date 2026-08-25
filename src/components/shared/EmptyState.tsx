import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl bg-[#132238] border border-[#2B5B84] shadow-lg",
        className
      )}
    >
      {Icon && (
        <div className="mb-4 rounded-2xl bg-[#0B0F19] border border-[#2B5B84] p-4 shadow-inner" aria-hidden="true">
          <Icon className="h-8 w-8 text-[#5FA8D3]" />
        </div>
      )}
      <h3 className="text-lg font-bold text-[#F0F4F8]">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-[#94A3B8] leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
