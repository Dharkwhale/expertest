// Which state a data-driven section renders. V1 reads synchronous mock data, so the
// non-ready states can only be reached on purpose: append ?state=loading|error|empty
// to any M2 route to review them (decision logged in progress.md, 2026-09-21).
export type ViewState = "ready" | "loading" | "error" | "empty";

const FORCEABLE: readonly ViewState[] = ["loading", "error", "empty"];

type SearchParams = Record<string, string | string[] | undefined>;

/** Allow-listed: anything other than the three review values renders "ready". */
export function readViewState(searchParams: SearchParams): ViewState {
  const raw = searchParams.state;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return FORCEABLE.find((state) => state === value) ?? "ready";
}
