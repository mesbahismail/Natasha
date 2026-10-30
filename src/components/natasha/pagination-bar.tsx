"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function pageList(page: number, count: number): (number | "…")[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1)
  if (page <= 3 || page >= count - 2) return [1, 2, 3, "…", count - 2, count - 1, count]
  return [1, "…", page - 1, page, page + 1, "…", count]
}

export function PaginationBar({
  page,
  pageCount,
  onPageChange,
  className,
}: {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  className?: string
}) {
  if (pageCount <= 1) return null
  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-2", className)}>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft />
      </Button>
      {pageList(page, pageCount).map((item, index) =>
        item === "…" ? (
          <span key={`gap-${index}`} aria-hidden className="grid size-8 place-items-center type-body text-subtle-foreground">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
            aria-label={`Page ${item}`}
            className={cn(
              "grid size-8 place-items-center rounded-md border type-body tabular-nums transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
              item === page
                ? "border-primary-border bg-primary text-primary-foreground"
                : "border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            {item}
          </button>
        )
      )}
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Next page"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
        className="text-muted-foreground hover:text-foreground"
      >
        <ChevronRight />
      </Button>
    </nav>
  )
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const current = Math.min(Math.max(1, page), pageCount)
  return {
    page: current,
    pageCount,
    items: items.slice((current - 1) * pageSize, current * pageSize),
  }
}
