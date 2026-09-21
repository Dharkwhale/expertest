import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type ChipProps = {
  children: ReactNode;
  className?: string;
} & (
  | {
      /** Filter chip (ex16): toggles and exposes its pressed state */
      onClick: () => void;
      selected: boolean;
    }
  | {
      /** Static tag (ex3 "LAGOS") */
      onClick?: undefined;
      selected?: undefined;
    }
);

export function Chip({ children, className, onClick, selected }: ChipProps) {
  if (onClick) {
    return (
      <button
        type="button"
        aria-pressed={selected}
        onClick={onClick}
        className={cx(
          // after: grows the hit area to 44px tall without changing the drawn pill (ex7 size)
          "relative inline-flex min-h-9 shrink-0 items-center rounded-full px-4 font-medium whitespace-nowrap transition-colors",
          "after:absolute after:inset-x-0 after:-inset-y-1 after:content-[''] active:scale-98",
          selected
            ? "bg-primary text-ink"
            : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700",
          className,
        )}
      >
        {children}
      </button>
    );
  }

  return (
    <span
      className={cx(
        "label-caps inline-flex items-center rounded-full bg-neutral-950/70 px-3 py-1 text-neutral-50 backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}
