"use client"

import * as React from "react"
import Link from "next/link"
import { Copy, Ellipsis, Eye, LayoutGrid, List, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import type { Product } from "@/lib/natasha/data"
import { formatCurrency, formatNumber } from "@/lib/natasha/format"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { RingProgress } from "@/components/natasha/charts/radial-charts"
import { Sparkline } from "@/components/natasha/charts/trend-charts"
import { DateRangePicker, type DateRange } from "@/components/natasha/date-range-picker"
import { PageToolbar } from "@/components/natasha/page"
import { PaginationBar, paginate } from "@/components/natasha/pagination-bar"
import { ProductImage } from "@/components/natasha/product-image"
import { TabBar } from "@/components/natasha/tab-bar"

type Tab = "new" | "sellers" | "rated" | "sale"
type View = "grid" | "list"

const tabs: { value: Tab; label: string }[] = [
  { value: "new", label: "Newly added" },
  { value: "sellers", label: "Top sellers" },
  { value: "rated", label: "Top rated" },
  { value: "sale", label: "On sale" },
]

function select(products: Product[], tab: Tab) {
  switch (tab) {
    case "new":
      return [...products].sort((a, b) => Number(b.id) - Number(a.id))
    case "sellers":
      return [...products].sort((a, b) => b.sales - a.sales)
    case "rated":
      return [...products].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    case "sale":
      return products.filter((p) => p.discount > 0)
  }
}

function salePrice(product: Product) {
  return product.price * (1 - product.discount / 100)
}

export function ProductCatalog({ products }: { products: Product[] }) {
  const [tab, setTab] = React.useState<Tab>("sellers")
  const [view, setView] = React.useState<View>("grid")
  const [range, setRange] = React.useState<DateRange | null>(null)
  const [page, setPage] = React.useState(1)

  const list = React.useMemo(() => select(products, tab), [products, tab])
  const paged = paginate(list, page, view === "grid" ? 8 : 7)

  return (
    <>
      <PageToolbar>
        <TabBar
          label="Product lists"
          items={tabs}
          value={tab}
          onValueChange={(value) => {
            setTab(value)
            setPage(1)
          }}
        />
        <div className="flex flex-wrap items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon-lg" asChild>
                <Link href="/dashboard/products/new" aria-label="New product">
                  <Plus />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>New product</TooltipContent>
          </Tooltip>
          <ViewToggle
            value={view}
            onValueChange={(value) => {
              setView(value)
              setPage(1)
            }}
          />
          <DateRangePicker value={range} onApply={setRange} />
        </div>
      </PageToolbar>

      {paged.items.length === 0 ? (
        <div className="grid place-items-center rounded-3xl border border-dashed border-border py-24 type-body text-muted-foreground">
          No products match your search.
        </div>
      ) : view === "grid" ? (
        <div className="flex flex-col gap-6">
          <ul className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
            {paged.items.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </ul>
          {paged.pageCount > 1 && (
            <div className="flex justify-center">
              <div className="rounded-2xl border border-border bg-card px-4 py-3">
                <PaginationBar page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          <ul className="divide-y divide-border">
            {paged.items.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </ul>
          {paged.pageCount > 1 && (
            <div className="border-t border-border px-6 py-4">
              <PaginationBar page={paged.page} pageCount={paged.pageCount} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}
    </>
  )
}

/* View toggle -------------------------------------------------------------- */

function ViewToggle({ value, onValueChange }: { value: View; onValueChange: (value: View) => void }) {
  const options = [
    { value: "grid" as const, label: "Grid view", icon: LayoutGrid },
    { value: "list" as const, label: "List view", icon: List },
  ]
  return (
    <div role="radiogroup" aria-label="Layout" className="flex rounded-lg border border-border bg-secondary">
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={option.label}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "-m-px grid size-11 place-items-center rounded-lg border border-transparent text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40",
              active && "border-primary-border bg-primary text-primary-foreground hover:text-primary-foreground"
            )}
          >
            <option.icon className="size-5" />
          </button>
        )
      })}
    </div>
  )
}

/* Shared bits -------------------------------------------------------------- */

function CategoryLink({ category }: { category: string }) {
  return (
    <span className="truncate type-micro text-muted-foreground underline decoration-1 underline-offset-2">
      {category}
    </span>
  )
}

function ProductMenu({ product, trigger }: { product: Product; trigger: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/products/${product.id}`}>
            <Eye /> View product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast(`Editing ${product.name}`)}>
          <Pencil /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast.success(`${product.name} duplicated`)}>
          <Copy /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border-subtle" />
        <DropdownMenuItem variant="destructive" onSelect={() => toast(`${product.name} moved to trash`)}>
          <Trash2 /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* Grid tile ---------------------------------------------------------------- */

function ProductTile({ product }: { product: Product }) {
  return (
    <li className="group/tile flex min-w-0 flex-col gap-4">
      <Link
        href={`/dashboard/products/${product.id}`}
        className="relative block overflow-hidden rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
      >
        <ProductImage
          product={product}
          className="w-full rounded-2xl transition-transform duration-300 group-hover/tile:scale-[1.03]"
        />
        <span className="absolute bottom-4 left-4 flex h-8 items-center gap-2 rounded-lg border border-white/10 bg-black/60 px-2 type-body-lg font-semibold text-white backdrop-blur-md">
          {formatCurrency(salePrice(product))}
          {product.discount > 0 && (
            <span className="type-caption text-white/60 line-through">{formatCurrency(product.price)}</span>
          )}
        </span>
        {product.discount > 0 && (
          <Badge variant="success" className="absolute top-4 left-4">
            −{product.discount}%
          </Badge>
        )}
      </Link>
      <div className="flex items-start gap-2 pl-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Link
            href={`/dashboard/products/${product.id}`}
            className="truncate rounded-sm type-body-lg font-semibold outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            {product.name}
          </Link>
          <CategoryLink category={product.category} />
        </div>
        <ProductMenu
          product={product}
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${product.name}`} className="text-muted-foreground">
              <Ellipsis />
            </Button>
          }
        />
      </div>
    </li>
  )
}

/* List row ----------------------------------------------------------------- */

function ProductRow({ product }: { product: Product }) {
  return (
    <li className="flex flex-wrap items-center gap-x-6 gap-y-4 px-4 py-3 transition-colors hover:bg-secondary/40 md:px-4">
      <Link
        href={`/dashboard/products/${product.id}`}
        className="flex min-w-0 flex-1 basis-72 items-center gap-5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
      >
        <ProductImage product={product} className="size-19 rounded-xl" />
        <span className="flex min-w-0 flex-col gap-1">
          <span className="truncate type-body-lg font-semibold">{product.name}</span>
          <CategoryLink category={product.category} />
          <span className="mt-1 type-body-lg font-semibold tabular-nums">{formatCurrency(salePrice(product))}</span>
        </span>
      </Link>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <RingProgress value={product.rating} className="size-11" />
          <Stat value={product.rating.toFixed(1)} label="Reviews" />
        </div>
        <span aria-hidden className="h-10 w-px bg-border" />
        <Stat value={formatNumber(product.sales)} label="Sales" />
        <Sparkline values={product.trend} className="hidden h-10 w-36 md:block" />
        <ProductMenu
          product={product}
          trigger={
            <Button variant="secondary" size="icon-lg" aria-label={`Actions for ${product.name}`}>
              <Ellipsis />
            </Button>
          }
        />
      </div>
    </li>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <span className="flex min-w-14 flex-col">
      <span className="type-title tabular-nums">{value}</span>
      <span className="type-micro text-muted-foreground">{label}</span>
    </span>
  )
}
