import type { Metadata } from "next"
import Link from "next/link"
import { BadgeDollarSign, DollarSign, Zap } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  conversionSummary,
  conversionTrend,
  earningsByMonth,
  earningsSummary,
  topCategories,
  trafficSummary,
} from "@/lib/natasha/analytics"
import { getProduct, sales } from "@/lib/natasha/data"
import { formatCompact, formatCurrency, formatSignedCurrency } from "@/lib/natasha/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GroupedBarChart } from "@/components/natasha/charts/bar-charts"
import { DonutChart, Gauge } from "@/components/natasha/charts/radial-charts"
import { TrendChart } from "@/components/natasha/charts/trend-charts"
import { IconTile, LegendDot, Metric } from "@/components/natasha/kit"
import { Page } from "@/components/natasha/page"
import { PageHeader } from "@/components/natasha/page-header"
import { ProductImage } from "@/components/natasha/product-image"
import { RangeToolbar } from "@/components/natasha/range-toolbar"

export const metadata: Metadata = { title: "Dashboard" }

export default function DashboardPage() {
  return (
    <Page>
      <PageHeader title="Dashboard" />
      <RangeToolbar />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <EarningsCard />
          <div className="grid gap-6 md:grid-cols-2">
            <ConversionCard />
            <TrafficCard />
          </div>
        </div>
        {/* On xl the left column sets the height; the right column fills it. */}
        <div className="relative min-w-0">
          <div className="grid gap-6 md:grid-cols-2 xl:absolute xl:inset-0 xl:grid-cols-1 xl:grid-rows-2">
            <RecentSalesCard />
            <TopCategoriesCard />
          </div>
        </div>
      </div>
    </Page>
  )
}

function EarningsCard() {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="pt-6">
        <CardTitle>Earnings</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-2 px-6 pt-5 pb-5">
        <Kpi icon={BadgeDollarSign} value={formatCurrency(earningsSummary.total)} label="Total Earnings" />
        <Kpi
          icon={DollarSign}
          value={formatCurrency(earningsSummary.net)}
          label="Net Profit"
          className="before:absolute before:top-1/2 before:left-0 before:h-16 before:w-px before:-translate-y-1/2 before:bg-border"
        />
      </div>
      <div className="border-t border-border px-6 pt-6 pb-4">
        <GroupedBarChart
          data={earningsByMonth}
          xKey="month"
          series={[
            { key: "earnings", label: "Earnings", color: "var(--chart-1)" },
            { key: "profit", label: "Net profit", color: "var(--chart-3)" },
          ]}
          className="h-52"
        />
      </div>
    </Card>
  )
}

function Kpi({
  icon,
  value,
  label,
  className,
}: {
  icon: React.ComponentProps<typeof IconTile>["icon"]
  value: string
  label: string
  className?: string
}) {
  return (
    <div className={cn("relative flex flex-col items-center gap-4 px-2 text-center", className)}>
      <IconTile icon={icon} />
      <div className="flex flex-col gap-1">
        <span className="type-metric-xs sm:type-metric">{value}</span>
        <span className="type-body text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}

function ConversionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion</CardTitle>
      </CardHeader>
      <CardContent className="gap-0">
        <Metric value={`${conversionSummary.rate}%`} delta={conversionSummary.delta} size="xl" />
        <TrendChart data={conversionTrend} pillIndex={8} label="Conversion" className="h-32" />
      </CardContent>
    </Card>
  )
}

function TrafficCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 justify-end">
        <Gauge
          value={trafficSummary.visits}
          max={trafficSummary.target}
          footer={<span className="type-metric-lg leading-none">{formatCompact(trafficSummary.visits)}</span>}
        >
          <IconTile icon={Zap} />
        </Gauge>
      </CardContent>
    </Card>
  )
}

function RecentSalesCard() {
  const recent = sales.slice(0, 8)
  return (
    <Card className="max-h-96 gap-4 pb-0 xl:max-h-none">
      <CardHeader className="grid-cols-[1fr_auto]">
        <CardTitle>Recent sales</CardTitle>
        <Link
          href="/dashboard/sales"
          className="rounded-md type-body text-primary-light outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          View all
        </Link>
      </CardHeader>
      <ul className="no-scrollbar min-h-0 flex-1 overflow-y-auto scroll-fade-b px-6 pb-4">
        {recent.map((sale) => {
          const product = getProduct(sale.productId)!
          return (
            <li key={sale.id} className="border-b border-border-subtle last:border-b-0">
              <Link
                href={`/dashboard/sales/${sale.id}`}
                className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 outline-none hover:bg-secondary/50 focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                <ProductImage product={product} className="size-10 rounded-md" />
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate type-body">{product.name}</span>
                  <span className="type-micro text-muted-foreground">SKU: {product.sku}</span>
                </span>
                <span className="type-body tabular-nums">{formatSignedCurrency(sale.total)}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

function TopCategoriesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top categories</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 justify-between gap-6">
        <div className="flex flex-1 items-center justify-center">
          <DonutChart data={topCategories} className="max-w-52" />
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {topCategories.map((category) => (
            <LegendDot key={category.name} color={category.fill} label={category.name} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
