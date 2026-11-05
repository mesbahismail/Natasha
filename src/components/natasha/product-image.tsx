import * as React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import type { GarmentKind, GarmentPattern, Product, ProductArt } from "@/lib/natasha/data"

/* -------------------------------------------------------------------------- */
/* Garment silhouettes on a 200 × 200 studio canvas.                           */
/* -------------------------------------------------------------------------- */

const LONG_SLEEVE =
  "M84 44Q100 58 116 44L140 50Q156 56 160 76L172 156L152 160L140 96L140 170Q100 176 60 170L60 96L48 160L28 156L40 76Q44 56 60 50Z"

type Shape = {
  body: string
  back?: string
  details?: (ink: string, accent: string) => React.ReactNode
}

const shapes: Record<GarmentKind, Shape> = {
  tee: {
    body: "M84 44Q100 58 116 44L140 52L168 78L152 100L138 90L138 168Q100 174 62 168L62 90L48 100L32 78L60 52Z",
    details: (ink) => <path d="M84 44Q100 58 116 44" stroke={ink} strokeWidth="3" fill="none" />,
  },
  blouse: {
    body: "M84 46Q100 60 116 46L138 52Q164 56 170 80Q166 98 148 96L138 92L140 166Q100 174 60 166L62 92L52 96Q34 98 30 80Q36 56 62 52Z",
    details: (ink) => (
      <>
        <path d="M86 47L100 70L114 47" stroke={ink} strokeWidth="2.5" fill="none" strokeLinejoin="round" />
        <path d="M60 92Q100 100 140 92" stroke={ink} strokeWidth="1.5" fill="none" opacity=".5" />
      </>
    ),
  },
  shirt: {
    body: "M80 42L120 42L142 50Q156 56 160 76L172 156L152 160L140 96L140 170Q100 176 60 170L60 96L48 160L28 156L40 76Q44 56 58 50Z",
    details: (ink) => (
      <>
        <path d="M80 42L100 62L88 72L74 50Z M120 42L100 62L112 72L126 50Z" fill={ink} opacity=".35" />
        <path d="M100 62V170" stroke={ink} strokeWidth="2" opacity=".5" />
        {[84, 104, 124, 144].map((y) => (
          <circle key={y} cx="104" cy={y} r="2.2" fill={ink} opacity=".7" />
        ))}
        <path d="M66 82h22v18H66z" stroke={ink} strokeWidth="1.5" fill="none" opacity=".45" />
      </>
    ),
  },
  longsleeve: {
    body: LONG_SLEEVE,
    details: (ink) => <path d="M84 44Q100 58 116 44" stroke={ink} strokeWidth="3" fill="none" />,
  },
  sweater: {
    body: LONG_SLEEVE,
    details: (ink) => (
      <>
        <path d="M84 44Q100 58 116 44" stroke={ink} strokeWidth="5" fill="none" opacity=".55" />
        <path d="M60 160L140 160L140 170Q100 176 60 170Z" fill={ink} opacity=".28" />
        <path d="M152 160L172 156L170 146L150 150Z M48 160L28 156L30 146L50 150Z" fill={ink} opacity=".28" />
      </>
    ),
  },
  hoodie: {
    body: LONG_SLEEVE,
    back: "M74 52Q74 18 100 16Q126 18 126 52Q100 66 74 52Z",
    details: (ink) => (
      <>
        <path d="M80 50Q100 64 120 50" stroke={ink} strokeWidth="4" fill="none" opacity=".5" />
        <path d="M92 58L90 88M108 58L110 88" stroke={ink} strokeWidth="2" strokeLinecap="round" opacity=".7" />
        <path d="M72 124L128 124L134 154L66 154Z" fill={ink} opacity=".22" />
        <path d="M60 160L140 160L140 170Q100 176 60 170Z" fill={ink} opacity=".22" />
      </>
    ),
  },
  jacket: {
    body: LONG_SLEEVE,
    details: (ink) => (
      <>
        <path d="M84 44L100 74L116 44L124 48L100 86L76 48Z" fill={ink} opacity=".4" />
        <path d="M100 74V170" stroke={ink} strokeWidth="2.5" opacity=".6" />
        <path d="M70 120h20M110 120h20" stroke={ink} strokeWidth="2" opacity=".5" strokeLinecap="round" />
      </>
    ),
  },
  cardigan: {
    body: LONG_SLEEVE,
    details: (ink) => (
      <>
        <path d="M86 46L100 100L114 46" stroke={ink} strokeWidth="4" fill="none" opacity=".45" strokeLinejoin="round" />
        <path d="M100 100V170" stroke={ink} strokeWidth="2" opacity=".45" />
        {[112, 130, 148].map((y) => (
          <circle key={y} cx="104" cy={y} r="2.6" fill={ink} opacity=".7" />
        ))}
        <path d="M60 160L140 160L140 170Q100 176 60 170Z" fill={ink} opacity=".25" />
      </>
    ),
  },
  tank: {
    body: "M78 36L88 36Q100 64 112 36L122 36L126 70Q138 80 138 100L140 168Q100 174 60 168L62 100Q62 80 74 70Z",
    details: (ink) => <path d="M88 36Q100 64 112 36" stroke={ink} strokeWidth="2.5" fill="none" opacity=".6" />,
  },
  cami: {
    body: "M70 72Q86 64 100 78Q114 64 130 72L140 168Q100 174 60 168Z",
    details: (ink, accent) => (
      <>
        <path d="M82 28L74 72M118 28L126 72" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
        <path
          d="M70 72q5 8 10 2t10 2 10 2 10-2 10-2 10 2"
          stroke={accent}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          opacity=".9"
        />
      </>
    ),
  },
  dress: {
    body: "M80 30L90 30Q100 50 110 30L120 30L124 62Q128 76 120 86L150 182Q100 190 50 182L80 86Q72 76 76 62Z",
    details: (ink) => <path d="M80 86Q100 92 120 86" stroke={ink} strokeWidth="2.5" fill="none" opacity=".55" />,
  },
  gown: {
    body: "M82 32Q100 52 118 32L132 38L138 56L124 60Q126 76 118 86L162 186Q100 194 38 186L82 86Q74 76 76 60L62 56L68 38Z",
    details: (ink) => (
      <>
        <path d="M82 86Q100 94 118 86" stroke={ink} strokeWidth="2.5" fill="none" opacity=".45" />
        <path d="M92 92L76 186M100 94V190M108 92L124 186" stroke={ink} strokeWidth="1.5" opacity=".25" />
        <path d="M86 34L100 66L114 34" stroke={ink} strokeWidth="2" fill="none" opacity=".4" />
      </>
    ),
  },
  skirt: {
    body: "M68 40L132 40L132 54L158 168Q100 178 42 168L68 54Z",
    details: (ink) => (
      <>
        <path d="M68 54H132" stroke={ink} strokeWidth="2.5" opacity=".5" />
        <path d="M120 54Q112 112 130 172" stroke={ink} strokeWidth="2" fill="none" opacity=".45" />
      </>
    ),
  },
  boots: {
    body: "M66 38L112 38L114 110Q116 122 128 126L156 134Q172 140 172 154L172 162L60 162L60 150Q64 100 66 38Z",
    details: (ink, accent) => (
      <>
        <path d="M60 162H172V170H86L84 176H60Z" fill={ink} opacity=".9" />
        <path
          d="M98 50L112 58M98 64L112 72M98 78L112 86M98 92L112 100M98 106L112 114"
          stroke={accent}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path d="M66 38H112V46H66Z" fill={accent} opacity=".6" />
      </>
    ),
  },
}

/* -------------------------------------------------------------------------- */
/* Fabric patterns                                                             */
/* -------------------------------------------------------------------------- */

function Pattern({ id, pattern, color, accent }: { id: string; pattern: GarmentPattern; color: string; accent: string }) {
  switch (pattern) {
    case "stripes":
      return (
        <pattern id={id} width="200" height="16" patternUnits="userSpaceOnUse">
          <rect width="200" height="16" fill={color} />
          <rect width="200" height="6" fill={accent} />
        </pattern>
      )
    case "dots":
      return (
        <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill={color} />
          <circle cx="4" cy="4" r="2.4" fill={accent} />
          <circle cx="12" cy="12" r="2.4" fill={accent} />
        </pattern>
      )
    case "floral":
      return (
        <pattern id={id} width="28" height="28" patternUnits="userSpaceOnUse">
          <rect width="28" height="28" fill={color} />
          {[
            [7, 7],
            [21, 21],
          ].map(([cx, cy]) => (
            <g key={`${cx}-${cy}`}>
              <ellipse cx={cx + 5} cy={cy + 3} rx="3" ry="1.6" fill="#5d8a4a" transform={`rotate(-30 ${cx + 5} ${cy + 3})`} />
              {[0, 72, 144, 216, 288].map((a) => (
                <circle
                  key={a}
                  cx={Math.round((cx + Math.cos((a * Math.PI) / 180) * 2.6) * 100) / 100}
                  cy={Math.round((cy + Math.sin((a * Math.PI) / 180) * 2.6) * 100) / 100}
                  r="2.2"
                  fill={accent}
                />
              ))}
              <circle cx={cx} cy={cy} r="1.4" fill="#f6c445" />
            </g>
          ))}
        </pattern>
      )
    case "denim":
      return (
        <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <rect width="6" height="6" fill={color} />
          <rect width="1.4" height="6" fill="#ffffff" opacity=".12" />
        </pattern>
      )
    case "paisley":
      return (
        <pattern id={id} width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="30" height="30" fill={color} />
          <path d="M9 6c5 0 7 6 3 10-3 3-8 1-7-4 0-3 2-6 4-6Z" fill={accent} opacity=".85" />
          <path d="M24 19c4 0 6 5 2 8-3 2-6 0-6-3 0-3 2-5 4-5Z" fill={accent} opacity=".6" />
          <circle cx="22" cy="7" r="1.6" fill={accent} />
          <circle cx="6" cy="24" r="1.6" fill={accent} />
        </pattern>
      )
    case "knit":
      return (
        <pattern id={id} width="6" height="200" patternUnits="userSpaceOnUse">
          <rect width="6" height="200" fill={color} />
          <rect width="2" height="200" fill={accent} opacity=".35" />
        </pattern>
      )
    default:
      return (
        <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill={color} />
        </pattern>
      )
  }
}

function isLight(hex: string) {
  const v = parseInt(hex.replace("#", ""), 16)
  const r = (v >> 16) & 255
  const g = (v >> 8) & 255
  const b = v & 255
  return r * 0.299 + g * 0.587 + b * 0.114 > 150
}

export function GarmentArt({ art, className }: { art: ProductArt; className?: string }) {
  const uid = React.useId().replace(/:/g, "")
  const shape = shapes[art.kind]
  const pattern = art.pattern ?? "solid"
  const accent = art.accent ?? art.color
  const ink = isLight(art.color) ? "#00000055" : "#00000099"
  const backdrop = art.backdrop ?? "#ece5dc"

  return (
    <svg viewBox="0 0 200 200" className={cn("size-full", className)} role="img" aria-hidden="true">
      <defs>
        <radialGradient id={`${uid}-bg`} cx="50%" cy="38%" r="75%">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-shade`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".22" />
          <stop offset=".55" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity=".22" />
        </linearGradient>
        <filter id={`${uid}-blur`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <clipPath id={`${uid}-clip`}>
          <path d={shape.body} />
        </clipPath>
        <Pattern id={`${uid}-fabric`} pattern={pattern} color={art.color} accent={accent} />
      </defs>

      <rect width="200" height="200" fill={backdrop} />
      <rect width="200" height="200" fill={`url(#${uid}-bg)`} />
      <ellipse cx="100" cy="184" rx="62" ry="7" fill="#000" opacity=".14" filter={`url(#${uid}-blur)`} />

      {shape.back && <path d={shape.back} fill={art.color} />}
      {shape.back && <path d={shape.back} fill="#000" opacity=".25" />}

      <path d={shape.body} fill={`url(#${uid}-fabric)`} />

      <g clipPath={`url(#${uid}-clip)`}>
        {pattern === "colorblock" && <rect x="0" y="92" width="200" height="40" fill={accent} />}
        {pattern === "graphic" && (
          <g>
            <circle cx="100" cy="104" r="22" fill={accent} />
            <rect x="78" y="104" width="44" height="4" fill={art.color} />
            <rect x="78" y="112" width="44" height="4" fill={art.color} />
            <rect x="78" y="120" width="44" height="3" fill={art.color} />
            <rect x="80" y="134" width="40" height="5" rx="1" fill={accent} opacity=".85" />
          </g>
        )}
        <rect width="200" height="200" fill={`url(#${uid}-shade)`} />
      </g>

      {shape.details?.(ink, accent)}
      <path d={shape.body} fill="none" stroke="#000" strokeOpacity=".12" strokeWidth="1" />
    </svg>
  )
}

/** Product visual: photo when `product.image` is set, otherwise the garment illustration. */
export function ProductImage({
  product,
  className,
  sizes = "128px",
}: {
  product: Pick<Product, "name" | "image" | "art">
  className?: string
  sizes?: string
}) {
  return (
    <span
      className={cn(
        "relative block aspect-square shrink-0 overflow-hidden rounded-lg bg-secondary",
        className
      )}
    >
      {product.image ? (
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={sizes}
          className="object-cover"
          unoptimized={!product.image.startsWith("/products/")}
        />
      ) : (
        <GarmentArt art={product.art} />
      )}
    </span>
  )
}
