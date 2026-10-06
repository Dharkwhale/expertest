// Which state a data-driven section renders. V1 reads synchronous mock data, so the
// non-ready states can only be reached on purpose: append ?state=loading|error|empty
// to any M2 route to review them (decision logged in progress.md, 2026-09-21).
export type ViewState = "ready" | "loading" | "error" | "empty";

const FORCEABLE: readonly ViewState[] = ["loading", "error", "empty"];

type SearchParams = Record<string, string | string[] | undefined>;

/**
 * GAP-008: the `?state=` switch is a review affordance, not product behaviour, so it is
 * ignored in production builds. A function rather than a constant so tests can flip the
 * environment; Next inlines `process.env.NODE_ENV`, so the check costs nothing at runtime.
 */
export function reviewSwitchEnabled(): boolean {
  return process.env.NODE_ENV !== "production";
}

function firstValue(searchParams: SearchParams): string | undefined {
  const raw = searchParams.state;
  return Array.isArray(raw) ? raw[0] : raw;
}

/** Allow-listed: anything other than the three review values renders "ready". */
export function readViewState(searchParams: SearchParams): ViewState {
  if (!reviewSwitchEnabled()) return "ready";
  const value = firstValue(searchParams);
  return FORCEABLE.find((state) => state === value) ?? "ready";
}

/** `?state=declined` on the pay steps (decision D3). Same gate as the states above. */
export function readDeclineSwitch(searchParams: SearchParams): boolean {
  return reviewSwitchEnabled() && firstValue(searchParams) === "declined";
}
