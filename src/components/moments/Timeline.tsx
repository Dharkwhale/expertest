import { cx } from "@/lib/cx";

// ex16 "Your journey": a vertical line of steps. The first (arrival) ring is neutral, the rest
// lime, as drawn. Static list, no motion.
export function Timeline({ steps }: { steps: readonly string[] }) {
  return (
    <ol className="relative flex flex-col gap-5">
      <span aria-hidden="true" className="absolute top-3 bottom-3 left-3 w-px bg-neutral-800" />
      {steps.map((step, index) => (
        <li key={step} className="relative flex items-center gap-4">
          <span
            aria-hidden="true"
            className={cx(
              "grid size-6 shrink-0 place-items-center rounded-full border-2 bg-neutral-950",
              index === 0 ? "border-neutral-400" : "border-primary",
            )}
          >
            <span className={cx("size-2 rounded-full", index === 0 ? "bg-neutral-400" : "bg-primary")} />
          </span>
          <span className="text-neutral-200">{step}</span>
        </li>
      ))}
    </ol>
  );
}
