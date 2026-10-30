"use client"

import * as React from "react"
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns"
import { CalendarDays, Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type DateRange = { from: Date; to: Date }

const presets = [
  { id: "today", label: "Today", range: (t: Date) => ({ from: t, to: t }) },
  { id: "yesterday", label: "Yesterday", range: (t: Date) => ({ from: subDays(t, 1), to: subDays(t, 1) }) },
  { id: "7d", label: "Last 7 days", range: (t: Date) => ({ from: subDays(t, 7), to: t }) },
  { id: "30d", label: "Last 30 days", range: (t: Date) => ({ from: subDays(t, 30), to: t }) },
  { id: "90d", label: "Last 90 days", range: (t: Date) => ({ from: subDays(t, 90), to: t }) },
  { id: "12m", label: "Last 12 months", range: (t: Date) => ({ from: subMonths(t, 12), to: t }) },
] as const

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"]
const MONTHS_BACK = 12
const MONTHS_AHEAD = 1

export function formatRange(range: DateRange) {
  if (isSameDay(range.from, range.to)) return format(range.from, "MMM d, yyyy")
  const sameYear = range.from.getFullYear() === range.to.getFullYear()
  return `${format(range.from, sameYear ? "MMM d" : "MMM d, yyyy")} – ${format(range.to, "MMM d, yyyy")}`
}

export function DateRangePicker({
  value,
  onApply,
  className,
}: {
  value: DateRange | null
  onApply: (range: DateRange) => void
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const today = React.useMemo(() => startOfDay(new Date()), [])
  const initial = value ?? presets[2].range(today)

  const [from, setFrom] = React.useState<Date>(initial.from)
  const [to, setTo] = React.useState<Date | null>(initial.to)
  const [hover, setHover] = React.useState<Date | null>(null)
  const [preset, setPreset] = React.useState<string | null>(value ? null : "7d")
  const scrollRef = React.useRef<HTMLDivElement>(null)

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) return
    // Every time the picker opens, start the draft from the applied range.
    const range = value ?? presets[2].range(today)
    setFrom(range.from)
    setTo(range.to)
    setHover(null)
    // Bring the selected month into view once the popover has rendered.
    requestAnimationFrame(() => {
      const el = scrollRef.current?.querySelector<HTMLElement>(`[data-month="${format(range.from, "yyyy-MM")}"]`)
      if (el && scrollRef.current) scrollRef.current.scrollTop = el.offsetTop - 8
    })
  }

  const months = React.useMemo(
    () =>
      Array.from({ length: MONTHS_BACK + MONTHS_AHEAD + 1 }, (_, i) =>
        startOfMonth(addMonths(today, i - MONTHS_BACK))
      ),
    [today]
  )

  function selectDay(day: Date) {
    setPreset(null)
    if (to || isBefore(day, from)) {
      setFrom(day)
      setTo(null)
      return
    }
    setTo(day)
  }

  const end = to ?? (hover && !isBefore(hover, from) ? hover : null)
  const draft: DateRange | null = end ? { from, to: end } : null

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="lg" className={cn("gap-3", className)}>
          <CalendarDays />
          <span className="text-foreground">{value ? formatRange(value) : "Filter by date"}</span>
          <ChevronDown className="size-4 transition-transform in-aria-expanded:rotate-180" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={12}
        collisionPadding={16}
        className="relative w-[min(680px,calc(100vw-32px))] gap-0 overflow-hidden rounded-3xl bg-popover/85 p-0 backdrop-blur-2xl"
      >
        {/* Ambient glow */}
        <span aria-hidden className="pointer-events-none absolute -top-16 left-24 size-64 rounded-full bg-chart-2/12 blur-3xl" />
        <span aria-hidden className="pointer-events-none absolute right-8 bottom-24 size-72 rounded-full bg-chart-4/14 blur-3xl" />
        <span aria-hidden className="pointer-events-none absolute bottom-0 -left-10 size-56 rounded-full bg-chart-1/8 blur-3xl" />

        <div className="relative border-b border-border px-6 py-6">
          <p className="type-title-lg">Pick a Date</p>
          <div className="mt-6 grid grid-cols-2">
            <div className="pr-6">
              <p className="type-overline text-muted-foreground">From</p>
              <p className="mt-2 type-title-lg tabular-nums">{format(from, "MMM d, yyyy")}</p>
            </div>
            <div className="border-l border-border pl-6">
              <p className="type-overline text-muted-foreground">To</p>
              <p className={cn("mt-2 type-title-lg tabular-nums", !end && "text-subtle-foreground")}>
                {end ? format(end, "MMM d, yyyy") : "Select end"}
              </p>
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-[208px_1fr]">
          <div className="flex gap-1 overflow-x-auto border-b border-border p-4 sm:flex-col sm:border-r sm:border-b-0 sm:p-4 sm:pt-6">
            {presets.map((item) => {
              const active = preset === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    const range = item.range(today)
                    setPreset(item.id)
                    setFrom(range.from)
                    setTo(range.to)
                    const el = scrollRef.current?.querySelector<HTMLElement>(`[data-month="${format(range.from, "yyyy-MM")}"]`)
                    el?.scrollIntoView({ block: "start", behavior: "smooth" })
                  }}
                  className={cn(
                    "h-11 shrink-0 rounded-lg border px-4 text-left type-body-lg whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                    active
                      ? "border-primary-border bg-primary text-primary-foreground"
                      : "border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          <div
            ref={scrollRef}
            className="no-scrollbar relative h-[440px] overflow-y-auto scroll-fade-y px-4 pb-24 sm:px-6"
            onMouseLeave={() => setHover(null)}
          >
            {months.map((month) => (
              <Month
                key={month.toISOString()}
                month={month}
                range={draft}
                anchor={from}
                onSelect={selectDay}
                onHover={setHover}
              />
            ))}
          </div>

          <Button
            size="xl"
            disabled={!to}
            className="absolute right-6 bottom-6 shadow-xl shadow-black/40"
            onClick={() => {
              if (!to) return
              onApply({ from, to })
              setOpen(false)
            }}
          >
            <Check /> Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function Month({
  month,
  range,
  anchor,
  onSelect,
  onHover,
}: {
  month: Date
  range: DateRange | null
  anchor: Date
  onSelect: (day: Date) => void
  onHover: (day: Date | null) => void
}) {
  const days = eachDayOfInterval({
    start: startOfWeek(month, { weekStartsOn: 1 }),
    end: endOfMonth(month),
  })

  return (
    <section data-month={format(month, "yyyy-MM")} aria-label={format(month, "MMMM yyyy")} className="pt-6">
      <h3 className="text-center type-headline">
        {format(month, "MMMM")}
        {month.getFullYear() !== new Date().getFullYear() && (
          <span className="ml-2 text-subtle-foreground">{format(month, "yyyy")}</span>
        )}
      </h3>
      <div className="mt-4 grid grid-cols-7 border-b border-border pb-3">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="text-center type-body text-muted-foreground">
            {d}
          </span>
        ))}
      </div>
      <div role="grid" className="mt-4 grid grid-cols-7 gap-y-2">
        {days.map((day) => {
          const outside = !isSameMonth(day, month)
          if (outside) {
            return (
              <span key={day.toISOString()} aria-hidden className="grid h-10 place-items-center type-body-lg text-subtle-foreground/70">
                {format(day, "d")}
              </span>
            )
          }
          const isStart = range ? isSameDay(day, range.from) : isSameDay(day, anchor)
          const isEnd = range ? isSameDay(day, range.to) : false
          const inRange = range ? isWithinInterval(day, { start: range.from, end: range.to }) : false
          const middle = inRange && !isStart && !isEnd
          const weekday = (day.getDay() + 6) % 7
          const rowStart = weekday === 0 || day.getDate() === 1
          const rowEnd = weekday === 6 || isSameDay(day, endOfMonth(day))
          const bandLeft = inRange && !isStart
          const bandRight = inRange && !isEnd && range && isAfter(range.to, day)

          return (
            <div key={day.toISOString()} className="relative h-10">
              {/* Continuous range band */}
              {(bandLeft || bandRight) && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-y-0 bg-primary-soft",
                    bandLeft ? "left-0" : "left-1/2",
                    bandRight ? "right-0" : "right-1/2",
                    rowStart && bandLeft && "rounded-l-lg",
                    rowEnd && bandRight && "rounded-r-lg"
                  )}
                />
              )}
              <button
                type="button"
                onClick={() => onSelect(day)}
                onMouseEnter={() => onHover(day)}
                onFocus={() => onHover(day)}
                aria-pressed={isStart || isEnd || middle}
                aria-label={format(day, "EEEE, MMMM d, yyyy")}
                className={cn(
                  "relative mx-auto grid h-10 w-full max-w-12 place-items-center rounded-lg type-body-lg font-semibold tabular-nums transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  isStart || isEnd
                    ? "border border-primary-border bg-primary text-primary-foreground"
                    : middle
                      ? "text-foreground"
                      : "text-foreground hover:bg-secondary",
                  isToday(day) && !isStart && !isEnd && "underline decoration-primary decoration-2 underline-offset-6"
                )}
              >
                {format(day, "d")}
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* Toolbar: preset tabs + date filter sharing one state ------------------------ */

const rangeTabs = [
  { value: "24h", label: "Last 24 hours", days: 1 },
  { value: "week", label: "Last week", days: 7 },
  { value: "month", label: "Last month", days: 30 },
  { value: "year", label: "Last year", days: 365 },
] as const

export type RangeTab = (typeof rangeTabs)[number]["value"]

export function useRangeState(initial: RangeTab = "week") {
  const [tab, setTab] = React.useState<RangeTab | null>(initial)
  const [custom, setCustom] = React.useState<DateRange | null>(null)
  const range = React.useMemo<DateRange>(() => {
    if (custom) return custom
    const today = startOfDay(new Date())
    const days = rangeTabs.find((t) => t.value === tab)?.days ?? 7
    return { from: addDays(today, -days), to: today }
  }, [custom, tab])
  return {
    tab,
    custom,
    range,
    tabs: rangeTabs.map(({ value, label }) => ({ value, label })),
    selectTab: (value: RangeTab) => {
      setTab(value)
      setCustom(null)
    },
    applyCustom: (value: DateRange) => {
      setCustom(value)
      setTab(null)
    },
  }
}
