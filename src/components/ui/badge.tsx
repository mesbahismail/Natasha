import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-ring/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-primary-border bg-primary text-primary-foreground",
        secondary: "border-border bg-secondary text-secondary-foreground",
        outline: "border-border bg-transparent text-foreground",
        soft: "border-primary-soft-border bg-primary-soft text-foreground",
        success: "border-success-border bg-success-soft text-success",
        warning: "border-warning-border bg-warning-soft text-warning",
        danger: "border-danger-border bg-danger-soft text-danger",
      },
      size: {
        default: "h-6 rounded-md px-2 type-micro",
        pill: "h-6 min-w-8 rounded-full px-2 type-caption",
        tag: "h-8 rounded-md px-2 type-body",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
