"use client"

import * as React from "react"
import {
  BookOpen,
  Download,
  Ellipsis,
  LoaderCircle,
  Plus,
  Power,
  Puzzle,
  RefreshCcw,
  RefreshCw,
  Settings2,
} from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import type { Extension } from "@/lib/natasha/data"
import { formatCompact } from "@/lib/natasha/format"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BigCommerceLogo,
  MagentoLogo,
  MailchimpLogo,
  ShopifyLogo,
  SquarespaceLogo,
  WooLogo,
} from "@/components/natasha/brand-logos"
import { PageToolbar } from "@/components/natasha/page"
import { PaginationBar, paginate } from "@/components/natasha/pagination-bar"
import { SortableHead, sortRows, useSort } from "@/components/natasha/sortable-head"
import { TabBar } from "@/components/natasha/tab-bar"
import { usePage } from "@/components/natasha/use-page"

type Tab = "all" | "mine" | "popular" | "rated"
type SortKey = "name" | "version" | "updates"

const tabs: { value: Tab; label: string }[] = [
  { value: "all", label: "All extensions" },
  { value: "mine", label: "My extensions" },
  { value: "popular", label: "Popular" },
  { value: "rated", label: "Top rated" },
]

const logos: Record<Extension["logo"], { icon: React.ElementType; className: string }> = {
  mailchimp: { icon: MailchimpLogo, className: "text-foreground" },
  woo: { icon: WooLogo, className: "text-[#a77cf1]" },
  shopify: { icon: ShopifyLogo, className: "text-[#95bf47]" },
  bigcommerce: { icon: BigCommerceLogo, className: "text-foreground" },
  magento: { icon: MagentoLogo, className: "text-[#f26322]" },
  squarespace: { icon: SquarespaceLogo, className: "text-foreground" },
  generic: { icon: Puzzle, className: "text-primary-light" },
}

const textKeys = ["name"] as const

function select(list: Extension[], tab: Tab) {
  switch (tab) {
    case "all":
      return list
    case "mine":
      return list.filter((e) => e.installed)
    case "popular":
      return [...list].sort((a, b) => b.installs - a.installs)
    case "rated":
      return [...list].sort((a, b) => b.rating - a.rating)
  }
}

function compare(a: Extension, b: Extension, key: SortKey) {
  switch (key) {
    case "name":
      return a.name.localeCompare(b.name)
    case "version":
      return a.version.localeCompare(b.version, undefined, { numeric: true })
    case "updates":
      return Number(a.updateAvailable) - Number(b.updateAvailable)
  }
}

export function ExtensionsTable({ initial, pageSize = 6 }: { initial: Extension[]; pageSize?: number }) {
  const [items, setItems] = React.useState(initial)
  const [tab, setTab] = React.useState<Tab>("mine")
  const [sort, toggleSort] = useSort<SortKey>(null, textKeys)
  const [busy, setBusy] = React.useState<string | null>(null)

  const [page, setPage] = usePage(`${tab}-${sort?.key}-${sort?.dir}`)
  const view = paginate(sortRows(select(items, tab), sort, compare), page, pageSize)

  function patch(id: string, change: Partial<Extension>) {
    setItems((list) => list.map((e) => (e.id === id ? { ...e, ...change } : e)))
  }

  function run(extension: Extension, action: "update" | "check" | "install") {
    setBusy(extension.id)
    window.setTimeout(() => {
      setBusy(null)
      if (action === "update") {
        const [major, minor, patchV] = extension.version.split(".").map(Number)
        patch(extension.id, { updateAvailable: false, version: `${major}.${minor}.${patchV + 1}` })
        toast.success(`${extension.name} updated`)
      } else if (action === "install") {
        patch(extension.id, { installed: true })
        toast.success(`${extension.name} installed`)
      } else {
        toast(`${extension.name} is up to date`)
      }
    }, 900)
  }

  return (
    <>
      <PageToolbar>
        <TabBar label="Extension lists" items={tabs} value={tab} onValueChange={setTab} />
        <Button size="lg" onClick={() => toast("Opening the extension builder…")}>
          <Plus />
          New extension
        </Button>
      </PageToolbar>

      <div className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
        <div className="overflow-x-auto px-4 md:px-6">
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow>
                <SortableHead column="name" label="Extension" sort={sort} onSort={toggleSort} className="w-1/2" />
                <SortableHead column="version" label="Version" sort={sort} onSort={toggleSort} />
                <SortableHead column="updates" label="Updates" sort={sort} onSort={toggleSort} />
                <TableHead className="w-12 px-2">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {view.items.map((extension) => {
                const logo = logos[extension.logo]
                const loading = busy === extension.id
                return (
                  <TableRow key={extension.id}>
                    <TableCell className="h-28 px-2">
                      <div className="flex items-center gap-5">
                        <span className="grid size-15 shrink-0 place-items-center rounded-full border border-border bg-secondary">
                          <logo.icon className={cn("size-7", logo.className)} />
                        </span>
                        <span className="flex min-w-0 flex-col gap-1">
                          <span className="type-title">{extension.name}</span>
                          <span className="truncate type-body text-muted-foreground">{extension.description}</span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="h-28 px-2 font-semibold whitespace-nowrap">Version {extension.version}</TableCell>
                    <TableCell className="h-28 px-2">
                      {!extension.installed ? (
                        <Button variant="soft" disabled={loading} onClick={() => run(extension, "install")}>
                          {loading ? <LoaderCircle className="animate-spin" /> : <Download />}
                          Install · {formatCompact(extension.installs)}
                        </Button>
                      ) : extension.updateAvailable ? (
                        <Button disabled={loading} onClick={() => run(extension, "update")}>
                          {loading ? <LoaderCircle className="animate-spin" /> : <RefreshCw />}
                          Update
                        </Button>
                      ) : (
                        <Button variant="secondary" disabled={loading} onClick={() => run(extension, "check")}>
                          {loading ? <LoaderCircle className="animate-spin" /> : <RefreshCcw />}
                          Check for updates
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="h-28 px-2 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon-lg" aria-label={`Actions for ${extension.name}`}>
                            <Ellipsis />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem disabled={!extension.installed} onSelect={() => toast(`${extension.name} settings`)}>
                            <Settings2 /> Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => toast(`Opening ${extension.name} docs`)}>
                            <BookOpen /> Documentation
                          </DropdownMenuItem>
                          {extension.installed && (
                            <>
                              <DropdownMenuSeparator className="bg-border-subtle" />
                              <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => {
                                  patch(extension.id, { installed: false, updateAvailable: false })
                                  toast(`${extension.name} uninstalled`)
                                }}
                              >
                                <Power /> Uninstall
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {view.items.length === 0 && (
            <p className="py-16 text-center type-body text-muted-foreground">No extensions here yet.</p>
          )}
        </div>
        {view.pageCount > 1 && (
          <div className="border-t border-border-subtle px-6 py-4">
            <PaginationBar page={view.page} pageCount={view.pageCount} onPageChange={setPage} />
          </div>
        )}
      </div>
    </>
  )
}
