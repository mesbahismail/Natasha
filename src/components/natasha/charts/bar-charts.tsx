"use client"

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

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
  gridStroke,
  percentTicks,
  SlantedTick,
  useChartId,
} from "@/components/natasha/charts/primitives"

type Datum = Record<string, string | number>

/* Grouped bars ------------------------------------------------------------- */

export function GroupedBarChart({
  data,
  xKey,
  series,
  barSize = 24,
  barGap = 8,
  className,
}: {
  data: Datum[]
  xKey: string
  series: { key: string; label: string; color: string }[]
  barSize?: number
  barGap?: number
  className?: string
}) {
  const config = Object.fromEntries(
    series.map((s) => [s.key, { label: s.label, color: s.color }])
  ) satisfies ChartConfig

  return (
    <ChartContainer config={config} className={cn("aspect-auto h-56 w-full", className)}>
      <BarChart data={data} barGap={barGap} margin={{ top: 8, right: 0, bottom: 0, left: 0 }} accessibilityLayer>
        <CartesianGrid vertical={false} stroke={gridStroke} />
        <YAxis
          domain={[0, 100]}
          ticks={percentTicks}
          tick={axisTick}
          tickLine={false}
          axisLine={axisLine}
          width={32}
          tickMargin={8}
        />
        <XAxis dataKey={xKey} tick={<SlantedTick />} tickLine={false} axisLine={axisLine} interval={0} height={40} />
        <ChartTooltip cursor={{ fill: "var(--secondary)", opacity: 0.6 }} content={<ChartTooltipContent />} />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} fill={`var(--color-${s.key})`} radius={[4, 4, 0, 0]} barSize={barSize} />
        ))}
      </BarChart>
    </ChartContainer>
  )
}

/* Single-series gradient bars --------------------------------------------- */

export function GradientBarChart({
  data,
  xKey,
  yKey,
  label = "Value",
  barSize = 56,
  radius = 2,
  showYAxis = true,
  className,
  valuePrefix = "",
  valueSuffix = "",
}: {
  data: Datum[]
  xKey: string
  yKey: string
  label?: string
  barSize?: number
  radius?: number
  showYAxis?: boolean
  className?: string
  valuePrefix?: string
  valueSuffix?: string
}) {
  const id = useChartId("bar")
  const config = { [yKey]: { label, color: "var(--chart-2)" } } satisfies ChartConfig

  return (
    <ChartContainer config={config} className={cn("aspect-auto h-56 w-full", className)}>
      <BarChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }} accessibilityLayer>
        <defs>
          <BrandGradient id={id} />
        </defs>
        <CartesianGrid vertical={false} stroke={gridStroke} />
        <YAxis
          hide={!showYAxis}
          domain={[0, 100]}
          ticks={percentTicks}
          tick={axisTick}
          tickLine={false}
          axisLine={axisLine}
          width={32}
          tickMargin={8}
        />
        <XAxis dataKey={xKey} tick={<SlantedTick />} tickLine={false} axisLine={axisLine} interval={0} height={40} />
        <ChartTooltip
          cursor={{ fill: "var(--secondary)", opacity: 0.6 }}
          content={
            <ChartTooltipContent
              hideIndicator
              formatter={(value) => (
                <span className="flex w-full justify-between gap-4">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="tabular-nums text-foreground">
                    {valuePrefix}
                    {Number(value).toLocaleString()}
                    {valueSuffix}
                  </span>
                </span>
              )}
            />
          }
        />
        <Bar dataKey={yKey} fill={`url(#${id})`} radius={[radius, radius, 0, 0]} barSize={barSize} />
      </BarChart>
    </ChartContainer>
  )
}

/* Horizontal bars ---------------------------------------------------------- */

export function HorizontalBarChart({
  data,
  categoryKey,
  valueKey,
  label = "Visits",
  ticks = [0, 50, 100, 150, 200, 250, 300, 350],
  className,
}: {
  data: (Datum & { fill: string })[]
  categoryKey: string
  valueKey: string
  label?: string
  ticks?: number[]
  className?: string
}) {
  const config = { [valueKey]: { label, color: "var(--chart-2)" } } satisfies ChartConfig
  return (
    <ChartContainer config={config} className={cn("aspect-auto h-64 w-full", className)}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }} accessibilityLayer>
        <CartesianGrid horizontal={false} stroke={gridStroke} />
        <XAxis
          type="number"
          domain={[0, ticks[ticks.length - 1]]}
          ticks={ticks}
          tick={<SlantedTick />}
          tickLine={false}
          axisLine={false}
          height={40}
          interval={0}
        />
        <YAxis
          type="category"
          dataKey={categoryKey}
          tickLine={false}
          axisLine={axisLine}
          width={124}
          tickMargin={12}
          tick={{ fill: "var(--muted-foreground)", fontSize: 14, fontWeight: 500 }}
        />
        <ChartTooltip cursor={{ fill: "var(--secondary)", opacity: 0.5 }} content={<ChartTooltipContent hideIndicator />} />
        <Bar dataKey={valueKey} radius={6} barSize={28}>
          {data.map((entry) => (
            <Cell key={String(entry[categoryKey])} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
