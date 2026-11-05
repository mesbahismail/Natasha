"use client"

import * as React from "react"
import { Pie, PieChart } from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatCompact } from "@/lib/natasha/format"
import { useChartId } from "@/components/natasha/charts/primitives"

/* Donut / pie -------------------------------------------------------------- */

export function DonutChart({
  data,
  innerRadius = "62%",
  className,
  valueSuffix = "%",
}: {
  data: { name: string; value: number; fill: string }[]
  innerRadius?: string | number
  className?: string
  valueSuffix?: string
}) {
  const config = Object.fromEntries(data.map((d) => [d.name, { label: d.name, color: d.fill }])) satisfies ChartConfig
  return (
    <ChartContainer config={config} className={cn("aspect-square w-full max-w-56", className)}>
      <PieChart>
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              nameKey="name"
              formatter={(value, name, item) => (
                <span className="flex w-full items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="size-2.5 rounded-full" style={{ background: item.payload.fill }} />
                    {name}
                  </span>
                  <span className="tabular-nums text-foreground">
                    {value}
                    {valueSuffix}
                  </span>
                </span>
              )}
            />
          }
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={innerRadius}
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
          stroke="none"
          isAnimationActive
        />
      </PieChart>
    </ChartContainer>
  )
}

/* Geometry helpers --------------------------------------------------------- */

/** Rounded to 0.01 so server and browser trig agree (no hydration drift). */
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180
  const round = (n: number) => Math.round(n * 100) / 100
  return [round(cx + r * Math.sin(rad)), round(cy - r * Math.cos(rad))] as const
}

function arc(cx: number, cy: number, r: number, from: number, to: number) {
  const [x0, y0] = polar(cx, cy, r, from)
  const [x1, y1] = polar(cx, cy, r, to)
  const large = to - from > 180 ? 1 : 0
  return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`
}

/* Gauge -------------------------------------------------------------------- */

export function Gauge({
  value,
  max = 100,
  className,
  children,
  footer,
}: {
  /** 0–max */
  value: number
  max?: number
  className?: string
  /** Rendered in the middle of the arc. */
  children?: React.ReactNode
  /** Rendered beneath the arc and its endpoint labels. */
  footer?: React.ReactNode
}) {
  const id = useChartId("gauge")
  const sweep = 200
  const start = -sweep / 2
  const ratio = Math.min(Math.max(value / max, 0), 1)
  const [lx, ly] = polar(100, 100, 82, start)
  const [rx, ry] = polar(100, 100, 82, start + sweep)

  return (
    <div className={cn("relative mx-auto aspect-[200/176] w-full max-w-56", className)}>
      <svg viewBox="0 0 200 176" className="size-full overflow-visible" role="img" aria-label={`${Math.round(ratio * 100)}% of target`}>
        <defs>
          <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--chart-4)" />
            <stop offset="55%" stopColor="var(--chart-3)" />
            <stop offset="100%" stopColor="var(--chart-1)" />
          </linearGradient>
        </defs>
        <path d={arc(100, 100, 82, start, start + sweep)} fill="none" stroke="var(--track)" strokeWidth={16} strokeLinecap="round" />
        <path
          d={arc(100, 100, 82, start, start + sweep * ratio)}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={16}
          strokeLinecap="round"
        />
        <text x={lx} y={ly + 24} textAnchor="middle" fill="var(--muted-foreground)" fontSize={10} fontWeight={600}>
          0
        </text>
        <text x={rx} y={ry + 24} textAnchor="middle" fill="var(--muted-foreground)" fontSize={10} fontWeight={600}>
          {formatCompact(max)}
        </text>
      </svg>
      <div className="absolute inset-x-0 top-[57%] flex -translate-y-1/2 justify-center">{children}</div>
      {footer && <div className="absolute inset-x-0 bottom-0 flex justify-center">{footer}</div>}
    </div>
  )
}

/* Concentric progress rings ----------------------------------------------- */

export function RadialRings({
  data,
  className,
}: {
  data: { name: string; value: number; color: string }[]
  className?: string
}) {
  const size = 240
  const c = size / 2
  const stroke = 8
  const gap = 12
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={cn("aspect-square w-full max-w-60", className)} role="img" aria-label="Traffic sources">
      {[...data].reverse().map((d, i) => {
        const r = c - stroke / 2 - i * (stroke + gap)
        const circumference = 2 * Math.PI * r
        return (
          <g key={d.name}>
            <title>{`${d.name}: ${d.value}%`}</title>
            <circle cx={c} cy={c} r={r} fill="none" stroke="var(--accent)" strokeWidth={stroke} />
            <circle
              cx={c}
              cy={c}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${(d.value / 100) * circumference} ${circumference}`}
              transform={`rotate(-90 ${c} ${c})`}
            />
          </g>
        )
      })}
    </svg>
  )
}

/* Ring progress (ratings) ------------------------------------------------- */

export function RingProgress({ value, max = 5, className }: { value: number; max?: number; className?: string }) {
  const r = 19
  const circumference = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 48 48" className={cn("size-12 shrink-0", className)} aria-hidden>
      <circle cx="24" cy="24" r={r} fill="none" stroke="var(--accent)" strokeWidth={4} />
      <circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={`${(value / max) * circumference} ${circumference}`}
        transform="rotate(-90 24 24)"
      />
    </svg>
  )
}

/* Radar (hexagon) ---------------------------------------------------------- */

export function CategoryRadar({
  data,
  className,
}: {
  data: { category: string; value: number }[]
  className?: string
}) {
  const id = useChartId("radar")
  const cx = 200
  const cy = 156
  const R = 112
  const n = data.length
  const vertex = (i: number, r: number) => polar(cx, cy, r, (360 / n) * i)
  const outline = data.map((_, i) => vertex(i, R).join(",")).join(" ")
  const shape = data.map((d, i) => vertex(i, (d.value / 100) * (R - 10)).join(",")).join(" ")

  return (
    <svg viewBox="0 0 400 312" className={cn("w-full", className)} role="img" aria-label="Top categories">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--gradient-from)" />
          <stop offset="100%" stopColor="var(--gradient-to)" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <polygon points={outline} fill="none" stroke="var(--input)" strokeWidth={1.5} />
      <polygon points={shape} fill={`url(#${id})`} opacity={0.35} filter={`url(#${id}-glow)`} />
      <polygon points={shape} fill={`url(#${id})`} stroke="var(--primary-light)" strokeOpacity={0.4} />
      {data.map((d, i) => {
        const [x, y] = vertex(i, R)
        const [lx, ly] = vertex(i, R + 22)
        const angle = (360 / n) * i
        const anchor = angle === 0 || angle === 180 ? "middle" : angle < 180 ? "start" : "end"
        const offsetX = anchor === "start" ? 6 : anchor === "end" ? -6 : 0
        return (
          <g key={d.category}>
            <title>{`${d.category}: ${d.value}`}</title>
            <circle cx={x} cy={y} r={5} fill="var(--subtle-foreground)" />
            <text
              x={lx + offsetX}
              y={ly + (angle === 0 ? -4 : angle === 180 ? 8 : 4)}
              textAnchor={anchor}
              dominantBaseline="middle"
              fill="var(--foreground)"
              fontSize={14}
              fontWeight={500}
            >
              {d.category}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
