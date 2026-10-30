import * as React from "react"

import { cn } from "@/lib/utils"

/** Natasha mark — a horse head breaking out of a crescent ring. */
export function LogoMark({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  const id = React.useId().replace(/:/g, "")
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={cn("size-10 shrink-0", className)}
      {...props}
    >
      <defs>
        <linearGradient id={`${id}-g`} x1="6" y1="4" x2="32" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4fb5ff" />
          <stop offset="1" stopColor="#0a66ff" />
        </linearGradient>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40">
          <rect width="40" height="40" fill="white" />
          <path
            d="M15.6 12.2c-1.1 2.4-1.6 5.3-1.5 8.6M18.4 11.2c-1.2 2.6-1.8 5.6-1.7 9M21 13.2c-.9 2.2-1.2 4.6-1 7.2"
            stroke="black"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <circle cx="25.4" cy="14.6" r="1.1" fill="black" />
        </mask>
      </defs>
      <path
        d="M33.6 10.4A16.5 16.5 0 1 1 5.6 12.3"
        stroke={`url(#${id}-g)`}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        mask={`url(#${id}-m)`}
        fill={`url(#${id}-g)`}
        d="M11.8 33.2c-1.5-6.9-1.3-13.8 2.1-19.3l1.1-7.4 3.6 4.4c4.4.6 8.6 3.6 12.3 8.4 1 1.3.8 3.1-.5 4-1.4 1-3 .8-4.7-.4-1.5-1.1-3-1.4-4.4-.9.3 3.7 1.6 7.4 3.9 11.2-4.3 1.7-8.8 1.7-13.4 0Z"
      />
    </svg>
  )
}

export function Logo({
  className,
  hideWordmark,
}: {
  className?: string
  hideWordmark?: boolean
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <LogoMark />
      {!hideWordmark && (
        <span className="text-[22px] leading-none font-extrabold tracking-[0.04em] text-foreground">
          NATASHA
        </span>
      )}
    </span>
  )
}
