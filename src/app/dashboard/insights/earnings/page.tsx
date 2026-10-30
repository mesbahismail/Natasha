import type { Metadata } from "next"
import Link from "next/link"
import { Banknote, ChartPie, ShoppingCart, Tag } from "lucide-react"

import { categoryRadar, growth, performance, retention, topProducts } from "@/lib/natasha/analytics"
import { getProduct } from "@/lib/natasha/data"
import { formatCompact, formatCompactCurrency, formatNumber } from "@/lib/natasha/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { GradientBarChart } from "@/components/natasha/charts/bar-charts"
import { CategoryRadar } from "@/components/natasha/charts/radial-charts"
import { TrendChart } from "@/components/natasha/charts/trend-charts"
import { Metric, StatTile } from "@/components/natasha/kit"
import { Page } from "@/components/natasha/page"
import { PageHeader } from "@/components/natasha/page-header"
import { ProductImage } from "@/components/natasha/product-image"
import { RangeToolbar } from "@/components/natasha/range-toolbar"

export const metadata: Metadata = { title: "Earnings" }

export default function EarningsPage() {
  return (
    <Page>
      <PageHeader title="Earnings" />
      <RangeToolbar />
      <div className="flex flex-col gap-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <StatTile icon={Tag} value={formatNumber(performance.totalSales)} label="Total sales" />
              <StatTile
                icon={Banknote}
                value={formatCompactCurrency(performance.totalProfit)}
                delta={performance.profitDelta}
                label="Total Profit"
              />
              <StatTile
                icon={ChartPie}
                value={performance.conversion.toFixed(2)}
                delta={performance.conversionDelta}
                label="Conversion rate"
              />
              <StatTile icon={ShoppingCart} value={formatNumber(performance.totalOrders)} label="Total orders" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top categories</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 items-center justify-center">
              <CategoryRadar data={categoryRadar} className="max-w-md" />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Top products</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col">
                {topProducts.map((item) => {
                  const product = getProduct(item.productId)!
                  return (
                    <li key={item.productId} className="border-b border-border py-4 first:pt-0 last:border-b-0 last:pb-0">
                      <Link
                        href={`/dashboard/products/${product.id}`}
                        className="flex items-center gap-4 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                      >
                        <ProductImage product={product} className="size-14 rounded-lg" />
                        <span className="flex min-w-0 flex-1 flex-col gap-2">
                          <span className="truncate type-body-lg font-semibold">{item.name}</span>
                          <Progress
                            value={item.share}
                            aria-label={`${item.name} share of sales`}
                            indicatorClassName="bg-linear-to-r from-(--gradient-to) to-(--gradient-from)"
                          />
                          <span className="type-micro text-muted-foreground">{item.sales} sales</span>
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer retention</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 gap-2">
              <Metric value={`${retention.rate}%`} delta={retention.delta} deltaDigits={0} />
              <span className="type-body text-muted-foreground">{formatCompact(retention.visits)} visits in total</span>
              <TrendChart
                data={retention.series}
                variant="area"
                curve="linear"
                grid="horizontal"
                label="Retention"
                className="mt-4 h-full min-h-36"
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-2 xl:col-span-1">
            <CardHeader>
              <CardTitle>Growth rate</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 gap-6">
              <Metric value={`${growth.rate}%`} delta={growth.delta} deltaDigits={0} />
              <GradientBarChart
                data={growth.series}
                xKey="month"
                yKey="value"
                label="Growth"
                barSize={20}
                radius={10}
                showYAxis={false}
                valueSuffix="%"
                className="h-full min-h-44"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Page>
  )
}
