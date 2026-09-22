import { cx } from "@/lib/cx";

// ex1's progress bar, used by ex26 "Squad Synergy" and ex27's squad scores. A <meter>-style
// value (0–100) with a native progressbar role so the number is announced.
export function ProgressBar({
  value,
  label,
  tone = "primary",
  className,
}: {
  value: number;
  /** Accessible name, e.g. "Squad synergy" */
  label: string;
  tone?: "primary" | "tertiary" | "neutral";
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className={cx("h-2 overflow-hidden rounded-full bg-neutral-800", className)}
    >
      <div
        className={cx(
          "h-full rounded-full",
          tone === "primary" ? "bg-primary" : tone === "tertiary" ? "bg-tertiary" : "bg-neutral-400",
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
