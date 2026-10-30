import type { Metadata } from "next"

import { funnel, landingPages, leadSources, marketingChannels } from "@/lib/natasha/analytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HorizontalBarChart } from "@/components/natasha/charts/bar-charts"
import { Funnel } from "@/components/natasha/charts/custom-charts"
import { RadialRings } from "@/components/natasha/charts/radial-charts"
import { LayeredAreaChart } from "@/components/natasha/charts/trend-charts"
import { LegendDot } from "@/components/natasha/kit"
import { Page } from "@/components/natasha/page"
import { PageHeader } from "@/components/natasha/page-header"
import { RangeToolbar } from "@/components/natasha/range-toolbar"

export const metadata: Metadata = { title: "Marketing" }

const leadSeries = [
  { key: "search", label: "Search ads", color: "var(--chart-1)", opacity: 0.6 },
  { key: "display", label: "Display ads", color: "var(--chart-2)", opacity: 0.7 },
  { key: "video", label: "Video ads", color: "var(--chart-4)", opacity: 0.9 },
]

export default function MarketingPage() {
  return (
    <Page>
      <PageHeader title="Marketing" />
      <RangeToolbar />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead sources</CardTitle>
            </CardHeader>
            <CardContent className="gap-6">
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                {leadSeries.map((s) => (
                  <LegendDot key={s.key} color={s.color} label={s.label} variant="ring" />
                ))}
              </div>
              <LayeredAreaChart data={leadSources} xKey="day" series={leadSeries} className="h-64" />
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Landing pages visits</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 justify-center">
              <HorizontalBarChart data={landingPages} categoryKey="path" valueKey="visits" />
            </CardContent>
          </Card>
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic sources</CardTitle>
            </CardHeader>
            <CardContent className="flex-row flex-wrap items-center justify-around gap-8">
              <RadialRings data={marketingChannels} className="w-60 max-w-full" />
              <ul className="flex flex-col gap-6">
                {marketingChannels.map((c) => (
                  <li key={c.name}>
                    <LegendDot color={c.color} label={c.name} variant="ring" className="type-body-lg text-muted-foreground" />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Conversion funnel</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 justify-center">
              <Funnel data={funnel} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Page>
  )
}
