import type { Metadata } from "next"

import { conversionByCategory, conversionByCountry, conversionHeatmap, conversionRate, weekdays } from "@/lib/natasha/analytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BubbleChart, Heatmap } from "@/components/natasha/charts/custom-charts"
import { TrendChart } from "@/components/natasha/charts/trend-charts"
import { LegendDot, Metric } from "@/components/natasha/kit"
import { Page } from "@/components/natasha/page"
import { PageHeader } from "@/components/natasha/page-header"
import { RangeToolbar } from "@/components/natasha/range-toolbar"
import { ChoroplethMap, tierLabels } from "@/components/natasha/world-map"

export const metadata: Metadata = { title: "Conversions" }

const tierColors = ["var(--chart-4)", "var(--chart-3)", "var(--chart-2)", "var(--chart-1)"]

export default function ConversionsPage() {
  return (
    <Page>
      <PageHeader title="Conversions" />
      <RangeToolbar />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion rate</CardTitle>
            </CardHeader>
            <CardContent className="gap-6">
              <Metric value={`${conversionRate.rate}%`} delta={conversionRate.delta} size="xl" />
              <TrendChart
                data={conversionRate.series}
                tickKey="day"
                variant="area"
                curve="linear"
                fill="brand"
                grid="horizontal"
                showXAxis
                pillIndex={5}
                label="Conversion"
                className="h-60"
              />
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Top categories</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 justify-center">
              <BubbleChart data={conversionByCategory} />
            </CardContent>
          </Card>
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion time</CardTitle>
            </CardHeader>
            <CardContent>
              <Heatmap rows={conversionHeatmap.hours} columns={weekdays} values={conversionHeatmap.values} />
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Demography</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 gap-6">
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                {[...tierLabels].reverse().map((label, i) => (
                  <LegendDot
                    key={label}
                    color={tierColors[tierColors.length - 1 - i]}
                    label={label}
                    variant="ring"
                    className="type-caption"
                  />
                ))}
              </div>
              <div className="flex flex-1 items-center">
                <ChoroplethMap values={conversionByCountry} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Page>
  )
}
