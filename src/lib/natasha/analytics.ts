/** Chart series for the dashboard and insights pages. */

/** Attach the display label each point shows in its value pill. */
function withLabels<T extends { value: number }>(format: (value: number) => string, points: T[]) {
  return points.map((point) => ({ ...point, label: format(point.value) }))
}

export const months6 = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"] as const
export const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const

/* Dashboard --------------------------------------------------------------- */

export const earningsSummary = {
  total: 12346.6,
  net: 9536.7,
}

export const earningsByMonth = [
  { month: "Oct", earnings: 78, profit: 62 },
  { month: "Nov", earnings: 100, profit: 84 },
  { month: "Dec", earnings: 78, profit: 60 },
  { month: "Jan", earnings: 94, profit: 72 },
  { month: "Feb", earnings: 100, profit: 84 },
  { month: "Mar", earnings: 82, profit: 64 },
]

export const conversionSummary = { rate: 1.32, delta: 0.23 }

export const conversionTrend = withLabels((v) => `${(v * 0.0342).toFixed(2)}%`, [
  { x: 0, value: 44 },
  { x: 1, value: 46 },
  { x: 2, value: 40 },
  { x: 3, value: 52 },
  { x: 4, value: 58 },
  { x: 5, value: 49 },
  { x: 6, value: 40 },
  { x: 7, value: 41 },
  { x: 8, value: 36 },
  { x: 9, value: 40 },
  { x: 10, value: 50 },
  { x: 11, value: 54 },
  { x: 12, value: 57 },
  { x: 13, value: 56 },
  { x: 14, value: 62 },
  { x: 15, value: 52 },
  { x: 16, value: 66 },
  { x: 17, value: 52 },
])

export const trafficSummary = { visits: 14200, target: 20000 }

/** Ordered clockwise from 12 o'clock. */
export const topCategories = [
  { name: "Scarves", value: 16, fill: "var(--chart-4)" },
  { name: "Men shoes", value: 18, fill: "var(--chart-3)" },
  { name: "Wearables", value: 32, fill: "var(--chart-2)" },
  { name: "Cases", value: 34, fill: "var(--chart-1)" },
]

/* Product detail ----------------------------------------------------------- */

/** Headline numbers for a product, derived from its catalogue record. */
export function productStats(product: { price: number; wholesale: number; sales: number; stock: number; trend: number[] }) {
  const first = product.trend[0]
  const last = product.trend[product.trend.length - 1]
  const momentum = Math.round(((last - first) / first) * 100)
  return {
    totalSales: product.sales * 2 + 11,
    profit: Math.round(product.sales * 2 * (product.price - product.wholesale)),
    profitDelta: momentum,
    inStock: product.stock,
    earnings: Math.round(product.sales * 2 * product.price),
    earningsDelta: Math.round((momentum / 7 - 6) * 10) / 10,
    conversion: Math.round((1 + (product.sales % 97) / 100) * 100) / 100,
    conversionDelta: Math.round(momentum * 2.2),
    orders: Math.round(product.sales * 3.2),
  }
}

export const productSalesByMonth = [
  { month: "Oct", sales: 62 },
  { month: "Nov", sales: 90 },
  { month: "Dec", sales: 43 },
  { month: "Jan", sales: 75 },
  { month: "Feb", sales: 90 },
  { month: "Mar", sales: 67 },
]

export const productEarningsTrend = withLabels((v) => `$${(v * 0.036).toFixed(1)}k`, [
  { x: 0, month: "", value: 50 },
  { x: 1, month: "Oct", value: 53 },
  { x: 2, month: "", value: 66 },
  { x: 3, month: "", value: 59 },
  { x: 4, month: "", value: 60 },
  { x: 5, month: "Nov", value: 56 },
  { x: 6, month: "", value: 56 },
  { x: 7, month: "", value: 54 },
  { x: 8, month: "Dec", value: 51 },
  { x: 9, month: "", value: 38 },
  { x: 10, month: "", value: 36 },
  { x: 11, month: "", value: 36 },
  { x: 12, month: "Jan", value: 38 },
  { x: 13, month: "", value: 37 },
  { x: 14, month: "", value: 46 },
  { x: 15, month: "Feb", value: 55 },
  { x: 16, month: "", value: 60 },
  { x: 17, month: "", value: 55 },
  { x: 18, month: "", value: 46 },
  { x: 19, month: "Mar", value: 48 },
  { x: 20, month: "", value: 47 },
])

/* Earnings ----------------------------------------------------------------- */

export const performance = {
  totalSales: 1223,
  totalProfit: 13400,
  profitDelta: 25,
  conversion: 1.78,
  conversionDelta: 55,
  totalOrders: 1959,
  inStock: 203,
  earnings: 35600,
  earningsDelta: -3.5,
}

export const categoryRadar = [
  { category: "Suits", value: 92 },
  { category: "Glasses", value: 88 },
  { category: "Socks", value: 84 },
  { category: "Footwear", value: 90 },
  { category: "Pants", value: 86 },
  { category: "T-shirts", value: 90 },
]

export const topProducts = [
  { productId: "9", name: "Floral Maxi Dress", sales: 224, share: 66 },
  { productId: "10", name: "Denim Jacket", sales: 196, share: 82 },
  { productId: "7", name: "Chic Off-Shoulder Blouse", sales: 171, share: 74 },
]

export const retention = {
  rate: 25.4,
  delta: 25,
  visits: 4700,
  series: [
    { x: 0, value: 18 },
    { x: 1, value: 28 },
    { x: 2, value: 62 },
    { x: 3, value: 36 },
    { x: 4, value: 26 },
    { x: 5, value: 36 },
    { x: 6, value: 22 },
    { x: 7, value: 72 },
    { x: 8, value: 84 },
    { x: 9, value: 46 },
    { x: 10, value: 36 },
    { x: 11, value: 62 },
    { x: 12, value: 68 },
  ],
}

export const growth = {
  rate: 4.28,
  delta: 25,
  series: [
    { month: "Mar", value: 24 },
    { month: "Apr", value: 36 },
    { month: "May", value: 66 },
    { month: "Jun", value: 84 },
    { month: "Jul", value: 72 },
    { month: "Aug", value: 48 },
    { month: "Sep", value: 62 },
  ],
}

/* Traffic ------------------------------------------------------------------ */

export const trafficKpis = [
  { label: "New visitors", value: "341.5k", delta: -5 },
  { label: "Returning visitors", value: "185.4k", delta: 75 },
  { label: "Customers", value: "56.2k", delta: 25 },
  { label: "Abandoned carts", value: "2.9k", delta: 125, inverse: true },
]

export const trafficBySource = [
  { day: "Mon", search: 60, display: 84, video: 70 },
  { day: "Tue", search: 48, display: 55, video: 38 },
  { day: "Wed", search: 47, display: 63, video: 56 },
  { day: "Thu", search: 68, display: 73, video: 51 },
  { day: "Fri", search: 58, display: 70, video: 51 },
  { day: "Sat", search: 55, display: 49, video: 38 },
  { day: "Sun", search: 36, display: 38, video: 30 },
]

export const trafficChannels = [
  { name: "Advertising", value: 44, fill: "var(--chart-1)" },
  { name: "Google search", value: 14, fill: "var(--chart-2)" },
  { name: "Social media", value: 14, fill: "var(--chart-3)" },
  { name: "Direct", value: 28, fill: "var(--chart-4)" },
]

export const ageRanges = [
  { range: "13–17", share: 16 },
  { range: "18–24", share: 18 },
  { range: "25–35", share: 24 },
  { range: "36–48", share: 10 },
  { range: "48–65", share: 6 },
  { range: "65+", share: 6 },
]

export const gender = [
  { name: "Men", value: 62.7, fill: "var(--chart-3)" },
  { name: "Women", value: 37.3, fill: "var(--chart-1)" },
]

/* Conversions -------------------------------------------------------------- */

export const conversionRate = {
  rate: 3.28,
  delta: 0.32,
  series: withLabels((v) => `${(v * 0.0186).toFixed(2)}%`, [
    { x: 0, day: "Mon", value: 28 },
    { x: 1, day: "", value: 42 },
    { x: 2, day: "Tue", value: 34 },
    { x: 3, day: "", value: 48 },
    { x: 4, day: "Wed", value: 60 },
    { x: 5, day: "", value: 66 },
    { x: 6, day: "Thu", value: 58 },
    { x: 7, day: "", value: 72 },
    { x: 8, day: "Fri", value: 86 },
    { x: 9, day: "", value: 82 },
    { x: 10, day: "Sat", value: 96 },
  ]),
}

/** Hour × weekday intensity (0–1). Rows are 8am → 10pm. */
export const conversionHeatmap = {
  hours: ["8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"],
  values: [
    [0.05, 0.25, 0.5, 0.5, 0.45, 0.2, 0.1],
    [0.3, 0.35, 0.55, 0.6, 0.6, 0.4, 0.25],
    [0.5, 0.6, 0.85, 0.9, 0.85, 0.6, 0.15],
    [0.45, 0.8, 0.9, 1, 0.95, 0.85, 0.5],
    [0.5, 0.55, 0.85, 0.9, 0.9, 0.6, 0.4],
    [0.35, 0.5, 0.7, 0.95, 0.7, 0.55, 0.45],
    [0.1, 0.35, 0.5, 0.6, 0.45, 0.3, 0.1],
    [0.05, 0.1, 0.3, 0.35, 0.3, 0.15, 0.05],
  ],
}

export const conversionByCategory = [
  { category: "Shoes", rate: 0.48, size: 0.48 },
  { category: "Accessories", rate: 1.08, size: 1.08 },
  { category: "Suits", rate: 0.17, size: 0.17 },
  { category: "T-shirts", rate: 0.87, size: 0.87 },
  { category: "Pants", rate: 0.58, size: 0.58 },
]

/** ISO 3166-1 numeric → conversion tier (3 high … 0 none). */
export const conversionByCountry: Record<string, 0 | 1 | 2 | 3> = {
  "840": 3, "124": 2, "484": 2, "076": 2, "032": 1, "152": 1, "170": 1, "604": 1,
  "826": 3, "276": 3, "250": 3, "380": 2, "724": 2, "620": 2, "528": 3, "056": 2,
  "616": 2, "804": 2, "752": 2, "578": 2, "246": 1, "208": 2, "372": 2, "203": 2,
  "036": 3, "554": 2, "392": 3, "410": 2, "156": 1, "356": 2, "360": 1, "458": 1,
  "702": 3, "764": 1, "704": 1, "608": 1, "784": 2, "682": 1, "376": 2, "792": 1,
  "710": 1, "818": 1, "566": 1, "404": 1, "504": 1, "643": 1, "398": 1, "012": 1,
}

/* Marketing ---------------------------------------------------------------- */

export const leadSources = [
  { day: "Mon", search: 20, display: 32, video: 10 },
  { day: "Tue", search: 30, display: 40, video: 14 },
  { day: "Wed", search: 24, display: 46, video: 10 },
  { day: "Thu", search: 44, display: 34, video: 18 },
  { day: "Fri", search: 52, display: 44, video: 26 },
  { day: "Sat", search: 46, display: 50, video: 22 },
  { day: "Sun", search: 72, display: 60, video: 30 },
  { day: "", search: 66, display: 46, video: 18 },
  { day: "", search: 46, display: 28, video: 20 },
]

export const marketingChannels = [
  { name: "Advertising", value: 72, color: "var(--chart-1)" },
  { name: "Google search", value: 86, color: "var(--chart-2)" },
  { name: "Social media", value: 74, color: "var(--chart-3)" },
  { name: "Direct", value: 96, color: "var(--chart-4)" },
]

export const landingPages = [
  { path: "/home/page", visits: 240, fill: "var(--chart-1)" },
  { path: "/product/page", visits: 170, fill: "var(--chart-2)" },
  { path: "/home/offer", visits: 88, fill: "var(--chart-3)" },
  { path: "/home/food", visits: 200, fill: "var(--chart-4)" },
]

export const funnel = [
  { stage: "Visitors", value: 25900 },
  { stage: "Prospects", value: 12600 },
  { stage: "Leads", value: 4200 },
  { stage: "Customers", value: 280 },
]

/* Payouts ------------------------------------------------------------------ */

export const payoutsThisMonth = {
  total: 1924,
  delta: 5.32,
  series: [28, 42, 70, 95, 84, 54, 66, 70, 42, 46].map((value, i) => ({
    week: `W${i + 1}`,
    value,
  })),
}
