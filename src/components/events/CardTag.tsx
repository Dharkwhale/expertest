import { cx } from "@/lib/cx";
import type { CardTag as Tag, Tone } from "@/mock/data";

const tones: Record<Tone, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
};

// Category tag on a card image ("ART FAIR" cyan, "NIGHTLIFE" in ex7)
export function CardTag({ tag, className }: { tag: Tag; className?: string }) {
  return (
    <span
      className={cx(
        "label-caps inline-flex rounded-full bg-neutral-950 px-2.5 py-1", // solid: tertiary text needs 4.5:1
        tones[tag.tone],
        className,
      )}
    >
      {tag.label}
    </span>
  );
}
