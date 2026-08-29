import type { SVGProps } from "react"

export function ChessKnightIcon({
  className = "h-6 w-6 text-[#5FA8D3]",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {/* Base del caballo */}
      <path d="M4 21h16v-2H4v2z" />
      {/* Pedestal intermedio */}
      <path d="M6 19h12v-1.5c0-.8-.6-1.5-1.5-1.5h-9c-.9 0-1.5.7-1.5 1.5V19z" />
      {/* Cuerpo y cabeza de la pieza de caballo de ajedrez */}
      <path d="M16.5 16c-.8-1.5-1.2-2.6-1.2-3.8 0-1.2.6-2.2 1.4-3.2.5-.6.8-1.4.8-2.2 0-2.1-1.7-3.8-3.8-3.8-.5 0-1 .1-1.5.3-.4-.9-1.2-1.3-2.2-1.3-.8 0-1.5.4-2 1-.5-.2-1.1-.2-1.7 0-.9.3-1.6 1-1.9 1.9-.3.9-.1 1.9.4 2.7.2.3.2.7.1 1.1l-.8 2.5c-.3 1 .1 2 .9 2.5l2.4 1.5c.3.2.5.5.5.9v.8h8.5z" />
      {/* Ojo del caballo */}
      <circle cx="10" cy="7.5" r="0.9" fill="#0B0F19" />
    </svg>
  )
}
