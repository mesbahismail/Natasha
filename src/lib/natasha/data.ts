/**
 * Natasha mock data.
 *
 * Everything the template renders comes from this file and `analytics.ts`, so
 * wiring the dashboard to a real backend means replacing these exports with
 * fetchers that return the same shapes.
 */

/* -------------------------------------------------------------------------- */
/* Deterministic randomness — keeps server and client renders identical.       */
/* -------------------------------------------------------------------------- */

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* -------------------------------------------------------------------------- */
/* Catalog                                                                     */
/* -------------------------------------------------------------------------- */

export type GarmentKind =
  | "tee"
  | "blouse"
  | "shirt"
  | "longsleeve"
  | "sweater"
  | "hoodie"
  | "jacket"
  | "cardigan"
  | "tank"
  | "cami"
  | "dress"
  | "gown"
  | "skirt"
  | "boots"

export type GarmentPattern =
  | "solid"
  | "stripes"
  | "dots"
  | "floral"
  | "denim"
  | "paisley"
  | "graphic"
  | "colorblock"
  | "knit"

export type ProductArt = {
  kind: GarmentKind
  /** Main fabric color. */
  color: string
  /** Pattern / trim color. */
  accent?: string
  pattern?: GarmentPattern
  /** Studio backdrop color. */
  backdrop?: string
}

export type Product = {
  id: string
  name: string
  category: string
  price: number
  wholesale: number
  sku: string
  rating: number
  reviews: number
  sales: number
  stock: number
  /** Optional photo URL. When omitted the built-in garment illustration is used. */
  image?: string
  art: ProductArt
  /** Weekly sales trend used for sparklines. */
  trend: number[]
  tags: string[]
  /** Percent off; 0 when the product isn't on sale. */
  discount: number
}

type ProductSeed = Omit<
  Product,
  "sku" | "rating" | "reviews" | "sales" | "stock" | "trend" | "wholesale" | "tags" | "discount"
>

const productSeeds: ProductSeed[] = [
  { id: "1", name: "Floral Print Blouse", category: "Women, Shirts", price: 49, art: { kind: "blouse", color: "#f4ece1", accent: "#e8613a", pattern: "floral" } },
  { id: "2", name: "Elegant Silk Blouse", category: "Women, Shirts", price: 39, art: { kind: "blouse", color: "#efe5d3", accent: "#d9cbb1", pattern: "solid" } },
  { id: "3", name: "Casual Denim Shirt", category: "Women, Shirts", price: 49, art: { kind: "shirt", color: "#5a7ea8", accent: "#c9d6e6", pattern: "denim" } },
  { id: "4", name: "Polka Dot Tunic", category: "Women, Shirts", price: 39, art: { kind: "longsleeve", color: "#17181a", accent: "#f5f5f5", pattern: "dots" } },
  { id: "5", name: "Striped Summer Top", category: "Women, Tops", price: 49, art: { kind: "tank", color: "#fbf3ea", accent: "#e9786a", pattern: "stripes" } },
  { id: "6", name: "Chic Bohemian Shirt", category: "Women, Shirts", price: 49, art: { kind: "blouse", color: "#c4704a", accent: "#f1d9b5", pattern: "paisley" } },
  { id: "7", name: "Lace Detail Camisole", category: "Women, Tops", price: 59, art: { kind: "cami", color: "#141414", accent: "#3a3a3a", pattern: "solid" } },
  { id: "8", name: "Graphic Tee for Women", category: "Women, T-shirts", price: 69, art: { kind: "tee", color: "#1b1b1d", accent: "#f0a24a", pattern: "graphic" } },
  { id: "9", name: "Striped Maxi Dress", category: "Women, Dresses", price: 52.5, art: { kind: "dress", color: "#f5f1ea", accent: "#1d1d1f", pattern: "stripes" } },
  { id: "10", name: "Denim Jacket with Embroidery", category: "Women, Jackets", price: 39.75, art: { kind: "jacket", color: "#46699a", accent: "#e2574c", pattern: "floral" } },
  { id: "11", name: "Polka Dot Wrap Skirt", category: "Women, Skirts", price: 60, art: { kind: "skirt", color: "#151517", accent: "#f2f2f2", pattern: "dots" } },
  { id: "12", name: "Lace-up Ankle Boots", category: "Women, Shoes", price: 47.25, art: { kind: "boots", color: "#1f1c1a", accent: "#4a3f38", pattern: "solid" } },
  { id: "13", name: "Classic Crew Neck Sweater", category: "Women, Knitwear", price: 89, art: { kind: "sweater", color: "#c9a886", accent: "#b8946f", pattern: "knit" } },
  { id: "14", name: "Vintage Vibe Pullover", category: "Men, Knitwear", price: 69, art: { kind: "sweater", color: "#8a6a4f", accent: "#2f5d62", pattern: "stripes" } },
  { id: "15", name: "Essential Cotton Long Sleeve", category: "Women, Tops", price: 45, art: { kind: "longsleeve", color: "#f3f1ec", accent: "#e2ded5", pattern: "solid" } },
  { id: "16", name: "Sporty Performance Jacket", category: "Men, Jackets", price: 99, art: { kind: "jacket", color: "#151a24", accent: "#1f6fe0", pattern: "colorblock" } },
  { id: "17", name: "Relaxed Fit Cardigan", category: "Women, Knitwear", price: 79, art: { kind: "cardigan", color: "#d8c1a3", accent: "#c4ab8b", pattern: "knit" } },
  { id: "18", name: "Graphic Print Tank Top", category: "Women, Tops", price: 35, art: { kind: "tank", color: "#f7f5f0", accent: "#2f6fe4", pattern: "graphic" } },
  { id: "19", name: "Urban Style Hoodie", category: "Unisex, Hoodies", price: 85, art: { kind: "hoodie", color: "#1a1a1c", accent: "#2c2c2f", pattern: "solid" } },
  { id: "20", name: "Eco-Friendly Cotton Hoodie", category: "Unisex, Hoodies", price: 85, art: { kind: "hoodie", color: "#1f4fc4", accent: "#2b5fd8", pattern: "solid" } },
  { id: "21", name: "Bold Color Block Sweatshirt", category: "Women, Knitwear", price: 75, art: { kind: "sweater", color: "#d9b48f", accent: "#2f6fe4", pattern: "colorblock" } },
  { id: "22", name: "Casual Crew Neck Tee", category: "Men, T-shirts", price: 30, art: { kind: "tee", color: "#f7f7f5", accent: "#dcdcd8", pattern: "solid" } },
  { id: "23", name: "Chiffon Evening Gown", category: "Women, Dresses", price: 129, art: { kind: "gown", color: "#ecc7b8", accent: "#f6ddd2", pattern: "solid" } },
  { id: "24", name: "Classic Fit Graphic Shirt", category: "Men, T-shirts", price: 28.75, art: { kind: "tee", color: "#efe6d5", accent: "#d1553b", pattern: "graphic" } },
  { id: "25", name: "Relaxed Short Sleeve Top", category: "Women, T-shirts", price: 32.5, art: { kind: "tee", color: "#dcc6a8", accent: "#cdb595", pattern: "solid" } },
  { id: "26", name: "Everyday Comfort T-Shirt", category: "Men, T-shirts", price: 27, art: { kind: "tee", color: "#7b7c7e", accent: "#6b6c6e", pattern: "solid" } },
  { id: "27", name: "Stylish V-Neck Tee", category: "Men, T-shirts", price: 29.99, art: { kind: "tee", color: "#232325", accent: "#3a3a3d", pattern: "solid" } },
  { id: "28", name: "Men White T-shirt", category: "Men, T-shirts", price: 24, art: { kind: "tee", color: "#fbfbfa", accent: "#e3e3e0", pattern: "solid" } },
]

const backdrops = ["#efe7de", "#eae3da", "#f1ebe4", "#e8e1d8", "#ece5dc"]

export const products: Product[] = productSeeds.map((seed, index) => {
  const rand = mulberry32(index + 11)
  const trend = Array.from({ length: 14 }, (_, i) =>
    Math.round(40 + Math.sin(i / 1.6 + index) * 14 + rand() * 18 + i * 1.5)
  )
  return {
    ...seed,
    image: `/products/product-${seed.id}.webp`,
    art: { backdrop: backdrops[index % backdrops.length], ...seed.art },
    wholesale: Math.round(seed.price * 0.55 * 100) / 100,
    sku: String(3479812 + index * 13),
    rating: Math.round((3.8 + rand() * 1.1) * 10) / 10,
    reviews: Math.round(80 + rand() * 260),
    sales: Math.round(120 + rand() * 480),
    stock: Math.round(20 + rand() * 280),
    trend,
    tags: seed.category.split(", "),
    discount: index % 4 === 2 ? 20 : index % 7 === 5 ? 15 : 0,
  }
})

export function getProduct(id: string) {
  return products.find((product) => product.id === id)
}

export const productCategories = [
  "T-shirts",
  "Shirts",
  "Tops",
  "Knitwear",
  "Hoodies",
  "Jackets",
  "Dresses",
  "Skirts",
  "Shoes",
] as const

/* -------------------------------------------------------------------------- */
/* Sales                                                                       */
/* -------------------------------------------------------------------------- */

export type SaleStatus = "completed" | "pending" | "canceled"

export type Sale = {
  id: number
  productId: string
  date: string
  quantity: number
  size: "XS" | "S" | "M" | "L" | "XL"
  color: string
  fit: string
  price: number
  taxes: number
  shipping: number
  total: number
  profit: number
  status: SaleStatus
  paymentStatus: "Paid" | "Awaiting payment" | "Refunded"
  paymentMethod: "Credit card" | "PayPal" | "Apple Pay" | "Bank transfer"
  customer: {
    name: string
    email: string
    phone: string
    address: string
    type: "New" | "Returning" | "VIP"
    note: string
  }
  country: { name: string; code: string }
}

const customers = [
  { name: "Olena Kovalenko", city: "Khreshchatyk St 22, Kyiv", country: { name: "Ukraine", code: "804" } },
  { name: "Lukas Schneider", city: "Torstraße 109, Berlin", country: { name: "Germany", code: "276" } },
  { name: "Camille Laurent", city: "12 Rue Oberkampf, Paris", country: { name: "France", code: "250" } },
  { name: "Giulia Romano", city: "Via Tortona 31, Milan", country: { name: "Italy", code: "380" } },
  { name: "Sofia Martín", city: "Calle de Fuencarral 45, Madrid", country: { name: "Spain", code: "724" } },
  { name: "Jan Nowak", city: "ul. Mokotowska 17, Warsaw", country: { name: "Poland", code: "616" } },
  { name: "Emma de Vries", city: "Haarlemmerstraat 88, Amsterdam", country: { name: "Netherlands", code: "528" } },
  { name: "Ana Ionescu", city: "Strada Lipscani 6, Bucharest", country: { name: "Romania", code: "642" } },
  { name: "Elif Yılmaz", city: "İstiklal Cd. 140, Istanbul", country: { name: "Turkey", code: "792" } },
  { name: "Oliver Hughes", city: "48 Redchurch St, London", country: { name: "United Kingdom", code: "826" } },
]

const colors = ["Brown", "Black", "White", "Navy", "Beige", "Olive"]
const sizes: Sale["size"][] = ["XS", "S", "M", "L", "XL"]
const methods: Sale["paymentMethod"][] = ["Credit card", "PayPal", "Apple Pay", "Bank transfer"]
const notes = [
  "Leave the parcel with the concierge.",
  "Gift wrap, please — it's a birthday present.",
  "Call before delivery.",
  "No notes.",
]

function buildSales(): Sale[] {
  const rand = mulberry32(968)
  // Newest sale lands on Dec 12 so #968 falls on Dec 2, between its neighbours.
  const start = new Date(Date.UTC(2025, 11, 12, 23))
  return Array.from({ length: 96 }, (_, index) => {
    const id = 996 - index
    const product = products[Math.floor(rand() * products.length)]
    const customer = customers[Math.floor(rand() * customers.length)]
    const quantity = rand() > 0.8 ? 2 : 1
    const price = product.price * quantity
    const taxes = Math.round(price * 0.2 * 100) / 100
    const shipping = price > 50 ? 0 : 4.9
    const roll = rand()
    const status: SaleStatus = roll > 0.9 ? "canceled" : roll > 0.72 ? "pending" : "completed"
    const date = new Date(start)
    date.setUTCHours(date.getUTCHours() - index * 9 - Math.floor(rand() * 6))
    return {
      id,
      productId: product.id,
      date: date.toISOString(),
      quantity,
      size: sizes[Math.floor(rand() * sizes.length)],
      color: colors[Math.floor(rand() * colors.length)],
      fit: rand() > 0.5 ? "Regular" : "Oversized",
      price,
      taxes,
      shipping,
      total: Math.round((price + taxes + shipping) * 100) / 100,
      profit: Math.round((product.price - product.price * 0.55) * quantity * 100) / 100,
      status,
      paymentStatus: status === "canceled" ? "Refunded" : status === "pending" ? "Awaiting payment" : "Paid",
      paymentMethod: methods[Math.floor(rand() * methods.length)],
      customer: {
        name: customer.name,
        email: `${customer.name.split(" ")[0].toLowerCase()}@example.com`,
        phone: `+${380 + Math.floor(rand() * 40)} ${Math.floor(10 + rand() * 89)} ${Math.floor(100 + rand() * 899)} ${Math.floor(1000 + rand() * 8999)}`,
        address: customer.city,
        type: rand() > 0.7 ? "VIP" : rand() > 0.4 ? "Returning" : "New",
        note: notes[Math.floor(rand() * notes.length)],
      },
      country: customer.country,
    }
  })
}

export const sales: Sale[] = buildSales().map((sale) =>
  sale.id === 968
    ? {
        ...sale,
        productId: "14",
        quantity: 1,
        size: "XL",
        color: "Brown",
        fit: "Oversized",
        price: 19.9,
        taxes: 5,
        shipping: 0,
        total: 24.9,
        profit: 8.95,
        status: "completed",
        paymentStatus: "Paid",
        paymentMethod: "Credit card",
        date: "2025-12-02T11:00:00.000Z",
        customer: {
          name: "Olena Kovalenko",
          email: "olena@example.com",
          phone: "+380 44 278 4512",
          address: "Khreshchatyk St 22, Kyiv",
          type: "Returning",
          note: "Leave the parcel with the concierge.",
        },
        country: { name: "Ukraine", code: "804" },
      }
    : sale
)

export function getSale(id: number) {
  return sales.find((sale) => sale.id === id)
}

/* -------------------------------------------------------------------------- */
/* People                                                                      */
/* -------------------------------------------------------------------------- */

export const currentUser = {
  name: "Natasha Romanova",
  email: "natasha@example.com",
  role: "Store owner",
  avatarSeed: "Natasha",
  avatarColor: "#3d7bff",
}

/* -------------------------------------------------------------------------- */
/* Inbox                                                                       */
/* -------------------------------------------------------------------------- */

export type ChatMessage = {
  id: string
  from: "me" | "them"
  text: string
  minutesAgo: number
}

export type Conversation = {
  id: string
  name: string
  avatarColor: string
  online: boolean
  unread: number
  preview: string
  minutesAgo: number
  messages: ChatMessage[]
}

export const conversations: Conversation[] = [
  {
    id: "daniella",
    name: "Daniella",
    avatarColor: "#3fd277",
    online: true,
    unread: 3,
    preview: "Can I swap the size on order #961?",
    minutesAgo: 2,
    messages: [
      { id: "1", from: "them", text: "Hi! I just ordered the Floral Print Blouse.", minutesAgo: 9 },
      { id: "2", from: "them", text: "I picked an M but I think I need an S.", minutesAgo: 8 },
      { id: "3", from: "them", text: "Can I swap the size on order #961?", minutesAgo: 2 },
    ],
  },
  {
    id: "bradley",
    name: "Bradley",
    avatarColor: "#ffd23f",
    online: true,
    unread: 2,
    preview: "Perfect, thanks for the quick reply!",
    minutesAgo: 2,
    messages: [
      { id: "1", from: "them", text: "Hey, is the Urban Style Hoodie restocking soon?", minutesAgo: 14 },
      { id: "2", from: "me", text: "Hi Bradley! Yes — next Tuesday.", minutesAgo: 12 },
      { id: "3", from: "them", text: "Great. Will it come in charcoal too?", minutesAgo: 10 },
      { id: "4", from: "me", text: "Charcoal and black, sizes XS to XXL.", minutesAgo: 8 },
      { id: "5", from: "them", text: "Can you hold an L in charcoal for me? I'll order the moment it's live.", minutesAgo: 6 },
      { id: "6", from: "me", text: "Done — I've reserved one for 48 hours after launch. You'll get an email with a direct link.", minutesAgo: 4 },
      { id: "7", from: "them", text: "Perfect, thanks for the quick reply! I'll keep an eye on my inbox.", minutesAgo: 2 },
    ],
  },
  {
    id: "sarah",
    name: "Sarah",
    avatarColor: "#5b7cff",
    online: true,
    unread: 2,
    preview: "The gown arrived and it's stunning.",
    minutesAgo: 2,
    messages: [
      { id: "1", from: "them", text: "The gown arrived and it's stunning.", minutesAgo: 3 },
      { id: "2", from: "them", text: "Do you ship to Canada as well?", minutesAgo: 2 },
    ],
  },
  {
    id: "tiffany",
    name: "Tiffany",
    avatarColor: "#9b7bff",
    online: false,
    unread: 0,
    preview: "Understood, new messages are here for you!",
    minutesAgo: 2,
    messages: [{ id: "1", from: "them", text: "Understood, new messages are here for you!", minutesAgo: 2 }],
  },
  {
    id: "christopher",
    name: "Christopher",
    avatarColor: "#ff7ac6",
    online: true,
    unread: 0,
    preview: "Got it, I'll check out your new messages!",
    minutesAgo: 2,
    messages: [{ id: "1", from: "them", text: "Got it, I'll check out your new messages!", minutesAgo: 2 }],
  },
  {
    id: "damian",
    name: "Damian",
    avatarColor: "#7c6bff",
    online: true,
    unread: 0,
    preview: "Alright, I see you've got new messages waiting!",
    minutesAgo: 2,
    messages: [{ id: "1", from: "them", text: "Alright, I see you've got new messages waiting!", minutesAgo: 2 }],
  },
  {
    id: "rosalinda",
    name: "Rosalinda",
    avatarColor: "#ffb020",
    online: false,
    unread: 0,
    preview: "I noticed there are new messages for you to read!",
    minutesAgo: 2,
    messages: [{ id: "1", from: "them", text: "I noticed there are new messages for you to read!", minutesAgo: 2 }],
  },
  {
    id: "brielle",
    name: "Brielle",
    avatarColor: "#3d7bff",
    online: true,
    unread: 0,
    preview: "I see you have new messages to explore!",
    minutesAgo: 2,
    messages: [{ id: "1", from: "them", text: "I see you have new messages to explore!", minutesAgo: 2 }],
  },
  {
    id: "chanel",
    name: "Chanel",
    avatarColor: "#3fd2a0",
    online: true,
    unread: 0,
    preview: "Okay, I won't miss your new messages!",
    minutesAgo: 3,
    messages: [{ id: "1", from: "them", text: "Okay, I won't miss your new messages!", minutesAgo: 3 }],
  },
  {
    id: "marcus",
    name: "Marcus",
    avatarColor: "#ff6b5a",
    online: false,
    unread: 0,
    preview: "Thanks, the refund came through.",
    minutesAgo: 12,
    messages: [{ id: "1", from: "them", text: "Thanks, the refund came through.", minutesAgo: 12 }],
  },
]

export const unreadCount = conversations.filter((c) => c.unread > 0).length

/* -------------------------------------------------------------------------- */
/* Extensions                                                                  */
/* -------------------------------------------------------------------------- */

export type Extension = {
  id: string
  name: string
  description: string
  version: string
  logo: "mailchimp" | "woo" | "shopify" | "bigcommerce" | "magento" | "squarespace" | "generic"
  installed: boolean
  updateAvailable: boolean
  installs: number
  rating: number
}

export const extensions: Extension[] = [
  { id: "mailchimp", name: "Mailchimp", description: "Sync customers and send automated email campaigns", version: "3.0.6", logo: "mailchimp", installed: true, updateAvailable: false, installs: 182000, rating: 4.6 },
  { id: "woocommerce", name: "WooCommerce", description: "Import products and orders from a WordPress store", version: "3.0.6", logo: "woo", installed: true, updateAvailable: true, installs: 241000, rating: 4.4 },
  { id: "shopify", name: "Shopify", description: "Two-way inventory sync with your Shopify catalog", version: "3.0.6", logo: "shopify", installed: true, updateAvailable: false, installs: 312000, rating: 4.8 },
  { id: "bigcommerce", name: "BigCommerce", description: "Mirror listings and fulfilment status in real time", version: "3.0.6", logo: "bigcommerce", installed: true, updateAvailable: false, installs: 64000, rating: 4.2 },
  { id: "magento", name: "Magento", description: "Connect Adobe Commerce storefronts and price rules", version: "3.0.6", logo: "magento", installed: true, updateAvailable: true, installs: 51000, rating: 4.1 },
  { id: "squarespace", name: "Squarespace", description: "Embed products and checkout on Squarespace pages", version: "3.0.6", logo: "squarespace", installed: true, updateAvailable: false, installs: 88000, rating: 4.5 },
  { id: "reviews", name: "Review Booster", description: "Collect photo reviews after every delivery", version: "2.4.1", logo: "generic", installed: false, updateAvailable: false, installs: 97000, rating: 4.7 },
  { id: "currency", name: "Multi-currency", description: "Show local prices in 130+ currencies", version: "1.9.0", logo: "generic", installed: false, updateAvailable: false, installs: 143000, rating: 4.3 },
  { id: "gift-cards", name: "Gift Cards", description: "Sell digital gift cards with custom designs", version: "1.2.3", logo: "generic", installed: false, updateAvailable: false, installs: 39000, rating: 4.0 },
  { id: "abandoned", name: "Cart Recovery", description: "Win back abandoned carts with timed reminders", version: "2.0.0", logo: "generic", installed: false, updateAvailable: false, installs: 205000, rating: 4.6 },
  { id: "seo", name: "SEO Toolkit", description: "Meta tags, sitemaps and rich product snippets", version: "4.1.2", logo: "generic", installed: false, updateAvailable: false, installs: 176000, rating: 4.5 },
  { id: "loyalty", name: "Loyalty Points", description: "Reward repeat customers with points and tiers", version: "1.6.4", logo: "generic", installed: false, updateAvailable: false, installs: 72000, rating: 4.4 },
]

/* -------------------------------------------------------------------------- */
/* Payouts                                                                     */
/* -------------------------------------------------------------------------- */

export type Payout = {
  id: string
  month: string
  date: string
  amount: number
  method: "PayPal" | "Bank transfer" | "Credit card" | "Crypto wallet"
  status: "completed" | "pending"
}

export const payouts: Payout[] = (() => {
  const rand = mulberry32(2025)
  return Array.from({ length: 24 }, (_, index) => {
    const date = new Date(Date.UTC(2025, 9 - index, 1))
    const paidOn = new Date(Date.UTC(2025, 10 - index, 5))
    return {
      id: `PO-${2510 - index}`,
      month: date.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" }),
      date: paidOn.toISOString(),
      amount: Math.round((1400 + rand() * 900) * 100) / 100,
      method: index > 14 ? "Bank transfer" : "PayPal",
      status: index === 0 ? "pending" : "completed",
    }
  })
})()

/* -------------------------------------------------------------------------- */
/* Help center                                                                 */
/* -------------------------------------------------------------------------- */

export const helpTopics = [
  { id: "get-started", title: "Get started", description: "Set up your store, add your first product and take your first order.", icon: "lightbulb" },
  { id: "billing", title: "Account & Billing", description: "Manage your plan, invoices, payment methods and team seats.", icon: "receipt" },
  { id: "store", title: "Store Setup", description: "Domains, themes, taxes and shipping zones for your storefront.", icon: "store" },
  { id: "orders", title: "Orders & Fulfillment", description: "Process orders, print labels and handle returns and refunds.", icon: "cart" },
  { id: "crm", title: "Customers & CRM", description: "Segment customers, track lifetime value and run follow-ups.", icon: "briefcase" },
  { id: "analytics", title: "Analytics & Reports", description: "Understand earnings, traffic sources and conversion funnels.", icon: "chart" },
  { id: "integrations", title: "Integrations & Plugins", description: "Connect Shopify, Mailchimp and 40+ tools to your workflow.", icon: "puzzle" },
  { id: "troubleshooting", title: "Troubleshooting", description: "Fix sync errors, payment declines and checkout issues fast.", icon: "question" },
  { id: "contact", title: "Contact Support", description: "Talk to a human — we reply in under two hours, 7 days a week.", icon: "mail" },
] as const
