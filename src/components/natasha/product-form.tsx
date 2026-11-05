"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, CircleX, Eye, Minus, Pencil, Plus, Upload, X } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { productCategories, type ProductArt } from "@/lib/natasha/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FieldLabel } from "@/components/natasha/kit"
import { BackLink, PageToolbar } from "@/components/natasha/page"
import { ProductImage } from "@/components/natasha/product-image"

const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

const colors = [
  { name: "Red", value: "#e5281f" },
  { name: "Amber", value: "#f6b20f" },
  { name: "Mint", value: "#3fd29a" },
  { name: "Blue", value: "#1a8cff" },
  { name: "Black", value: "#050505" },
  { name: "White", value: "#f5f5f5" },
]

type GalleryItem = { id: string; name: string; image?: string; art: ProductArt }

const initialGallery: GalleryItem[] = [
  { id: "g1", name: "White cotton T-shirt — front", image: "/products/product-28.webp", art: { kind: "tee", color: "#fbfbfa", accent: "#e3e3e0", backdrop: "#e9e4dc" } },
]

const initialTags = [
  "T-shirts",
  "Chic Women's T-shirt Styles",
  "Women's Tee",
  "Women's T-shirts",
  "Women's T-shirt Collection",
  "Stylish Women's Tees",
  "Favorite T-shirt Designs",
  "Trendy Women's T-shirt",
  "Fashionable Tees for Women",
]

export function ProductForm() {
  const router = useRouter()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = new FormData(event.currentTarget).get("name")
    toast.success(`${name || "Product"} added to your store`)
    router.push("/dashboard/products")
  }

  return (
    <form onSubmit={submit} className="contents">
      <PageToolbar>
        <BackLink href="/dashboard/products">All products</BackLink>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="secondary" size="lg" onClick={() => toast("Draft saved")}>
            <Pencil />
            Save
          </Button>
          <Button type="button" variant="secondary" size="lg" onClick={() => toast("Opening preview…")}>
            <Eye />
            Preview
          </Button>
          <Button type="submit" size="lg">
            <Plus />
            Add new product
          </Button>
        </div>
      </PageToolbar>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,4fr)_minmax(0,3fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <DetailsCard />
          <InventoryCard />
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <GalleryCard />
          <TagsCard />
          <ShippingCard />
        </div>
      </div>
    </form>
  )
}

/* Product details ---------------------------------------------------------- */

function Field({
  id,
  label,
  className,
  children,
}: {
  id: string
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("flex min-w-0 flex-col", className)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {children}
    </div>
  )
}

function DetailsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product details</CardTitle>
      </CardHeader>
      <CardContent className="gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="name" label="Product name">
            <Input id="name" name="name" defaultValue="Men white t-shirt" required />
          </Field>
          <Field id="category" label="Category">
            <Select name="category" defaultValue="T-shirts">
              <SelectTrigger id="category">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {productCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="grid gap-6 sm:grid-cols-4">
          <Field id="sku" label="SKU" className="sm:col-span-2">
            <Input id="sku" name="sku" placeholder="Exm: 000001" />
          </Field>
          <Field id="price" label="Retail price">
            <Input id="price" name="price" inputMode="decimal" placeholder="$0.00" />
          </Field>
          <Field id="wholesale" label="Wholesale price">
            <Input id="wholesale" name="wholesale" inputMode="decimal" placeholder="$0.00" />
          </Field>
        </div>
        <Field id="description" label="Description">
          <Textarea id="description" name="description" placeholder="Write few words here…" className="min-h-52" />
        </Field>
        <label className="flex w-fit cursor-pointer items-center gap-3 px-2 type-body">
          <Checkbox name="inStock" defaultChecked />
          This product is available in stock
        </label>
      </CardContent>
    </Card>
  )
}

/* Inventory ---------------------------------------------------------------- */

function InventoryCard() {
  const [selected, setSelected] = React.useState(colors.slice(0, 5).map((c) => c.name))
  const [quantity, setQuantity] = React.useState(200)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-3">
        <Field id="size" label="Size">
          <Select name="size" defaultValue="S">
            <SelectTrigger id="size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field id="colors" label="Colors">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                id="colors"
                type="button"
                className="group/colors flex h-12 w-full items-center justify-between gap-2 rounded-lg border border-input px-4 outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/25"
              >
                <span className="flex items-center gap-2">
                  {selected.length === 0 && <span className="type-body-lg text-subtle-foreground">None</span>}
                  {colors
                    .filter((c) => selected.includes(c.name))
                    .map((c) => (
                      <span
                        key={c.name}
                        className="size-5 rounded-full ring-1 ring-white/10 ring-inset"
                        style={{ backgroundColor: c.value }}
                      />
                    ))}
                </span>
                <ChevronDown className="size-4 text-muted-foreground transition-transform group-aria-expanded/colors:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width)">
              {colors.map((c) => (
                <DropdownMenuCheckboxItem
                  key={c.name}
                  checked={selected.includes(c.name)}
                  onSelect={(event) => event.preventDefault()}
                  onCheckedChange={(checked) =>
                    setSelected((list) => (checked ? [...list, c.name] : list.filter((name) => name !== c.name)))
                  }
                >
                  <span className="size-4 rounded-full ring-1 ring-white/10 ring-inset" style={{ backgroundColor: c.value }} />
                  {c.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <input type="hidden" name="colors" value={selected.join(",")} />
        </Field>

        <Field id="quantity" label="Quantity">
          <div className="flex h-12 items-center rounded-lg border border-input px-2 focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/25">
            <Button
              type="button"
              size="icon-sm"
              aria-label="Decrease quantity"
              disabled={quantity <= 0}
              onClick={() => setQuantity((q) => Math.max(0, q - 1))}
            >
              <Minus />
            </Button>
            <input
              id="quantity"
              name="quantity"
              inputMode="numeric"
              value={quantity}
              onChange={(event) => setQuantity(Math.max(0, Number(event.target.value.replace(/\D/g, "")) || 0))}
              className="min-w-0 flex-1 bg-transparent text-center type-body-lg tabular-nums outline-none"
            />
            <Button type="button" size="icon-sm" aria-label="Increase quantity" onClick={() => setQuantity((q) => q + 1)}>
              <Plus />
            </Button>
          </div>
        </Field>
      </CardContent>
    </Card>
  )
}

/* Gallery ------------------------------------------------------------------ */

function GalleryCard() {
  const [items, setItems] = React.useState(initialGallery)
  const inputRef = React.useRef<HTMLInputElement>(null)

  function onFiles(files: FileList | null) {
    if (!files) return
    const added = Array.from(files).map((file, i) => ({
      id: `${file.name}-${Date.now()}-${i}`,
      name: file.name,
      image: URL.createObjectURL(file),
      art: initialGallery[0].art,
    }))
    setItems((list) => [...list, ...added])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-wrap gap-4">
          <li>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="grid size-16 place-items-center rounded-lg border-2 border-dashed border-input bg-secondary text-foreground outline-none transition-colors hover:border-primary hover:text-primary-light focus-visible:ring-3 focus-visible:ring-ring/40"
              aria-label="Upload images"
            >
              <Upload className="size-5" />
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(event) => {
                onFiles(event.target.files)
                event.target.value = ""
              }}
            />
          </li>
          {items.map((item) => (
            <li key={item.id} className="relative">
              <ProductImage product={item} className="size-16 rounded-lg" />
              <button
                type="button"
                onClick={() => setItems((list) => list.filter((i) => i.id !== item.id))}
                className="absolute -right-1.5 -bottom-1.5 grid size-5 place-items-center rounded-full bg-danger text-white ring-2 ring-card outline-none hover:brightness-110 focus-visible:ring-ring"
                aria-label={`Remove ${item.name}`}
              >
                <X className="size-3" strokeWidth={3} />
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

/* Tags --------------------------------------------------------------------- */

function TagsCard() {
  const [tags, setTags] = React.useState(initialTags)
  const [draft, setDraft] = React.useState("")

  function add() {
    const value = draft.trim()
    if (value && !tags.some((t) => t.toLowerCase() === value.toLowerCase())) setTags((list) => [...list, value])
    setDraft("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex min-h-48 flex-wrap content-start gap-3 rounded-xl border border-input p-4 focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/25">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex h-8 items-center gap-2 rounded-md border border-primary-soft-border bg-primary-soft pr-1.5 pl-2 type-body font-semibold text-foreground"
            >
              {tag}
              <button
                type="button"
                onClick={() => setTags((list) => list.filter((t) => t !== tag))}
                className="rounded-full text-foreground/80 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Remove ${tag}`}
              >
                <CircleX className="size-4" />
              </button>
            </span>
          ))}
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === ",") {
                event.preventDefault()
                add()
              } else if (event.key === "Backspace" && !draft && tags.length) {
                setTags((list) => list.slice(0, -1))
              }
            }}
            onBlur={add}
            placeholder={tags.length ? "Add tag…" : "Type a tag and press Enter"}
            aria-label="Add tag"
            className="h-8 min-w-32 flex-1 bg-transparent px-1 type-body outline-none placeholder:text-subtle-foreground"
          />
          <input type="hidden" name="tags" value={tags.join(",")} />
        </div>
      </CardContent>
    </Card>
  )
}

/* Shipping ----------------------------------------------------------------- */

function ShippingCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Field id="dimensions" label="Dimensions (cm)">
          <Input id="dimensions" name="dimensions" placeholder="Height x Width x Length" />
        </Field>
        <Field id="weight" label="Weight (kg)">
          <Input id="weight" name="weight" inputMode="decimal" placeholder="0.0" />
        </Field>
      </CardContent>
    </Card>
  )
}
