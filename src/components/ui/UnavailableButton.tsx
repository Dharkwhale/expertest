import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export const UNAVAILABLE_NOTE = "not available yet";

// A text control the design shows ("Change", "View map", "Map", "Follow") whose screen
// or feature isn't built (flow.md §3). Styled by the caller exactly as designed; it
// only removes the hover state and tells assistive tech it's unavailable.
export function UnavailableButton({
  children,
  label,
  className,
}: {
  children: ReactNode;
  /** Accessible name when the visible text alone is ambiguous ("Map" → "Venue map") */
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-disabled="true"
      aria-label={label ? `${label} (${UNAVAILABLE_NOTE})` : undefined}
      title="Not available yet"
      className={cx("inline-flex min-h-11 cursor-default items-center gap-1", className)}
    >
      {children}
      {!label && <span className="sr-only"> ({UNAVAILABLE_NOTE})</span>}
    </button>
  );
}
