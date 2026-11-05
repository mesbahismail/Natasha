"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Banknote,
  BadgeCheck,
  ChartPie,
  ChevronDown,
  CircleHelp,
  House,
  Inbox,
  Megaphone,
  PanelLeftClose,
  PanelLeftOpen,
  Puzzle,
  Settings,
  ShoppingBag,
  Tag,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { unreadCount } from "@/lib/natasha/data"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useShell } from "@/components/natasha/shell-context"
import { Logo, LogoMark } from "@/components/natasha/logo"

type NavLeaf = { title: string; href: string }
type NavItem = {
  title: string
  icon: LucideIcon
  href: string
  badge?: number
  items?: NavLeaf[]
}
type NavSection = { label: string; items: NavItem[] }

export const navigation: NavSection[] = [
  {
    label: "Store",
    items: [
      { title: "Dashboard", icon: House, href: "/dashboard" },
      { title: "Sales", icon: Tag, href: "/dashboard/sales" },
      { title: "Products", icon: ShoppingBag, href: "/dashboard/products" },
      {
        title: "Insights",
        icon: ChartPie,
        href: "/dashboard/insights",
        items: [
          { title: "Earnings", href: "/dashboard/insights/earnings" },
          { title: "Traffic sources", href: "/dashboard/insights/traffic" },
          { title: "Conversions", href: "/dashboard/insights/conversions" },
        ],
      },
      { title: "Marketing", icon: Megaphone, href: "/dashboard/marketing" },
      { title: "Payouts", icon: Banknote, href: "/dashboard/payouts" },
    ],
  },
  {
    label: "Support",
    items: [
      { title: "Inbox", icon: Inbox, href: "/dashboard/inbox", badge: unreadCount },
      { title: "Help center", icon: CircleHelp, href: "/dashboard/help" },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Extensions", icon: Puzzle, href: "/dashboard/extensions" },
      { title: "Settings", icon: Settings, href: "/dashboard/settings" },
      { title: "Go premium", icon: BadgeCheck, href: "/dashboard/premium" },
    ],
  },
]

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard"
  return pathname === href || pathname.startsWith(`${href}/`)
}

/* Shared item styles ------------------------------------------------------- */

const itemBase =
  "relative flex items-center rounded-lg border border-transparent type-body-lg text-foreground outline-none transition-[background-color,border-color,color] hover:bg-secondary focus-visible:ring-3 focus-visible:ring-ring/40"
const itemActive =
  "border-primary-border bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.16)] hover:bg-primary"
/** Expanded vs. icon-only geometry. */
const itemLayout = (collapsed: boolean) =>
  collapsed ? "mx-auto h-12 w-14 justify-center" : "h-12 w-full gap-4 px-4"

/* Sidebar ------------------------------------------------------------------ */

export function AppSidebar() {
  return (
    <aside
      data-slot="sidebar"
      className="sticky top-0 hidden h-dvh w-84 shrink-0 flex-col overflow-hidden border-r border-border bg-sidebar transition-[width] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] group-data-[collapsed=true]/shell:w-26 lg:flex"
    >
      <SidebarBody variant="desktop" />
    </aside>
  )
}

export function SidebarBody({ variant }: { variant: "desktop" | "mobile" }) {
  const { collapsed: collapsedState, toggleCollapsed } = useShell()
  const collapsed = variant === "desktop" && collapsedState
  const pathname = usePathname()

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 px-4">
        <div
          className={cn(
            "flex h-23 items-center border-b border-border",
            collapsed ? "justify-center" : "justify-between pr-1 pl-4"
          )}
        >
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={toggleCollapsed}
                  aria-label="Expand sidebar"
                  className="group/logo relative grid size-12 place-items-center rounded-lg outline-none hover:bg-secondary focus-visible:ring-3 focus-visible:ring-ring/40"
                >
                  <LogoMark className="transition-opacity group-hover/logo:opacity-0 group-focus-visible/logo:opacity-0" />
                  <PanelLeftOpen className="absolute size-5 opacity-0 transition-opacity group-hover/logo:opacity-100 group-focus-visible/logo:opacity-100" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Expand <kbd className="ml-1 text-muted-foreground">⌘B</kbd>
              </TooltipContent>
            </Tooltip>
          ) : (
            <>
              <Link href="/dashboard" className="rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/40">
                <Logo />
              </Link>
              {variant === "desktop" && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={toggleCollapsed} aria-label="Collapse sidebar" className="text-muted-foreground hover:text-foreground">
                      <PanelLeftClose />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Collapse <kbd className="ml-1 text-muted-foreground">⌘B</kbd>
                  </TooltipContent>
                </Tooltip>
              )}
            </>
          )}
        </div>
      </div>

      <nav aria-label="Main" className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4">
        {navigation.map((section) => (
          <div key={section.label} className="border-b border-border py-6 last:border-b-0">
            {!collapsed && (
              <p className="mb-5 px-4 type-overline text-muted-foreground">{section.label}</p>
            )}
            <ul className="flex flex-col gap-1">
              {section.items.map((item) => (
                <li key={item.title}>
                  {item.items ? (
                    <NavGroup item={item} pathname={pathname} collapsed={collapsed} />
                  ) : (
                    <NavLink item={item} active={isActive(pathname, item.href)} collapsed={collapsed} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )
}

function NavLink({ item, active, collapsed }: { item: NavItem; active: boolean; collapsed: boolean }) {
  const Icon = item.icon
  const link = (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(itemBase, itemLayout(collapsed), active && itemActive)}
    >
      <Icon className="size-5 shrink-0" strokeWidth={2} />
      {!collapsed && <span className="min-w-0 flex-1 truncate">{item.title}</span>}
      {item.badge ? (
        <span
          className={cn(
            "grid place-items-center tabular-nums",
            collapsed
              ? "absolute -top-0.5 right-1 size-5 text-[11px] leading-none font-semibold text-primary-foreground"
              : "h-6 min-w-8 rounded-full border px-2 type-caption",
            !collapsed && (active ? "border-white/70 bg-transparent" : "border-primary-border bg-primary text-primary-foreground")
          )}
        >
          {item.badge}
          <span className="sr-only"> unread</span>
        </span>
      ) : null}
    </Link>
  )

  if (!collapsed) return link
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.title}</TooltipContent>
    </Tooltip>
  )
}

function NavGroup({ item, pathname, collapsed }: { item: NavItem; pathname: string; collapsed: boolean }) {
  const childActive = item.items?.some((child) => isActive(pathname, child.href)) ?? false
  const [open, setOpen] = React.useState(childActive)
  const Icon = item.icon

  // Expand the group when navigation lands on one of its children.
  const [wasChildActive, setWasChildActive] = React.useState(childActive)
  if (childActive !== wasChildActive) {
    setWasChildActive(childActive)
    if (childActive) setOpen(true)
  }

  if (collapsed) {
    return (
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger
              aria-label={item.title}
              className={cn(itemBase, itemLayout(true), childActive && itemActive)}
            >
              <Icon className="size-5 shrink-0" strokeWidth={2} />
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">{item.title}</TooltipContent>
        </Tooltip>
        <DropdownMenuContent side="right" align="start" sideOffset={12} className="w-52">
          <DropdownMenuLabel className="px-3 py-2 type-overline text-muted-foreground">{item.title}</DropdownMenuLabel>
          {item.items?.map((child) => (
            <DropdownMenuItem key={child.href} asChild>
              <Link
                href={child.href}
                className={cn("type-body-lg", isActive(pathname, child.href) && "text-primary-light")}
              >
                {child.title}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className={cn(itemBase, itemLayout(false))}>
        <Icon className="size-5 shrink-0" strokeWidth={2} />
        <span className="min-w-0 flex-1 truncate text-left">{item.title}</span>
        <ChevronDown
          className={cn("size-5 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <ul className="mt-1 mr-6 ml-7 flex flex-col gap-1 border-l border-border pl-2">
          {item.items?.map((child) => {
            const active = isActive(pathname, child.href)
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(itemBase, "h-10 px-4", active && itemActive)}
                >
                  {child.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}
