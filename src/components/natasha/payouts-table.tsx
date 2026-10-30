"use client"

import type { Payout } from "@/lib/natasha/data"
import { formatCurrency, formatLongDate } from "@/lib/natasha/format"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { PaginationBar, paginate } from "@/components/natasha/pagination-bar"
import { SortableHead, sortRows, useSort } from "@/components/natasha/sortable-head"
import { usePage } from "@/components/natasha/use-page"

type SortKey = "month" | "date" | "amount" | "method" | "status"

const columns: { key: SortKey; label: string }[] = [
  { key: "month", label: "Month" },
  { key: "date", label: "Paid on" },
  { key: "amount", label: "Amount" },
  { key: "method", label: "Method" },
  { key: "status", label: "Status" },
]

const textKeys = ["method", "status"] as const

function compare(a: Payout, b: Payout, key: SortKey) {
  switch (key) {
    case "month":
    case "date":
      return a.date.localeCompare(b.date)
    case "amount":
      return a.amount - b.amount
    case "method":
      return a.method.localeCompare(b.method)
    case "status":
      return a.status.localeCompare(b.status)
  }
}

export function PayoutsTable({ rows, pageSize = 12 }: { rows: Payout[]; pageSize?: number }) {
  const [sort, toggleSort] = useSort<SortKey>({ key: "month", dir: "desc" }, textKeys)
  const [page, setPage] = usePage(sort)
  const view = paginate(sortRows(rows, sort, compare), page, pageSize)

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-x-auto px-4 md:px-6">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <SortableHead key={column.key} column={column.key} label={column.label} sort={sort} onSort={toggleSort} />
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {view.items.map((payout) => (
              <TableRow key={payout.id} className="h-14">
                <TableCell className="h-14 px-2">{payout.month}</TableCell>
                <TableCell className="h-14 px-2 text-muted-foreground">{formatLongDate(payout.date)}</TableCell>
                <TableCell className="h-14 px-2 tabular-nums">+{formatCurrency(payout.amount)}</TableCell>
                <TableCell className="h-14 px-2">{payout.method}</TableCell>
                <TableCell className="h-14 px-2">
                  <Badge variant={payout.status === "completed" ? "success" : "warning"}>{payout.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {view.items.length === 0 && (
          <p className="py-16 text-center type-body text-muted-foreground">No payouts match your search.</p>
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
