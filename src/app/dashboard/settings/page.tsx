import type { Metadata } from "next"

import { Page } from "@/components/natasha/page"
import { PageHeader } from "@/components/natasha/page-header"
import { SettingsForm } from "@/components/natasha/settings-form"

export const metadata: Metadata = { title: "Settings" }

export default function SettingsPage() {
  return (
    <Page>
      <PageHeader title="Settings" />
      <SettingsForm />
    </Page>
  )
}
