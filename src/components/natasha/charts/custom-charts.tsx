"use client"

import { cn } from "@/lib/utils"
import { formatCompact } from "@/lib/natasha/format"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useChartId } from "@/components/natasha/charts/primitives"

/** Blend between the brand's deepest (0) and brightest (1) chart colors. */
export function rampColor(t: number) {
  const pct = Math.round(Math.min(Math.max(t, 0), 1) * 100)
  return `color-mix(in oklab, var(--chart-1) ${pct}%, var(--chart-4))`
}

/* Bubble chart ------------------------------------------------------------- */

export function BubbleChart({
  data,
  className,
}: {
  data: { category: string; rate: number }[]
  className?: string
}) {
  const id = useChartId("bubble")
  const W = 480
  const H = 300
  const left = 40
  const right = 16
  const top = 12
  const bottom = 88
  const maxY = 1.25
  const ticks = [0, 0.25, 0.5, 0.75, 1, 1.25]
  const y = (v: number) => top + (1 - v / maxY) * (H - top - bottom)
  const step = (W - left - right) / data.length
  const max = Math.max(...data.map((d) => d.rate))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("w-full", className)} role="img" aria-label="Conversion rate by category">
      <defs>
        {data.map((d, i) => (
          <radialGradient key={i} id={`${id}-${i}`} cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor={rampColor(0.35 + (d.rate / max) * 0.65)} />
            <stop offset="100%" stopColor={rampColor((d.rate / max) * 0.55)} />
          </radialGradient>
        ))}
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={left} x2={W - right} y1={y(t)} y2={y(t)} stroke="var(--border)" />
          <text x={left - 10} y={y(t)} textAnchor="end" dominantBaseline="middle" fill="var(--muted-foreground)" fontSize={10} fontWeight={600}>
            {t === 0 ? "0" : t.toFixed(2).replace(/0$/, "")}
          </text>
        </g>
      ))}
      <line x1={left} x2={left} y1={top} y2={H - bottom} stroke="var(--border)" />
      {data.map((d, i) => {
        const cx = left + step * (i + 0.5)
        const cy = y(d.rate)
        const r = 18 + (d.rate / max) * 22
        return (
          <g key={d.category}>
            <title>{`${d.category}: ${d.rate.toFixed(2)}%`}</title>
            <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-${i})`} />
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#fff"
              fontSize={r > 30 ? 18 : r > 24 ? 13 : 10}
              fontWeight={600}
            >
              {d.rate.toFixed(2)}%
            </text>
            <text
              x={cx}
              y={H - bottom + 18}
              textAnchor="end"
              transform={`rotate(-45 ${cx} ${H - bottom + 18})`}
              fill="var(--muted-foreground)"
              fontSize={10}
              fontWeight={600}
              letterSpacing="0.08em"
            >
              {d.category.toUpperCase()}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* Heatmap ------------------------------------------------------------------ */

export function Heatmap({
  rows,
  columns,
  values,
  className,
}: {
  rows: string[]
  columns: readonly string[]
  values: number[][]
  className?: string
}) {
  return (
    <div className={cn("grid grid-cols-[40px_1fr] gap-x-3", className)}>
      {/* Labels share the cells' 20px rows + 6px gaps so they stay aligned. */}
      <div className="grid content-start gap-1.5">
        {rows.map((row) => (
          <span key={row} className="flex h-5 items-center justify-end type-micro text-muted-foreground">
            {row}
          </span>
        ))}
      </div>
      <div className="border-l border-border pl-3">
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
          {values.flatMap((row, r) =>
            row.map((v, c) => (
              <Tooltip key={`${r}-${c}`}>
                <TooltipTrigger asChild>
                  <span
                    tabIndex={0}
                    aria-label={`${columns[c]} ${rows[r]}: ${Math.round(v * 100)}%`}
                    className="h-5 rounded-xs outline-none transition-transform hover:scale-y-110 focus-visible:ring-2 focus-visible:ring-ring"
                    style={{ background: rampColor(v) }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {columns[c]} · {rows[r]} — <span className="tabular-nums">{Math.round(v * 100)}%</span>
                </TooltipContent>
              </Tooltip>
            ))
          )}
        </div>
        <div className="mt-3 grid border-t border-border pt-3" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
          {columns.map((col) => (
            <span key={col} className="h-8 origin-top-right -translate-x-1/2 -rotate-45 text-right type-micro text-muted-foreground">
              {col}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* Funnel ------------------------------------------------------------------- */

const funnelColors = ["var(--chart-4)", "var(--chart-3)", "var(--chart-2)", "var(--chart-1)"]

export function Funnel({
  data,
  className,
}: {
  data: { stage: string; value: number }[]
  className?: string
}) {
  const widths = [1, 0.76, 0.52, 0.3, 0.16]
  return (
    <ol className={cn("flex flex-col gap-2", className)}>
      {data.map((d, i) => {
        const top = widths[i]
        const bottom = widths[i + 1]
        const inset = ((top - bottom) / 2 / top) * 100
        const last = i === data.length - 1
        return (
          <li key={d.stage} className="grid grid-cols-[112px_1fr] items-end">
            <span className="border-b border-border pb-2 type-body-lg text-muted-foreground">{d.stage}</span>
            <div className="relative h-14">
              <span
                aria-hidden
                className="absolute bottom-0 left-0 border-b border-border"
                style={{ width: `calc(${((1 - bottom) / 2) * 100}% - 8px)` }}
              />
              <span
                className={cn(
                  "absolute inset-y-0 grid place-items-center type-title tabular-nums",
                  last ? "text-[#04263d]" : "text-white"
                )}
                style={{
                  left: `${((1 - top) / 2) * 100}%`,
                  width: `${top * 100}%`,
                  background: funnelColors[i % funnelColors.length],
                  clipPath: `polygon(0 0, 100% 0, ${100 - inset}% 100%, ${inset}% 100%)`,
                  borderRadius: 6,
                }}
              >
                {formatCompact(d.value)}
              </span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
