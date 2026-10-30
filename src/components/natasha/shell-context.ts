"use client"

import * as React from "react"

export type ShellContextValue = {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  toggleCollapsed: () => void
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
}

export const ShellContext = React.createContext<ShellContextValue | null>(null)

export function useShell() {
  const context = React.useContext(ShellContext)
  if (!context) throw new Error("useShell must be used within <AppShell />")
  return context
}
