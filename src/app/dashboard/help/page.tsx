import type { Metadata } from "next"
import Link from "next/link"
import {
  BriefcaseBusiness,
  ChartColumn,
  CircleHelp,
  Lightbulb,
  Mail,
  Puzzle,
  ReceiptText,
  ShoppingCart,
  Store,
  type LucideIcon,
} from "lucide-react"

import { helpTopics } from "@/lib/natasha/data"
import { Page, PageContent } from "@/components/natasha/page"
import { PageHeader } from "@/components/natasha/page-header"

export const metadata: Metadata = { title: "Help center" }

const icons: Record<(typeof helpTopics)[number]["icon"], LucideIcon> = {
  lightbulb: Lightbulb,
  receipt: ReceiptText,
  store: Store,
  cart: ShoppingCart,
  briefcase: BriefcaseBusiness,
  chart: ChartColumn,
  puzzle: Puzzle,
  question: CircleHelp,
  mail: Mail,
}

export default async function HelpPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const query = q?.trim().toLowerCase()
  const topics = query
    ? helpTopics.filter((t) => `${t.title} ${t.description}`.toLowerCase().includes(query))
    : helpTopics

  return (
    <Page>
      <PageHeader title="Help center" searchPlaceholder="Search for help…" searchHref="/dashboard/help" />
      <PageContent className="gap-10 pt-10">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-3 text-center">
          <h2 className="type-headline">How can we help you today?</h2>
          <p className="type-body text-pretty text-muted-foreground">
            Find answers, get guidance, or reach out directly — we&apos;re here to make your experience smooth and simple.
          </p>
        </div>

        {topics.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border py-20 text-center type-body text-muted-foreground">
            No topics match “{q}”.{" "}
            <Link href="/dashboard/help" className="text-primary-light hover:underline">
              Show all topics
            </Link>
          </p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {topics.map((topic) => {
              const Icon = icons[topic.icon]
              return (
                <li key={topic.id}>
                  <Link
                    href={topic.id === "contact" ? "/dashboard/inbox" : `#${topic.id}`}
                    id={topic.id}
                    className="group/topic flex h-full min-h-54 flex-col justify-between gap-12 rounded-3xl border border-border bg-card p-6 outline-none transition-colors hover:border-primary-soft-border hover:bg-secondary focus-visible:ring-3 focus-visible:ring-ring/40"
                  >
                    <Icon className="size-7 text-primary transition-transform group-hover/topic:-translate-y-0.5" strokeWidth={2} />
                    <span className="flex flex-col gap-2">
                      <span className="type-title-lg">{topic.title}</span>
                      <span className="type-body text-muted-foreground">{topic.description}</span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </PageContent>
    </Page>
  )
}
