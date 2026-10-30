import type { Metadata } from "next"

import { ageRanges, gender, trafficBySource, trafficChannels, trafficKpis } from "@/lib/natasha/analytics"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GroupedBarChart } from "@/components/natasha/charts/bar-charts"
import { DonutChart } from "@/components/natasha/charts/radial-charts"
import { Delta, LegendDot } from "@/components/natasha/kit"
import { Page } from "@/components/natasha/page"
import { PageHeader } from "@/components/natasha/page-header"
import { RangeToolbar } from "@/components/natasha/range-toolbar"

export const metadata: Metadata = { title: "Traffic sources" }

const sourceSeries = [
  { key: "search", label: "Search ads", color: "var(--chart-1)" },
  { key: "display", label: "Display ads", color: "var(--chart-2)" },
  { key: "video", label: "Video ads", color: "var(--chart-3)" },
]

/** Age bars are scaled to this share so the longest bar sits around 60%. */
const AGE_SCALE = 40

export default function TrafficPage() {
  return (
    <Page>
      <PageHeader title="Traffic" />
      <RangeToolbar />
      <div className="flex flex-col gap-6">
        <Card className="py-0">
          <dl className="grid grid-cols-2 lg:grid-cols-4">
            {trafficKpis.map((kpi, i) => (
              <div
                key={kpi.label}
                className={cn(
                  "relative flex flex-col gap-1 px-6 py-5",
                  // Dividers: between columns, inset 24px top and bottom.
                  i % 2 === 1 && "before:absolute before:inset-y-6 before:left-0 before:w-px before:bg-border",
                  i === 2 && "lg:before:absolute lg:before:inset-y-6 lg:before:left-0 lg:before:w-px lg:before:bg-border",
                  i >= 2 && "max-lg:border-t max-lg:border-border"
                )}
              >
                <dd className="flex flex-wrap items-baseline gap-x-2">
                  <span className="type-metric-sm">{kpi.value}</span>
                  <Delta value={kpi.delta} inverse={kpi.inverse} />
                </dd>
                <dt className="type-body text-muted-foreground">{kpi.label}</dt>
              </div>
            ))}
          </dl>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top sources</CardTitle>
            </CardHeader>
            <CardContent className="gap-6">
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                {sourceSeries.map((s) => (
                  <LegendDot key={s.key} color={s.color} label={s.label} variant="ring" />
                ))}
              </div>
              <GroupedBarChart data={trafficBySource} xKey="day" series={sourceSeries} barSize={8} barGap={4} className="h-52" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top locations</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex-row flex-wrap items-center justify-around gap-8">
              <DonutChart data={trafficChannels} innerRadius="62%" className="w-56 max-w-full" />
              <ul className="flex flex-col gap-4">
                {trafficChannels.map((c) => (
                  <li key={c.name}>
                    <LegendDot color={c.fill} label={c.name} variant="ring" />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Age range</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-4">
                {ageRanges.map((age) => (
                  <li key={age.range} className="grid grid-cols-[48px_minmax(0,1fr)_40px] items-center gap-4">
                    <span className="text-right type-caption text-muted-foreground tabular-nums">{age.range}</span>
                    <span className="h-7 overflow-hidden rounded-md bg-track">
                      <span
                        className="block h-full rounded-md bg-linear-to-r from-chart-3 to-chart-2"
                        style={{ width: `${(age.share / AGE_SCALE) * 100}%` }}
                      />
                    </span>
                    <span className="type-caption text-muted-foreground tabular-nums">{age.share}%</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gender</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex-row flex-wrap items-center justify-around gap-8">
              <DonutChart data={gender} innerRadius={0} className="w-56 max-w-full" />
              <ul className="flex min-w-44 flex-col">
                {gender.map((g, i) => (
                  <li key={g.name} className={cn("flex gap-3 py-4", i > 0 && "border-t border-border")}>
                    <span
                      aria-hidden
                      className="mt-2 size-6 shrink-0 rounded-full border-[3px]"
                      style={{ borderColor: g.fill }}
                    />
                    <span className="flex flex-col">
                      <span className="type-metric-xs">{g.value}%</span>
                      <span className="type-body text-muted-foreground">{g.name}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Page>
  )
}
