import type { Metadata } from "next"

import { payoutsThisMonth } from "@/lib/natasha/analytics"
import { payouts } from "@/lib/natasha/data"
import { formatCurrency } from "@/lib/natasha/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GradientBarChart } from "@/components/natasha/charts/bar-charts"
import { Metric } from "@/components/natasha/kit"
import { Page, PageContent } from "@/components/natasha/page"
import { PageHeader } from "@/components/natasha/page-header"
import { PaymentMethods } from "@/components/natasha/payment-methods"
import { PayoutsTable } from "@/components/natasha/payouts-table"

export const metadata: Metadata = { title: "Payouts" }

export default async function PayoutsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const query = q?.trim().toLowerCase()
  const rows = query
    ? payouts.filter((p) => `${p.month} ${p.method} ${p.status}`.toLowerCase().includes(query))
    : payouts

  return (
    <Page>
      <PageHeader title="Payouts" searchPlaceholder="Search for a payout…" searchHref="/dashboard/payouts" />
      <PageContent spaced className="grid xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="gap-0 py-0">
          <PayoutsTable key={query ?? ""} rows={rows} />
        </Card>

        <div className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Earnings this month</CardTitle>
            </CardHeader>
            <CardContent className="gap-6">
              <Metric
                value={formatCurrency(payoutsThisMonth.total).replace(/\.00$/, "")}
                delta={payoutsThisMonth.delta}
                size="xl"
              />
              <GradientBarChart
                data={payoutsThisMonth.series}
                xKey="week"
                yKey="value"
                label="Earnings"
                barSize={24}
                radius={6}
                valuePrefix="$"
                className="h-64"
              />
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Payment method</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentMethods />
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </Page>
  )
}
