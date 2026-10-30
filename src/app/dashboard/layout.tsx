import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { cookies } from "next/headers"

import { SIDEBAR_COOKIE } from "@/lib/natasha/constants"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppShell } from "@/components/natasha/app-shell"

const inter = Inter({ subsets: ["latin"], axes: ["opsz"], display: "swap" })

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Natasha" },
}

export const viewport: Viewport = {
  themeColor: "#141414",
  colorScheme: "dark",
}

/**
 * Everything the dashboard needs lives here (font, tooltips, toasts), so the
 * template drops into any Next.js app without touching the root layout.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const stored = (await cookies()).get(SIDEBAR_COOKIE)?.value
  const defaultCollapsed = stored === undefined ? undefined : stored === "collapsed"

  return (
    <>
      {/* Feeds Inter into the theme's --font-sans, portalled popovers included. */}
      <style>{`:root{--font-inter:${inter.style.fontFamily}}`}</style>
      <TooltipProvider delayDuration={200}>
        <AppShell defaultCollapsed={defaultCollapsed}>{children}</AppShell>
      </TooltipProvider>
      <Toaster position="bottom-right" />
    </>
  )
}
