import type { Metadata } from "next"

import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Natasha — Store dashboard",
    template: "%s · Natasha",
  },
  description:
    "Natasha is a free, dark e-commerce admin dashboard template built with Next.js, Tailwind CSS and shadcn/ui.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
