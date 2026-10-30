import * as React from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/**
 * Page frame. Gutter is 16px on mobile and 32px from `md`; header and toolbar
 * sit 24px further in so their content lines up with card content.
 */
export function Page({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex min-w-0 flex-1 flex-col px-4 pb-8 md:px-8", className)}
      {...props}
    />
  )
}

/** Row under the header: filters on the left, actions on the right. */
export function PageToolbar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 py-6 md:mx-6",
        className
      )}
      {...props}
    />
  )
}

/** Main content area; adds the 24px top gap when there is no toolbar. */
export function PageContent({
  className,
  spaced,
  ...props
}: React.ComponentProps<"div"> & { spaced?: boolean }) {
  return (
    <div
      className={cn("flex min-w-0 flex-col gap-6", spaced && "pt-6", className)}
      {...props}
    />
  )
}

/** Toolbar back link, e.g. "‹ All sales". */
export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Button variant="secondary" size="lg" className="pr-4 pl-3" asChild>
      <Link href={href}>
        <ChevronLeft />
        {children}
      </Link>
    </Button>
  )
}
