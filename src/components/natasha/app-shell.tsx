"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { SIDEBAR_COOKIE } from "@/lib/natasha/constants"
import { AppSidebar, SidebarBody } from "@/components/natasha/app-sidebar"
import { ShellContext } from "@/components/natasha/shell-context"

const NARROW_QUERY = "(max-width: 1439px)"

function subscribeNarrow(onChange: () => void) {
  const query = window.matchMedia(NARROW_QUERY)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

function isNarrow() {
  return window.matchMedia(NARROW_QUERY).matches
}

/**
 * Dashboard frame: sticky sidebar (336px ↔ 104px) + scrolling content.
 * The collapsed state persists in a cookie so the server renders it without a
 * flash, and ⌘B / Ctrl+B toggles it from anywhere.
 */
export function AppShell({
  defaultCollapsed,
  children,
}: {
  /** From the cookie. `undefined` means "first visit" → collapse on narrow screens. */
  defaultCollapsed?: boolean
  children: React.ReactNode
}) {
  // Until the user picks a state, the sidebar follows the viewport width.
  const [preference, setPreference] = React.useState(defaultCollapsed)
  const narrow = React.useSyncExternalStore(subscribeNarrow, isNarrow, () => false)
  const collapsed = preference ?? narrow
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const pathname = usePathname()

  const setCollapsed = React.useCallback((value: boolean) => {
    setPreference(value)
    document.cookie = `${SIDEBAR_COOKIE}=${value ? "collapsed" : "expanded"}; path=/; max-age=31536000; samesite=lax`
  }, [])

  const toggleCollapsed = React.useCallback(() => setCollapsed(!collapsed), [collapsed, setCollapsed])

  // Close the mobile drawer after navigating.
  const [lastPathname, setLastPathname] = React.useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setMobileOpen(false)
  }

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "b" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleCollapsed()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [toggleCollapsed])

  const value = React.useMemo(
    () => ({ collapsed, setCollapsed, toggleCollapsed, mobileOpen, setMobileOpen }),
    [collapsed, setCollapsed, toggleCollapsed, mobileOpen]
  )

  return (
    <ShellContext.Provider value={value}>
      <div data-collapsed={collapsed} className="group/shell flex min-h-dvh bg-background">
        <AppSidebar />
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            showCloseButton={false}
            className="w-84 max-w-[calc(100vw-48px)] gap-0 border-r border-border bg-sidebar p-0 sm:max-w-84"
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SheetDescription className="sr-only">Main navigation for the Natasha dashboard</SheetDescription>
            <SidebarBody variant="mobile" />
          </SheetContent>
        </Sheet>
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </ShellContext.Provider>
  )
}
