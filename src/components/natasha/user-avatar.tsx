"use client"

import * as React from "react"
import { createAvatar } from "@dicebear/core"
import * as micah from "@dicebear/micah"

import { cn } from "@/lib/utils"

const cache = new Map<string, string>()

function avatarUri(seed: string, color: string) {
  const key = `${seed}:${color}`
  let uri = cache.get(key)
  if (!uri) {
    uri = createAvatar(micah, {
      seed,
      backgroundColor: [color.replace("#", "")],
      mouth: ["smile", "laughing", "smirk"],
      scale: 92,
      translateY: 4,
    }).toDataUri()
    cache.set(key, uri)
  }
  return uri
}

/**
 * Illustrated avatar (DiceBear "Micah", CC BY 4.0 — Micah Lanier).
 * Rendered locally, so it works offline and needs no image host.
 */
export function UserAvatar({
  seed,
  color = "#3d7bff",
  online,
  className,
  rounded = "full",
}: {
  seed: string
  color?: string
  online?: boolean
  className?: string
  rounded?: "full" | "lg"
}) {
  const src = React.useMemo(() => avatarUri(seed, color), [seed, color])
  return (
    <span
      className={cn(
        "relative inline-flex size-12 shrink-0",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        className={cn(
          "size-full object-cover",
          rounded === "full" ? "rounded-full" : "rounded-lg"
        )}
      />
      {online !== undefined && (
        <span
          aria-label={online ? "Online" : "Offline"}
          className={cn(
            "absolute right-0 bottom-0 size-3 rounded-full border-2 border-card",
            online ? "bg-success" : "bg-subtle-foreground"
          )}
        />
      )}
    </span>
  )
}
