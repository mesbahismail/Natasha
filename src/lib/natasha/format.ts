const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
})

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

const integer = new Intl.NumberFormat("en-US")

export function formatCurrency(value: number) {
  return currency.format(value)
}

/** `+$19.00` style used for sales and profit columns. */
export function formatSignedCurrency(value: number) {
  return `${value < 0 ? "−" : "+"}${currency.format(Math.abs(value))}`
}

export function formatCompactCurrency(value: number) {
  return compactCurrency.format(value).toLowerCase()
}

export function formatCompact(value: number) {
  return compactNumber.format(value).toLowerCase()
}

export function formatNumber(value: number) {
  return integer.format(value)
}

export function formatPercent(value: number, digits = 2) {
  return `${value.toFixed(digits)}%`
}

export function formatDelta(value: number, digits = 2) {
  return `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value).toFixed(digits)}%`
}

/*
 * Dates are formatted in UTC so server and client render the same string
 * regardless of the visitor's time zone (no hydration mismatch).
 */
const shortDate = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
})

const longDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

/** `Sun 25 Jul` */
export function formatShortDate(iso: string) {
  return shortDate.format(new Date(iso)).replace(",", "")
}

/** `Dec 2, 2025` */
export function formatLongDate(iso: string) {
  return longDate.format(new Date(iso))
}

/** `11:00, 12/2/2025` */
export function formatDateTime(iso: string) {
  const date = new Date(iso)
  const time = `${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`
  return `${time}, ${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`
}
