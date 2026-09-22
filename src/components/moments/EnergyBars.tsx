import { cx } from "@/lib/cx";

// ex16 "Your energy": a static bar waveform, cyan at the edges and purple in the middle
// (secondary → tertiary → secondary), labelled with its three-word scale. Decorative bars;
// the scale is the text alternative.
export function EnergyBars({ values, scale }: { values: readonly number[]; scale: readonly string[] }) {
  const mid = values.length / 2;
  return (
    <figure className="flex flex-col gap-3">
      <div aria-hidden="true" className="flex h-20 items-center justify-between gap-1">
        {values.map((v, i) => (
          <span
            key={i}
            className={cx("w-1.5 rounded-full", Math.abs(i - mid) < values.length / 5 ? "bg-tertiary" : "bg-secondary")}
            style={{ height: `${Math.round(Math.max(0.1, v) * 100)}%` }}
          />
        ))}
      </div>
      <figcaption className="label-caps flex justify-between text-neutral-400">
        {scale.map((word, i) => (
          <span key={word} className={i === 1 ? "text-neutral-50" : undefined}>
            {word}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
