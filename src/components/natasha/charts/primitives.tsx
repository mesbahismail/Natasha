"use client"

import * as React from "react"

/** Shared axis / grid styling so every chart reads as one system. */
export const axisTick = {
  fill: "var(--muted-foreground)",
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.08em",
} as const

export const axisLine = { stroke: "var(--border)" } as const
export const gridStroke = "var(--border)"
export const percentTicks = [0, 25, 50, 75, 100]

type TickProps = {
  x?: number | string
  y?: number | string
  index?: number
  payload?: { value: string | number; index?: number }
  tickFormatter?: (value: string | number, index: number) => string
}

/** Category label rotated −45°, uppercase micro type (OCT, NOV, MON…). */
export function SlantedTick({ x = 0, y = 0, payload, index = 0, tickFormatter }: TickProps) {
  const raw = payload?.value ?? ""
  const value = tickFormatter ? tickFormatter(raw, payload?.index ?? index) : String(raw)
  if (!value) return null
  const nx = Number(x)
  const ny = Number(y) + 12
  return (
    <text
      x={nx}
      y={ny}
      textAnchor="end"
      dominantBaseline="middle"
      transform={`rotate(-45 ${nx} ${ny})`}
      style={{ ...axisTick, textTransform: "uppercase" }}
    >
      {value}
    </text>
  )
}

/** Vertical brand gradient (cyan → indigo) for bars and filled areas. */
export function BrandGradient({ id, from = "var(--gradient-from)", to = "var(--gradient-to)", horizontal }: {
  id: string
  from?: string
  to?: string
  horizontal?: boolean
}) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2={horizontal ? "1" : "0"} y2={horizontal ? "0" : "1"}>
      <stop offset="0%" stopColor={from} />
      <stop offset="100%" stopColor={to} />
    </linearGradient>
  )
}

/** Fading area fill under a line. */
export function FadeGradient({ id, color = "var(--chart-5)", opacity = 0.35 }: { id: string; color?: string; opacity?: number }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={color} stopOpacity={opacity} />
      <stop offset="100%" stopColor={color} stopOpacity={0} />
    </linearGradient>
  )
}

/**
 * Active point marker with a floating value pill — the chart's tooltip is
 * drawn inside the SVG so it stays pinned to the data point.
 */
export function PillDot(props: {
  cx?: number
  cy?: number
  label: string
}) {
  const { cx, cy, label } = props
  if (cx === undefined || cy === undefined) return <g />
  const width = Math.max(48, label.length * 8.4 + 20)
  const height = 32
  const top = cy - height - 16
  return (
    <g pointerEvents="none">
      <circle cx={cx} cy={cy} r={11} fill="var(--primary)" fillOpacity={0.25} />
      <circle cx={cx} cy={cy} r={6} fill="var(--primary)" stroke="var(--primary-light)" strokeWidth={2} />
      <g transform={`translate(${cx - width / 2} ${top})`}>
        <rect width={width} height={height} rx={8} fill="var(--primary)" stroke="var(--primary-light)" />
        <path d={`M${width / 2 - 6} ${height - 0.5}L${width / 2} ${height + 6}L${width / 2 + 6} ${height - 0.5}Z`} fill="var(--primary)" />
        <text
          x={width / 2}
          y={height / 2}
          dominantBaseline="central"
          textAnchor="middle"
          fill="var(--primary-foreground)"
          fontSize={14}
          fontWeight={500}
        >
          {label}
        </text>
      </g>
    </g>
  )
}

export function useChartId(prefix: string) {
  return `${prefix}-${React.useId().replace(/:/g, "")}`
}
