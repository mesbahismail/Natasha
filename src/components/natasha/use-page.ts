"use client"

import * as React from "react"

/**
 * Current page for a paginated view. Returns to page 1 whenever `resetKey`
 * changes (a new sort, tab or filter).
 */
export function usePage(resetKey: unknown) {
  const [state, setState] = React.useState({ page: 1, key: resetKey })
  // Reset during render instead of in an effect, so there is no stale frame.
  if (state.key !== resetKey) setState({ page: 1, key: resetKey })
  const setPage = React.useCallback((page: number) => setState((s) => ({ ...s, page })), [])
  return [state.key === resetKey ? state.page : 1, setPage] as const
}
