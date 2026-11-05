"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Bell, LogOut, Menu, Search, Settings, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { currentUser } from "@/lib/natasha/data"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useShell } from "@/components/natasha/shell-context"
import { UserAvatar } from "@/components/natasha/user-avatar"

const notifications = [
  { id: 1, title: "New order #996", body: "Casual Crew Neck Tee · $30.00", time: "2 min ago", unread: true },
  { id: 2, title: "Payout scheduled", body: "$1,924.00 to PayPal on Nov 5", time: "1 h ago", unread: true },
  { id: 3, title: "Low stock", body: "Chiffon Evening Gown — 4 left", time: "Yesterday", unread: false },
]

export function PageHeader({
  title,
  searchPlaceholder = "Search for a product…",
  searchHref = "/dashboard/products",
}: {
  title: React.ReactNode
  searchPlaceholder?: string
  /** Route that receives `?q=` when the search is submitted. */
  searchHref?: string
}) {
  const { setMobileOpen } = useShell()

  return (
    <header className="sticky top-0 z-30 -mx-4 flex h-23 shrink-0 items-center gap-4 bg-background/95 px-4 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/70 md:-mx-8 md:gap-6 md:px-14">
      <span aria-hidden className="pointer-events-none absolute inset-x-4 bottom-0 h-px bg-border-subtle md:inset-x-14" />
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Button
          variant="secondary"
          size="icon-lg"
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu />
        </Button>
        <h1 className="truncate type-title-lg md:type-display">{title}</h1>
      </div>

      <React.Suspense fallback={<div className="hidden h-11 w-full max-w-120 md:block" />}>
        <HeaderSearch placeholder={searchPlaceholder} href={searchHref} />
      </React.Suspense>

      <div className="flex flex-1 items-center justify-end gap-3 md:gap-5">
        <Notifications />
        <span aria-hidden className="hidden h-6 w-px bg-border sm:block" />
        <AccountMenu />
      </div>
    </header>
  )
}

function HeaderSearch({ placeholder, href }: { placeholder: string; href: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const query = searchParams.get("q") ?? ""
  const [value, setValue] = React.useState(query)

  // Mirror the URL when it changes underneath the input (back/forward, links).
  const [lastQuery, setLastQuery] = React.useState(query)
  if (query !== lastQuery) {
    setLastQuery(query)
    setValue(query)
  }

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <form
      role="search"
      className="relative hidden w-full max-w-120 md:block"
      onSubmit={(event) => {
        event.preventDefault()
        const q = value.trim()
        router.push(q ? `${href}?q=${encodeURIComponent(q)}` : href)
      }}
    >
      <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder.replace("…", "")}
        className="peer h-11 w-full rounded-lg border border-border bg-secondary pr-16 pl-12 type-body-lg text-foreground transition-[border-color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/25 [&::-webkit-search-cancel-button]:hidden"
      />
      <kbd className="pointer-events-none absolute top-1/2 right-3 flex h-6 -translate-y-1/2 items-center rounded-md border border-border px-2 type-caption text-muted-foreground peer-focus-visible:opacity-0">
        ⌘K
      </kbd>
    </form>
  )
}

function Notifications() {
  const unread = notifications.filter((n) => n.unread).length
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon-lg" className="relative" aria-label={`Notifications (${unread} unread)`}>
          <Bell className="text-foreground" />
          {unread > 0 && (
            <span className="absolute -right-1 -bottom-1 size-3 rounded-full border-2 border-background bg-primary" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-80 p-2">
        <DropdownMenuLabel className="flex items-center justify-between px-2 py-2">
          <span className="type-title">Notifications</span>
          <span className="type-caption text-muted-foreground">{unread} new</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-0 my-1 bg-border-subtle" />
        {notifications.map((n) => (
          <DropdownMenuItem key={n.id} className="items-start gap-3 px-2 py-3">
            <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.unread ? "bg-primary" : "bg-transparent")} />
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="type-body text-foreground">{n.title}</span>
              <span className="truncate type-caption text-muted-foreground">{n.body}</span>
            </span>
            <span className="shrink-0 type-caption text-subtle-foreground">{n.time}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
        aria-label="Account menu"
      >
        <UserAvatar seed={currentUser.avatarSeed} color={currentUser.avatarColor} rounded="lg" className="size-11" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-60 p-2">
        <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2">
          <UserAvatar seed={currentUser.avatarSeed} color={currentUser.avatarColor} rounded="lg" className="size-10" />
          <span className="flex min-w-0 flex-col">
            <span className="truncate type-body text-foreground">{currentUser.name}</span>
            <span className="truncate type-caption text-muted-foreground">{currentUser.email}</span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-0 my-1 bg-border-subtle" />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">
            <User /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">
            <Settings /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="mx-0 my-1 bg-border-subtle" />
        <DropdownMenuItem variant="destructive">
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
