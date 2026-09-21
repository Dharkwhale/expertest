import { cx } from "@/lib/cx";

// ex3 "● LIVE". Static dot: the design doesn't animate it.
export function LiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        "label-caps inline-flex items-center gap-1.5 rounded-full border border-primary/70 bg-neutral-950/70 px-3 py-1 text-primary backdrop-blur-sm",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
      Live
    </span>
  );
}
