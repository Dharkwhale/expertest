import { useId } from "react";
import { cx } from "@/lib/cx";

// The generated memory artwork (Q1, 2026-09-22: built from existing parts only). ex19's art
// card and ex16's experience card share one motif: soft colour fields over a dark wave
// horizon with a row of dots. Redrawn in palette tokens (tertiary / secondary / primary) as
// SVG, so it scales to any size. `variant="card"` is ex16's wide banner; "poster" is ex19's
// portrait card.
export function MemoryArtwork({
  label,
  variant = "poster",
  className,
}: {
  /** Accessible description; omit when neighbouring text already names it */
  label?: string;
  variant?: "poster" | "card";
  className?: string;
}) {
  const id = useId();
  const poster = variant === "poster";
  const [w, h] = poster ? [300, 400] : [400, 200];
  const horizon = poster ? 300 : 130;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cx("block size-full bg-neutral-950", className)}
    >
      <defs>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={poster ? 40 : 30} />
        </filter>
      </defs>
      <g filter={`url(#${id}-blur)`}>
        <circle cx={w * 0.3} cy={h * 0.25} r={w * 0.35} className="fill-tertiary" opacity="0.9" />
        <circle cx={w * 0.7} cy={h * 0.3} r={w * 0.3} className="fill-tertiary" opacity="0.6" />
        {poster && <circle cx={w * 0.45} cy={h * 0.58} r={w * 0.3} className="fill-secondary" opacity="0.7" />}
      </g>
      <path
        d={`M0 ${horizon} C ${w * 0.15} ${horizon - 30}, ${w * 0.3} ${horizon + 10}, ${w * 0.45} ${horizon - 15} S ${w * 0.75} ${horizon - 35}, ${w} ${horizon - 20} V ${h} H 0 Z`}
        className="fill-neutral-950"
      />
      {[0.18, 0.4, 0.58, 0.8].map((x, i) => (
        <circle key={x} cx={w * x} cy={horizon - 28 - (i % 2) * 12} r={poster ? 9 : 7} className="fill-neutral-950" />
      ))}
      <circle cx={w * 0.58} cy={horizon - 52} r="4" className="fill-primary" />
    </svg>
  );
}
