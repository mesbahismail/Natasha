"use client"

import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  axisLine,
  axisTick,
  BrandGradient,
  FadeGradient,
  gridStroke,
  percentTicks,
  PillDot,
  SlantedTick,
  useChartId,
} from "@/components/natasha/charts/primitives"

type TrendDatum = { value: number; label?: string } & Record<string, string | number | undefined>

/**
 * Line / area trend with a pinned value pill. Hover moves the pill; on idle it
 * rests on `pillIndex`.
 */
export function TrendChart({
  data,
  xKey = "x",
  tickKey,
  variant = "line",
  curve = "monotone",
  fill = "fade",
  grid = "vertical",
  showXAxis = false,
  pillIndex,
  label = "Value",
  className,
}: {
  data: TrendDatum[]
  /** Must be unique per point (the tooltip resolves points by it). */
  xKey?: string
  /** Optional field shown as the x tick label; blank values hide the tick. */
  tickKey?: string
  variant?: "line" | "area"
  curve?: "monotone" | "linear"
  fill?: "fade" | "brand"
  grid?: "vertical" | "horizontal"
  showXAxis?: boolean
  /** Point the pill rests on when nothing is hovered. Each datum's `label` is shown. */
  pillIndex?: number
  label?: string
  className?: string
}) {
  const id = useChartId("trend")
  const config = { value: { label, color: "var(--chart-5)" } } satisfies ChartConfig
  const pill = (props: { cx?: number; cy?: number; payload?: TrendDatum }) => (
    <PillDot
      cx={props.cx}
      cy={props.cy}
      label={props.payload ? (props.payload.label ?? String(props.payload.value)) : ""}
    />
  )

  const axes = (
    <>
      <CartesianGrid vertical={grid === "vertical"} horizontal={grid === "horizontal"} stroke={gridStroke} />
      <YAxis domain={[0, 100]} ticks={percentTicks} tick={axisTick} tickLine={false} axisLine={axisLine} width={32} tickMargin={8} />
      <XAxis
        dataKey={xKey}
        hide={!showXAxis}
        tick={<SlantedTick />}
        tickFormatter={tickKey ? (_, index) => String(data[index]?.[tickKey] ?? "") : undefined}
        tickLine={false}
        axisLine={axisLine}
        interval={0}
        height={showXAxis ? 40 : 0}
      />
      <ChartTooltip cursor={false} defaultIndex={pillIndex} content={() => null} />
    </>
  )

  return (
    <ChartContainer
      config={config}
      className={cn("aspect-auto h-32 w-full [&_.recharts-surface]:overflow-visible", className)}
    >
      {variant === "line" ? (
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          {axes}
          <Line
            dataKey="value"
            type={curve}
            stroke="var(--color-value)"
            strokeWidth={3}
            dot={false}
            activeDot={pill}
            strokeLinecap="round"
          />
        </LineChart>
      ) : (
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            {fill === "brand" ? <BrandGradient id={id} /> : <FadeGradient id={id} />}
          </defs>
          {axes}
          <Area
            dataKey="value"
            type={curve}
            stroke={fill === "brand" ? "none" : "var(--color-value)"}
            strokeWidth={3}
            fill={`url(#${id})`}
            fillOpacity={1}
            dot={false}
            activeDot={pill}
          />
        </AreaChart>
      )}
    </ChartContainer>
  )
}

/* Overlapping areas (lead sources) ---------------------------------------- */

export function LayeredAreaChart({
  data,
  xKey,
  series,
  className,
}: {
  data: Record<string, string | number>[]
  xKey: string
  series: { key: string; label: string; color: string; opacity?: number }[]
  className?: string
}) {
  const config = Object.fromEntries(series.map((s) => [s.key, { label: s.label, color: s.color }])) satisfies ChartConfig
  return (
    <ChartContainer config={config} className={cn("aspect-auto h-64 w-full", className)}>
      <AreaChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke={gridStroke} />
        <YAxis domain={[0, 100]} ticks={percentTicks} tick={axisTick} tickLine={false} axisLine={axisLine} width={32} tickMargin={8} />
        <XAxis dataKey={xKey} tick={<SlantedTick />} tickLine={false} axisLine={axisLine} interval={0} height={40} />
        <ChartTooltip cursor={{ stroke: "var(--border)" }} content={<ChartTooltipContent />} />
        {series.map((s) => (
          <Area
            key={s.key}
            dataKey={s.key}
            type="linear"
            stroke="none"
            fill={`var(--color-${s.key})`}
            fillOpacity={s.opacity ?? 0.7}
            activeDot={{ r: 4, fill: s.color, stroke: "var(--card)", strokeWidth: 2 }}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  )
}

/* Sparkline (pure SVG, no tooltip) ---------------------------------------- */

function smoothPath(points: [number, number][]) {
  if (points.length < 2) return ""
  let d = `M${points[0][0]},${points[0][1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[Math.max(0, i - 1)]
    const [x1, y1] = points[i]
    const [x2, y2] = points[i + 1]
    const [x3, y3] = points[Math.min(points.length - 1, i + 2)]
    const c1x = x1 + (x2 - x0) / 6
    const c1y = y1 + (y2 - y0) / 6
    const c2x = x2 - (x3 - x1) / 6
    const c2y = y2 - (y3 - y1) / 6
    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${x2},${y2}`
  }
  return d
}

export function Sparkline({
  values,
  className,
  width = 144,
  height = 40,
}: {
  values: number[]
  className?: string
  width?: number
  height?: number
}) {
  const id = useChartId("spark")
  const min = Math.min(...values)
  const max = Math.max(...values)
  const points = values.map((v, i): [number, number] => [
    Math.round((i / (values.length - 1)) * width * 100) / 100,
    Math.round((height - 4 - ((v - min) / (max - min || 1)) * (height - 8)) * 100) / 100,
  ])
  const line = smoothPath(points)
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn("h-10 w-36 overflow-visible", className)} aria-hidden>
      <defs>
        <FadeGradient id={id} opacity={0.3} />
      </defs>
      <path d={`${line} L${width},${height} L0,${height} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke="var(--chart-5)" strokeWidth={2} strokeLinecap="round" />
    </svg>
  )
}

export type { TrendDatum }
