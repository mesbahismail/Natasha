import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-40 w-full resize-none rounded-lg border border-input bg-transparent px-4 py-3 type-body-lg text-foreground transition-[border-color,box-shadow] outline-none placeholder:text-subtle-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
