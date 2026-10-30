import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-lg border border-input bg-transparent px-4 type-body-lg text-foreground transition-[border-color,box-shadow] outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:type-body file:text-foreground placeholder:text-subtle-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/25 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
