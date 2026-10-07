import { cx } from "@/lib/cx";

// Progressive blur: four stacked layers, each blurrier than the last and masked to its own
// band, so a surface reads clear at its top edge and fully frosted at the bottom. The blur
// values and masks live in the `glass-ramp` utility in globals.css; this is just its markup,
// shared by the event CTA bar and the floating tab bar so there's only one implementation.
//
// Each layer inherits the parent's radius, so it works on a rectangle or a full pill.
export function ProgressiveBlur({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cx("glass-ramp", className)}>
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}
