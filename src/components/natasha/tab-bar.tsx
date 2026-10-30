"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type TabBarItem<T extends string> = { value: T; label: string }

/**
 * Text tabs with a filled active pill. The first label is optically aligned
 * with the page title (the pill bleeds 12px to the left).
 */
export function TabBar<T extends string>({
  items,
  value,
  onValueChange,
  label,
  className,
}: {
  items: TabBarItem<T>[]
  value: T | null
  onValueChange: (value: T) => void
  label: string
  className?: string
}) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([])

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0
    if (!delta) return
    event.preventDefault()
    const next = (index + delta + items.length) % items.length
    refs.current[next]?.focus()
    onValueChange(items[next].value)
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        "-ml-3 flex items-center gap-2 max-md:no-scrollbar max-md:max-w-[calc(100%+12px)] max-md:overflow-x-auto",
        className
      )}
    >
      {items.map((item, index) => {
        const selected = item.value === value
        return (
          <button
            key={item.value}
            ref={(node) => {
              refs.current[index] = node
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected || (value === null && index === 0) ? 0 : -1}
            onClick={() => onValueChange(item.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              "h-10 shrink-0 rounded-md border px-3 type-body-lg whitespace-nowrap transition-[background-color,border-color,color] outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
              selected
                ? "border-primary-border bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.16)]"
                : "border-transparent text-foreground hover:bg-secondary"
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
