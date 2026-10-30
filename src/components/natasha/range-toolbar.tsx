"use client"

import { PageToolbar } from "@/components/natasha/page"
import { TabBar } from "@/components/natasha/tab-bar"
import { DateRangePicker, useRangeState } from "@/components/natasha/date-range-picker"

/** "Last 24 hours · Last week · …" tabs plus the date-range filter. */
export function RangeToolbar() {
  const state = useRangeState("week")
  return (
    <PageToolbar>
      <TabBar label="Time range" items={state.tabs} value={state.tab} onValueChange={state.selectTab} />
      <DateRangePicker value={state.custom} onApply={state.applyCustom} />
    </PageToolbar>
  )
}
