import type { Metadata } from "next"
import Link from "next/link"
import { BadgeCheck, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Page, PageContent } from "@/components/natasha/page"
import { PageHeader } from "@/components/natasha/page-header"

export const metadata: Metadata = { title: "Go premium" }

const plans = [
  {
    name: "Starter",
    price: 0,
    description: "Everything you need to open your store.",
    features: ["Up to 50 products", "Sales & payouts", "Basic insights", "Email support"],
    current: true,
  },
  {
    name: "Premium",
    price: 29,
    description: "Grow faster with deeper insights and automation.",
    features: [
      "Unlimited products",
      "Traffic & conversion insights",
      "Marketing funnels",
      "All extensions",
      "Priority support",
    ],
    featured: true,
  },
  {
    name: "Business",
    price: 79,
    description: "For teams running several storefronts.",
    features: ["Everything in Premium", "5 team seats", "Multi-store dashboard", "Custom reports", "Dedicated manager"],
  },
]

export default function PremiumPage() {
  return (
    <Page>
      <PageHeader title="Go premium" />
      <PageContent className="gap-10 pt-10">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-3 text-center">
          <h2 className="type-headline">Pick the plan that fits your store</h2>
          <p className="type-body text-pretty text-muted-foreground">
            Upgrade or downgrade any time. Prices are per month, billed annually.
          </p>
        </div>
        <ul className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <li
              key={plan.name}
              className={cn(
                "relative flex flex-col gap-8 overflow-hidden rounded-3xl border border-border bg-card p-6",
                plan.featured && "border-primary-border bg-linear-to-b from-primary-soft/60 to-card"
              )}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 type-title-lg">
                    {plan.featured && <BadgeCheck className="size-6 text-primary-light" />}
                    {plan.name}
                  </span>
                  {plan.current && <Badge variant="secondary">Current</Badge>}
                  {plan.featured && <Badge>Popular</Badge>}
                </div>
                <p className="type-body text-muted-foreground">{plan.description}</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="type-metric-lg">${plan.price}</span>
                <span className="type-body text-muted-foreground">/ month</span>
              </div>
              <ul className="flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 type-body-lg">
                    <Check className="size-5 shrink-0 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button size="xl" variant={plan.featured ? "default" : "secondary"} disabled={plan.current} asChild={!plan.current}>
                {plan.current ? <span>Your plan</span> : <Link href="/dashboard/settings">Upgrade to {plan.name}</Link>}
              </Button>
            </li>
          ))}
        </ul>
      </PageContent>
    </Page>
  )
}
