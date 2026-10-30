import { geoMercator, geoPath, type GeoPermissibleObjects } from "d3-geo"
import { feature } from "topojson-client"
import type { GeometryCollection, Topology } from "topojson-specification"
import type { Feature, FeatureCollection, Geometry } from "geojson"
import world110 from "world-atlas/countries-110m.json"
import world50 from "world-atlas/countries-50m.json"

import { cn } from "@/lib/utils"

/*
 * Server-rendered maps: the projection runs at render time, so the browser only
 * receives SVG paths — no map library or topology JSON is shipped to the client.
 */

type CountryProps = { name: string }
type Country = Feature<Geometry, CountryProps> & { id?: string }

function countries(topology: unknown) {
  const topo = topology as Topology<{ countries: GeometryCollection<CountryProps> }>
  return (feature(topo, topo.objects.countries) as FeatureCollection<Geometry, CountryProps>)
    .features as Country[]
}

const landFill = "color-mix(in srgb, var(--primary) 28%, var(--card))"

/* World choropleth --------------------------------------------------------- */

const tierFill = ["var(--chart-4)", "var(--chart-3)", "var(--chart-2)", "var(--chart-1)"] as const
export const tierLabels = ["None", "Low", "Medium", "High"] as const

export function ChoroplethMap({
  values,
  className,
}: {
  /** ISO 3166-1 numeric id → tier 0 (none) … 3 (high) */
  values: Record<string, 0 | 1 | 2 | 3>
  className?: string
}) {
  const width = 640
  const height = 400
  const features = countries(world110).filter((f) => f.id !== "010")
  const projection = geoMercator().fitExtent(
    [
      [0, 8],
      [width, height],
    ],
    { type: "FeatureCollection", features } as GeoPermissibleObjects
  )
  const path = geoPath(projection)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn("w-full", className)} role="img" aria-label="Conversion rate by country">
      {features.map((f) => {
        const tier = values[String(f.id)] ?? 0
        const d = path(f)
        if (!d) return null
        return (
          <path
            key={String(f.id) + f.properties.name}
            d={d}
            fill={tierFill[tier]}
            stroke="var(--card)"
            strokeWidth={0.6}
            className="transition-[filter] hover:brightness-125"
          >
            <title>{`${f.properties.name}: ${tierLabels[tier]}`}</title>
          </path>
        )
      })}
    </svg>
  )
}

/* Location map (Europe) ---------------------------------------------------- */

export function LocationMap({
  countryId,
  label,
  className,
}: {
  countryId: string
  label: string
  className?: string
}) {
  const width = 680
  const height = 340
  const all = countries(world50)
  const target = all.find((f) => f.id === countryId)
  const focus = target ?? all[0]

  // Frame a wide window around the country, biased to show its neighbours.
  const [[minX, minY], [maxX, maxY]] = geoPath().bounds(focus as GeoPermissibleObjects)
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  const projection = geoMercator().fitExtent(
    [
      [0, 0],
      [width, height],
    ],
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPoint",
        coordinates: [
          [cx - 34, cy - 9],
          [cx + 30, cy + 16],
        ],
      },
    } as GeoPermissibleObjects
  )
  const path = geoPath(projection)
  const visible = all.filter((f) => {
    const [[x0, y0], [x1, y1]] = path.bounds(f as GeoPermissibleObjects)
    return x1 > -40 && x0 < width + 40 && y1 > -40 && y0 < height + 40
  })
  const [px, py] = path.centroid(focus as GeoPermissibleObjects)
  const pillWidth = label.length * 9 + 28

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn("size-full", className)}
      role="img"
      aria-label={`Customer location: ${label}`}
    >
      {visible.map((f) => (
        <path
          key={String(f.id) + f.properties.name}
          d={path(f) ?? undefined}
          fill={f.id === countryId ? "var(--primary)" : landFill}
          stroke={f.id === countryId ? "var(--primary-light)" : "var(--card)"}
          strokeWidth={f.id === countryId ? 1.2 : 0.8}
        >
          <title>{f.properties.name}</title>
        </path>
      ))}
      {target && (
        <g transform={`translate(${px - pillWidth / 2} ${py - 64})`}>
          <rect width={pillWidth} height={32} rx={8} fill="var(--primary)" stroke="var(--primary-light)" />
          <path d={`M${pillWidth / 2 - 6} 31.5L${pillWidth / 2} 38L${pillWidth / 2 + 6} 31.5Z`} fill="var(--primary)" />
          <text x={pillWidth / 2} y={16} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize={16} fontWeight={600}>
            {label}
          </text>
        </g>
      )}
    </svg>
  )
}
