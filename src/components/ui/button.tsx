import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-brand-accent focus-visible:ring-2 focus-visible:ring-brand-accent/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#5FA8D3] text-[#0B0F19] hover:bg-[#4A96C2] font-semibold shadow-sm",
        outline:
          "border border-[#2B5B84] bg-transparent text-[#F0F4F8] hover:bg-[#132238] hover:border-[#5FA8D3]",
        secondary:
          "bg-[#132238] text-[#F0F4F8] border border-[#2B5B84] hover:bg-[#1a2d4a]",
        ghost:
          "text-[#94A3B8] hover:bg-[#132238] hover:text-[#F0F4F8]",
        destructive:
          "bg-red-950/60 text-red-300 border border-red-800/60 hover:bg-red-900/60",
        link: "text-[#5FA8D3] underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-2 px-4 py-2 text-sm font-medium",
        xs: "h-6 gap-1 rounded-md px-2 text-xs",
        sm: "h-8 gap-1.5 rounded-md px-3 text-xs",
        lg: "h-11 gap-2.5 rounded-lg px-6 text-base font-semibold",
        icon: "size-9 rounded-lg",
        "icon-xs": "size-6 rounded-md",
        "icon-sm": "size-8 rounded-md",
        "icon-lg": "size-11 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
