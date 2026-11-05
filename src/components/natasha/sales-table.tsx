"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Ellipsis, Eye, Printer, Undo2 } from "lucide-react"
import { toast } from "sonner"

import type { Product, Sale } from "@/lib/natasha/data"
import { formatShortDate, formatSignedCurrency } from "@/lib/natasha/format"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/natasha/kit"
import { PaginationBar, paginate } from "@/components/natasha/pagination-bar"
import { ProductImage } from "@/components/natasha/product-image"
import { SortableHead, sortRows, useSort } from "@/components/natasha/sortable-head"
import { usePage } from "@/components/natasha/use-page"

export type SaleRow = Sale & { product: Pick<Product, "id" | "name" | "sku" | "art" | "image"> }

type SortKey = "product" | "sku" | "date" | "total" | "profit" | "status"

const columns: { key: SortKey; label: string; className?: string }[] = [
  { key: "product", label: "Product", className: "w-[36%]" },
  { key: "sku", label: "SKU" },
  { key: "date", label: "Date" },
  { key: "total", label: "Price total" },
  { key: "profit", label: "Profit" },
  { key: "status", label: "Status" },
]

const textKeys = ["product", "sku", "status"] as const

function compare(a: SaleRow, b: SaleRow, key: SortKey) {
  switch (key) {
    case "product":
      return a.product.name.localeCompare(b.product.name)
    case "sku":
      return a.product.sku.localeCompare(b.product.sku)
    case "date":
      return a.date.localeCompare(b.date)
    case "total":
      return a.total - b.total
    case "profit":
      return a.profit - b.profit
    case "status":
      return a.status.localeCompare(b.status)
  }
}

export function SalesTable({ rows, pageSize = 10 }: { rows: SaleRow[]; pageSize?: number }) {
  const router = useRouter()
  const [sort, toggleSort] = useSort<SortKey>({ key: "date", dir: "desc" }, textKeys)
  const [page, setPage] = usePage(sort)
  const view = paginate(sortRows(rows, sort, compare), page, pageSize)

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto px-4 md:px-6">
        <Table className="min-w-[880px]">
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <SortableHead
                  key={column.key}
                  column={column.key}
                  label={column.label}
                  sort={sort}
                  onSort={toggleSort}
                  className={column.className}
                />
              ))}
              <TableHead className="w-12 px-2">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {view.items.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer"
                onClick={(event) => {
                  if ((event.target as HTMLElement).closest("button, a, [role=menu]")) return
                  router.push(`/dashboard/sales/${row.id}`)
                }}
              >
                <TableCell className="px-2">
                  <Link
                    href={`/dashboard/sales/${row.id}`}
                    className="flex items-center gap-4 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                  >
                    <ProductImage product={row.product} className="size-10 rounded-md" />
                    <span className="truncate font-semibold">{row.product.name}</span>
                  </Link>
                </TableCell>
                <TableCell className="px-2 tabular-nums">{row.product.sku}</TableCell>
                <TableCell className="px-2">{formatShortDate(row.date)}</TableCell>
                <TableCell className="px-2 tabular-nums">{formatSignedCurrency(row.total)}</TableCell>
                <TableCell className="px-2 tabular-nums">{formatSignedCurrency(row.profit)}</TableCell>
                <TableCell className="px-2">
                  <StatusBadge status={row.status} />
                </TableCell>
                <TableCell className="px-2 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon-lg" aria-label={`Actions for sale #${row.id}`}>
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/sales/${row.id}`}>
                          <Eye /> View sale
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => toast.success(`Invoice for sale #${row.id} sent to printer`)}>
                        <Printer /> Print invoice
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border-subtle" />
                      <DropdownMenuItem
                        variant="destructive"
                        disabled={row.status === "canceled"}
                        onSelect={() => toast(`Refund started for sale #${row.id}`)}
                      >
                        <Undo2 /> Refund
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {view.items.length === 0 && (
          <p className="py-16 text-center type-body text-muted-foreground">No sales match your search.</p>
        )}
      </div>
      {view.pageCount > 1 && (
        <div className="border-t border-border-subtle px-6 py-4">
          <PaginationBar page={view.page} pageCount={view.pageCount} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}
