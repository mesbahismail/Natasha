import type { Metadata } from "next"

import { products } from "@/lib/natasha/data"
import { Page } from "@/components/natasha/page"
import { PageHeader } from "@/components/natasha/page-header"
import { ProductCatalog } from "@/components/natasha/product-catalog"

export const metadata: Metadata = { title: "Products" }

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const query = q?.trim().toLowerCase()
  const list = query
    ? products.filter((p) => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))
    : products

  return (
    <Page>
      <PageHeader title="Products" />
      {/* Remount on a new search so pagination resets. */}
      <ProductCatalog key={query ?? ""} products={list} />
    </Page>
  )
}
