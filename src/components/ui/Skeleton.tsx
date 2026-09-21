import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

// Static placeholder block. No shimmer: no design animates, and the global
// reduced-motion rule would flatten it anyway (progress.md, M2 data states).
export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cx("block rounded-card bg-neutral-800", className)} />;
}

/** Wraps a section's skeletons so assistive tech hears one "Loading …" instead of nothing. */
export function SkeletonGroup({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div role="status" className={className}>
      <span className="sr-only">Loading {label}</span>
      {children}
    </div>
  );
}
