import type { Metadata } from "next"

import { Page } from "@/components/natasha/page"
import { PageHeader } from "@/components/natasha/page-header"
import { ProductForm } from "@/components/natasha/product-form"

export const metadata: Metadata = { title: "New product" }

export default function NewProductPage() {
  return (
    <Page>
      <PageHeader title="New product" />
      <ProductForm />
    </Page>
  )
}
