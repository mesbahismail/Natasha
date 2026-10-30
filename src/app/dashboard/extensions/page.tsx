import type { Metadata } from "next"

import { extensions } from "@/lib/natasha/data"
import { ExtensionsTable } from "@/components/natasha/extensions-table"
import { Page } from "@/components/natasha/page"
import { PageHeader } from "@/components/natasha/page-header"

export const metadata: Metadata = { title: "Extensions" }

export default async function ExtensionsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const query = q?.trim().toLowerCase()
  const list = query
    ? extensions.filter((e) => `${e.name} ${e.description}`.toLowerCase().includes(query))
    : extensions

  return (
    <Page>
      <PageHeader title="Extensions" searchPlaceholder="Search for an extension…" searchHref="/dashboard/extensions" />
      <ExtensionsTable key={query ?? ""} initial={list} />
    </Page>
  )
}
