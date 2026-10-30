import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { getProduct, getSale } from "@/lib/natasha/data"
import { formatCurrency, formatDateTime } from "@/lib/natasha/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge, StripedList } from "@/components/natasha/kit"
import { BackLink, Page, PageToolbar } from "@/components/natasha/page"
import { PageHeader } from "@/components/natasha/page-header"
import { ProductImage } from "@/components/natasha/product-image"
import { RecordActions } from "@/components/natasha/record-actions"
import { LocationMap } from "@/components/natasha/world-map"

type Params = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  return { title: `Sale #${id}` }
}

export default async function SalePage({ params }: Params) {
  const { id } = await params
  const sale = getSale(Number(id))
  if (!sale) notFound()
  const product = getProduct(sale.productId)!

  return (
    <Page>
      <PageHeader title={`Sale #${sale.id}`} searchHref="/dashboard/sales" />
      <PageToolbar>
        <BackLink href="/dashboard/sales">All sales</BackLink>
        <RecordActions name={`sale #${sale.id}`} redirectTo="/dashboard/sales" printable />
      </PageToolbar>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <StripedList
                items={[
                  { label: "Order ID", value: 4353016 + sale.id },
                  { label: "Date and Time", value: formatDateTime(sale.date) },
                  { label: "Status", value: <StatusBadge status={sale.status} /> },
                  { label: "Payment Status", value: sale.paymentStatus },
                  { label: "Total Amount", value: formatCurrency(sale.total) },
                  { label: "Payment Method", value: sale.paymentMethod },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <StripedList
                items={[
                  { label: "Customer Name", value: sale.customer.name },
                  { label: "Contact Info", value: sale.customer.email },
                  { label: "Shipping Address", value: sale.customer.address },
                  { label: "Billing Address", value: "Same as shipping" },
                  { label: "Customer Type", value: sale.customer.type },
                  {
                    label: "Customer Notes",
                    value: <span title={sale.customer.note}>{sale.customer.note}</span>,
                  },
                ]}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <Card className="gap-0 py-0">
            <CardHeader className="pt-6">
              <CardTitle>Sale details</CardTitle>
            </CardHeader>
            <div className="flex flex-wrap items-start gap-x-5 gap-y-4 p-6">
              <ProductImage product={product} className="size-22 rounded-xl" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <h2 className="type-title">{product.name}</h2>
                <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 type-body">
                  {[
                    ["Size", sale.size],
                    ["Color", sale.color],
                    ["Quantity", sale.quantity],
                    ["Type", sale.fit],
                  ].map(([label, value]) => (
                    <div key={label} className="contents">
                      <dt className="text-subtle-foreground">{label}:</dt>
                      <dd className="font-semibold text-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <Button asChild>
                <Link href={`/dashboard/products/${product.id}`}>
                  View product
                  <ChevronRight className="-mr-1 size-4" />
                </Link>
              </Button>
            </div>
            <div className="border-t border-border px-6 pt-5 pb-6">
              <dl className="flex flex-col gap-1 type-body">
                {[
                  ["Price", formatCurrency(sale.price)],
                  ["Taxes", formatCurrency(sale.taxes)],
                  ["Shipping", sale.shipping === 0 ? "Free Shipping" : formatCurrency(sale.shipping)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="tabular-nums">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-6 type-headline">
                <span>Total</span>
                <span className="tabular-nums">{formatCurrency(sale.total)}</span>
              </div>
            </div>
          </Card>

          <Card className="relative min-h-80 flex-1 gap-0 py-0">
            <LocationMap countryId={sale.country.code} label={sale.country.name} className="absolute inset-0" />
            <CardHeader className="pointer-events-none relative pt-6">
              <CardTitle>Location</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </Page>
  )
}
