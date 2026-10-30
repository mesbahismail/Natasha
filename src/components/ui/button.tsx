import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border whitespace-nowrap transition-[background-color,border-color,color,box-shadow,opacity] outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-danger [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          "border-primary-border bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.16)] hover:bg-[color-mix(in_srgb,var(--primary),white_10%)]",
        secondary:
          "border-border bg-secondary text-secondary-foreground hover:bg-accent aria-expanded:bg-accent [&_svg]:text-muted-foreground",
        outline:
          "border-border bg-transparent text-foreground hover:bg-secondary aria-expanded:bg-secondary",
        ghost:
          "border-transparent bg-transparent text-foreground hover:bg-secondary aria-expanded:bg-secondary",
        soft: "border-primary-soft-border bg-primary-soft text-foreground hover:bg-[color-mix(in_srgb,var(--primary-soft),white_8%)]",
        destructive:
          "border-destructive-border bg-destructive text-destructive-foreground hover:bg-[color-mix(in_srgb,var(--destructive),white_8%)] focus-visible:ring-danger/40",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 gap-1.5 rounded-md px-3 type-body [&_svg:not([class*='size-'])]:size-4",
        default: "h-10 gap-2 rounded-md px-4 type-body-lg",
        lg: "h-11 gap-2 rounded-lg px-4 type-body-lg",
        xl: "h-12 gap-2 rounded-lg px-5 type-body-lg",
        "icon-sm": "size-8 rounded-md [&_svg:not([class*='size-'])]:size-4",
        icon: "size-10 rounded-md",
        "icon-lg": "size-11 rounded-lg",
        "icon-xl": "size-12 rounded-lg",
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
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
