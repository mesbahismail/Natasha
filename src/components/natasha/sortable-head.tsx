"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { TableHead } from "@/components/ui/table"

export type SortDirection = "asc" | "desc"
export type SortState<K extends string> = { key: K; dir: SortDirection }

/**
 * Sort state for a table (`null` keeps the source order). Clicking the active
 * column flips direction; a new column starts ascending for text and
 * descending for numbers and dates.
 */
export function useSort<K extends string>(initial: SortState<K> | null, textKeys: readonly K[] = []) {
  const [sort, setSort] = React.useState(initial)
  const toggle = React.useCallback(
    (key: K) =>
      setSort((s) =>
        s?.key === key
          ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
          : { key, dir: textKeys.includes(key) ? "asc" : "desc" }
      ),
    [textKeys]
  )
  return [sort, toggle] as const
}

/** Sort rows by `compare` according to the current direction. */
export function sortRows<T, K extends string>(
  rows: T[],
  sort: SortState<K> | null,
  compare: (a: T, b: T, key: K) => number
) {
  if (!sort) return rows
  const list = [...rows].sort((a, b) => compare(a, b, sort.key))
  return sort.dir === "desc" ? list.reverse() : list
}

export function SortableHead<K extends string>({
  column,
  label,
  sort,
  onSort,
  className,
}: {
  column: K
  label: string
  sort: SortState<K> | null
  onSort: (key: K) => void
  className?: string
}) {
  const active = sort?.key === column
  return (
    <TableHead
      className={cn("px-2", className)}
      aria-sort={active ? (sort?.dir === "asc" ? "ascending" : "descending") : "none"}
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          "-mx-1 inline-flex items-center gap-1 rounded-sm px-1 uppercase outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40",
          active && "text-foreground"
        )}
      >
        {label}
        <ChevronDown
          className={cn("size-3.5 transition-transform", active && sort?.dir === "asc" && "rotate-180")}
          strokeWidth={3}
        />
      </button>
    </TableHead>
  )
}
