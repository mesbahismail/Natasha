import * as React from "react"
import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatDelta } from "@/lib/natasha/format"
import { Badge } from "@/components/ui/badge"

/* Status ------------------------------------------------------------------- */

const statusVariant = {
  completed: "success",
  pending: "warning",
  canceled: "danger",
} as const

export function StatusBadge({ status }: { status: keyof typeof statusVariant }) {
  return <Badge variant={statusVariant[status]}>{status}</Badge>
}

/* Delta -------------------------------------------------------------------- */

/**
 * Trend indicator. `inverse` flips the color logic for metrics where going up
 * is bad (e.g. abandoned carts).
 */
export function Delta({
  value,
  digits = 0,
  arrow = "start",
  inverse,
  className,
}: {
  value: number
  digits?: number
  arrow?: "start" | "end"
  inverse?: boolean
  className?: string
}) {
  const up = value >= 0
  const good = inverse ? !up : up
  const Icon = up ? ArrowUp : ArrowDown
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 type-caption whitespace-nowrap tabular-nums",
        good ? "text-success" : "text-danger",
        className
      )}
    >
      {arrow === "start" && <Icon className="size-3.5" strokeWidth={2.5} />}
      {formatDelta(value, digits)}
      {arrow === "end" && <Icon className="size-3.5" strokeWidth={2.5} />}
    </span>
  )
}

/* Icon tile ---------------------------------------------------------------- */

export function IconTile({
  icon: Icon,
  className,
}: {
  icon: LucideIcon
  className?: string
}) {
  return (
    <span
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-lg border border-primary-soft-border bg-primary-soft text-primary-light shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]",
        className
      )}
    >
      <Icon className="size-6" strokeWidth={2} />
    </span>
  )
}

/* Stat tile ---------------------------------------------------------------- */

export function StatTile({
  icon: Icon,
  value,
  label,
  delta,
  className,
}: {
  icon: LucideIcon
  value: React.ReactNode
  label: string
  delta?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-8 rounded-xl border border-border bg-secondary p-5",
        className
      )}
    >
      <Icon className="size-6 text-primary" strokeWidth={2} />
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="type-metric-xs text-foreground">{value}</span>
          {delta !== undefined && <Delta value={delta} />}
        </div>
        <span className="type-body text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}

/* Big metric --------------------------------------------------------------- */

export function Metric({
  value,
  delta,
  deltaDigits = 2,
  size = "lg",
  className,
}: {
  value: React.ReactNode
  delta?: number
  deltaDigits?: number
  size?: "xl" | "lg"
  className?: string
}) {
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-3", className)}>
      <span className={cn("text-foreground", size === "xl" ? "type-metric-xl" : "type-metric-lg")}>
        {value}
      </span>
      {delta !== undefined && <Delta value={delta} digits={deltaDigits} arrow="end" className="type-body" />}
    </div>
  )
}

/* Form field label --------------------------------------------------------- */

export function FieldLabel({ className, ...props }: React.ComponentProps<"label">) {
  return <label className={cn("block truncate px-2 pb-3 type-micro text-muted-foreground", className)} {...props} />
}

/* Legend ------------------------------------------------------------------- */

export function LegendDot({
  color,
  label,
  variant = "dot",
  className,
}: {
  color: string
  label: React.ReactNode
  variant?: "dot" | "ring"
  className?: string
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 type-body text-foreground", className)}>
      <span
        aria-hidden
        className={cn("size-4 shrink-0 rounded-full", variant === "ring" && "border-[3px] bg-transparent")}
        style={variant === "ring" ? { borderColor: color } : { backgroundColor: color }}
      />
      {label}
    </span>
  )
}

/* Striped key/value list --------------------------------------------------- */

/**
 * Label/value rows with alternating sunken stripes. Rows bleed 12px past the
 * card padding so labels stay on the card's 24px content line.
 */
export function StripedList({
  items,
  className,
}: {
  items: { label: string; value: React.ReactNode }[]
  className?: string
}) {
  return (
    <dl className={cn("-mx-3 flex flex-col", className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className="flex min-h-12 items-center justify-between gap-6 rounded-lg px-3 py-2 type-body-lg odd:bg-background/60"
        >
          <dt className="shrink-0 text-muted-foreground">{item.label}</dt>
          <dd className="min-w-0 truncate text-right text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
