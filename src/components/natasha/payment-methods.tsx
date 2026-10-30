"use client"

import * as React from "react"
import { CreditCard, Landmark, Wallet } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PaypalLogo } from "@/components/natasha/brand-logos"

const methods = [
  { value: "paypal", label: "PayPal", icon: PaypalLogo },
  { value: "bank", label: "Bank transfer", icon: Landmark },
  { value: "card", label: "Credit card", icon: CreditCard },
  { value: "crypto", label: "Crypto wallet", icon: Wallet },
] as const

/** Where payouts are sent. Selecting a row switches the default method. */
export function PaymentMethods() {
  const [value, setValue] = React.useState<string>("paypal")

  return (
    <RadioGroup
      value={value}
      onValueChange={(next) => {
        setValue(next)
        toast.success(`Payouts will go to ${methods.find((m) => m.value === next)?.label}`)
      }}
      aria-label="Payout method"
      className="gap-0"
    >
      {methods.map((method) => {
        const checked = method.value === value
        return (
          <label
            key={method.value}
            className="group/method flex h-18 cursor-pointer items-center gap-4 border-b border-border px-2 last:border-b-0"
          >
            <method.icon className={cn("size-5 shrink-0 text-muted-foreground", checked && "text-foreground")} />
            <span className={cn("flex-1 type-body-lg text-muted-foreground", checked && "font-semibold text-foreground")}>
              {method.label}
            </span>
            <RadioGroupItem value={method.value} />
          </label>
        )
      })}
    </RadioGroup>
  )
}
