"use client"

import * as React from "react"
import Link from "next/link"
import { Archive, ChevronDown, CircleHelp, Pause, RotateCcw, Save, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { currentUser } from "@/lib/natasha/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FieldLabel } from "@/components/natasha/kit"
import { PageToolbar } from "@/components/natasha/page"
import { UserAvatar } from "@/components/natasha/user-avatar"

const notifications = [
  { id: "orders", label: "New orders", description: "A sale comes in or a payment fails.", defaultChecked: true },
  { id: "messages", label: "Customer messages", description: "Someone writes to you in the inbox.", defaultChecked: true },
  { id: "payouts", label: "Payouts", description: "A payout is sent or needs attention.", defaultChecked: true },
  { id: "digest", label: "Weekly digest", description: "Earnings, traffic and conversions every Monday.", defaultChecked: false },
]

const dangerItems = [
  {
    id: "pause-store",
    label: "Pause store",
    description: "Stop accepting new orders while keeping your store data.",
    action: "Pause store",
    icon: Pause,
    message: "Contact support to pause your store.",
  },
  {
    id: "archive-products",
    label: "Archive all products",
    description: "Hide your catalog from customers and keep past orders.",
    action: "Archive products",
    icon: Archive,
    message: "Contact support to archive all products.",
  },
  {
    id: "reset-settings",
    label: "Reset store settings",
    description: "Restore your store preferences to their defaults.",
    action: "Reset settings",
    icon: RotateCcw,
    message: "Contact support to reset your store settings.",
  },
  {
    id: "close-store",
    label: "Close store",
    description: "Permanently remove products, orders and payout history.",
    action: "Close store",
    icon: Trash2,
    message: "Contact support to close your store.",
  },
]

export function SettingsForm() {
  return (
    <form
      className="contents"
      onSubmit={(event) => {
        event.preventDefault()
        toast.success("Settings saved")
      }}
    >
      <PageToolbar>
        <p className="type-body-lg text-muted-foreground">Manage your profile, store and notifications.</p>
        <Button type="submit" size="lg">
          <Save />
          Save changes
        </Button>
      </PageToolbar>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>How you appear to customers and teammates.</CardDescription>
          </CardHeader>
          <CardContent className="gap-6">
            <div className="flex items-center gap-4">
              <UserAvatar seed={currentUser.avatarSeed} color={currentUser.avatarColor} rounded="lg" className="size-16" />
              <div className="flex flex-col gap-1">
                <span className="type-title">{currentUser.name}</span>
                <span className="type-body text-muted-foreground">{currentUser.role}</span>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="full-name">Full name</FieldLabel>
                <Input id="full-name" defaultValue={currentUser.name} />
              </div>
              <div>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" defaultValue={currentUser.email} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Store</CardTitle>
            <CardDescription>Defaults used across orders and reports.</CardDescription>
          </CardHeader>
          <CardContent className="gap-6">
            <div>
              <FieldLabel htmlFor="store-name">Store name</FieldLabel>
              <Input id="store-name" defaultValue="Natasha Studio" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="currency">Currency</FieldLabel>
                <Select defaultValue="usd">
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">US Dollar (USD)</SelectItem>
                    <SelectItem value="eur">Euro (EUR)</SelectItem>
                    <SelectItem value="gbp">British Pound (GBP)</SelectItem>
                    <SelectItem value="uah">Ukrainian Hryvnia (UAH)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <FieldLabel htmlFor="timezone">Time zone</FieldLabel>
                <Select defaultValue="utc">
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="cet">Central European (CET)</SelectItem>
                    <SelectItem value="eet">Eastern European (EET)</SelectItem>
                    <SelectItem value="pst">Pacific (PST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose what lands in your inbox.</CardDescription>
          </CardHeader>
          <CardContent className="gap-0">
            {notifications.map((item) => (
              <label
                key={item.id}
                className="flex cursor-pointer items-start gap-4 border-b border-border py-4 first:pt-0 last:border-b-0 last:pb-0"
              >
                <Checkbox defaultChecked={item.defaultChecked} className="mt-0.5" />
                <span className="flex flex-col gap-1">
                  <span className="type-body-lg font-semibold">{item.label}</span>
                  <span className="type-body text-muted-foreground">{item.description}</span>
                </span>
              </label>
            ))}
          </CardContent>
        </Card>

        <Card className="border-destructive-border/60">
          <CardHeader>
            <CardTitle>Danger zone</CardTitle>
            <CardDescription>Manage actions that affect your store and its data.</CardDescription>
          </CardHeader>
          <CardContent className="gap-0">
            <ul>
              {dangerItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-4 border-b border-border py-4 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <span id={`${item.id}-label`} className="type-body-lg font-semibold">{item.label}</span>
                    <span id={`${item.id}-description`} className="type-body text-muted-foreground">{item.description}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        className="ml-auto"
                        aria-label={`Actions for ${item.label.toLowerCase()}`}
                        aria-describedby={`${item.id}-description`}
                      >
                        Actions
                        <ChevronDown className="size-4 transition-transform in-aria-expanded:rotate-180" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem variant="destructive" onSelect={() => toast(item.message)}>
                        <item.icon />
                        {item.action}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/help">
                          <CircleHelp /> Get help
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
