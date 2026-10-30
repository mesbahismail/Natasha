import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Banknote, ChartPie, CircleDollarSign, ShoppingBag, ShoppingCart, Tag } from "lucide-react"

import { productEarningsTrend, productSalesByMonth, productStats } from "@/lib/natasha/analytics"
import { getProduct } from "@/lib/natasha/data"
import { formatCompactCurrency, formatCurrency, formatNumber } from "@/lib/natasha/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GradientBarChart } from "@/components/natasha/charts/bar-charts"
import { TrendChart } from "@/components/natasha/charts/trend-charts"
import { StatTile } from "@/components/natasha/kit"
import { BackLink, Page, PageToolbar } from "@/components/natasha/page"
import { PageHeader } from "@/components/natasha/page-header"
import { ProductImage } from "@/components/natasha/product-image"
import { RecordActions } from "@/components/natasha/record-actions"

type Params = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  return { title: `Product #${id}` }
}

export default async function ProductPage({ params }: Params) {
  const { id } = await params
  const product = getProduct(id)
  if (!product) notFound()
  const stats = productStats(product)

  return (
    <Page>
      <PageHeader title={`Product #${product.id}`} />
      <PageToolbar>
        <BackLink href="/dashboard/products">All products</BackLink>
        <RecordActions name={`product #${product.id}`} redirectTo="/dashboard/products" />
      </PageToolbar>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="gap-0 py-0">
          <CardHeader className="pt-6">
            <CardTitle>Product stats</CardTitle>
          </CardHeader>
          <div className="flex items-center gap-6 p-6">
            <ProductImage product={product} className="size-24 rounded-xl sm:size-31" />
            <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-x-6 gap-y-3">
              <div className="flex min-w-0 flex-col gap-2">
                <h2 className="type-title md:type-title-lg">{product.name}</h2>
                <span className="type-micro text-muted-foreground underline underline-offset-2">{product.category}</span>
                <span className="mt-2 type-caption text-muted-foreground">SKU: {product.sku}</span>
              </div>
              <span className="type-title md:type-title-lg tabular-nums">{formatCurrency(product.price)}</span>
            </div>
          </div>
          <div className="grid gap-5 border-t border-border p-6 sm:grid-cols-2">
            <StatTile icon={Tag} value={formatNumber(stats.totalSales)} label="Total sales" />
            <StatTile icon={Banknote} value={formatCompactCurrency(stats.profit)} delta={stats.profitDelta} label="Total Profit" />
            <StatTile icon={ShoppingBag} value={formatNumber(stats.inStock)} label="In-stock" />
            <StatTile
              icon={CircleDollarSign}
              value={formatCompactCurrency(stats.earnings)}
              delta={stats.earningsDelta}
              label="Earnings"
            />
            <StatTile icon={ChartPie} value={stats.conversion.toFixed(2)} delta={stats.conversionDelta} label="Conversion rate" />
            <StatTile icon={ShoppingCart} value={formatNumber(stats.orders)} label="Total orders" />
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-rows-2">
          <Card>
            <CardHeader>
              <CardTitle>Sales</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <GradientBarChart
                data={productSalesByMonth}
                xKey="month"
                yKey="sales"
                label="Sales"
                barSize={60}
                className="h-full min-h-56"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Earnings</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <TrendChart
                data={productEarningsTrend}
                tickKey="month"
                variant="area"
                grid="horizontal"
                showXAxis
                pillIndex={10}
                label="Earnings"
                className="h-full min-h-56"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Page>
  )
}
