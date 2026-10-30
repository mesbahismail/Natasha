import type { Metadata } from "next"

import { conversations } from "@/lib/natasha/data"
import { Inbox } from "@/components/natasha/inbox"
import { Page, PageContent } from "@/components/natasha/page"
import { PageHeader } from "@/components/natasha/page-header"

export const metadata: Metadata = { title: "Inbox" }

export default function InboxPage() {
  return (
    <Page>
      <PageHeader title="Inbox" />
      <PageContent spaced>
        <Inbox initial={conversations} />
      </PageContent>
    </Page>
  )
}
