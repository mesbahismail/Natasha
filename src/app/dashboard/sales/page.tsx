import type { Metadata } from "next"

import { getProduct, sales } from "@/lib/natasha/data"
import { Card } from "@/components/ui/card"
import { Page } from "@/components/natasha/page"
import { PageHeader } from "@/components/natasha/page-header"
import { RangeToolbar } from "@/components/natasha/range-toolbar"
import { SalesTable, type SaleRow } from "@/components/natasha/sales-table"

export const metadata: Metadata = { title: "Sales" }

export default async function SalesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const query = q?.trim().toLowerCase()
  const rows: SaleRow[] = sales
    .map((sale) => {
      const { id, name, sku, art, image } = getProduct(sale.productId)!
      return { ...sale, product: { id, name, sku, art, image } }
    })
    .filter((row) => !query || row.product.name.toLowerCase().includes(query) || String(row.id).includes(query))

  return (
    <Page>
      <PageHeader title="Sales" searchHref="/dashboard/sales" />
      <RangeToolbar />
      <Card className="gap-0 py-0">
        <SalesTable key={query ?? ""} rows={rows} />
      </Card>
    </Page>
  )
}
