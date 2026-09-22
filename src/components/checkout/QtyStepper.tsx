"use client";

import { useId } from "react";
import { cx } from "@/lib/cx";

// ex9 − n + stepper. The value is announced politely when it changes; "+" at the cap stays
// focusable (aria-disabled) and says why, instead of silently doing nothing.
export function QtyStepper({
  itemName,
  value,
  onDecrement,
  onIncrement,
  canIncrement,
  capReason,
}: {
  itemName: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  canIncrement: boolean;
  capReason: string;
}) {
  const reasonId = useId();
  const atZero = value === 0;
  const button =
    "inline-flex size-11 items-center justify-center rounded-full text-lg font-semibold transition-colors";

  return (
    <div
      role="group"
      aria-label={`${itemName} quantity`}
      className="inline-flex items-center gap-1 rounded-full border border-neutral-800 bg-neutral-950 p-0.5"
    >
      <button
        type="button"
        aria-label={`Remove one ${itemName}`}
        disabled={atZero}
        onClick={onDecrement}
        className={cx(button, "text-neutral-200 hover:bg-neutral-800 active:scale-98 disabled:text-neutral-500 disabled:hover:bg-transparent")}
      >
        −
      </button>
      <output aria-live="polite" className="w-6 text-center font-semibold tabular-nums">
        {value}
      </output>
      <button
        type="button"
        aria-label={`Add one ${itemName}`}
        aria-disabled={!canIncrement || undefined}
        aria-describedby={canIncrement ? undefined : reasonId}
        onClick={canIncrement ? onIncrement : undefined}
        className={cx(
          button,
          canIncrement
            ? value > 0
              ? "bg-primary text-ink hover:bg-primary/85 active:scale-98"
              : "bg-neutral-800 text-neutral-50 hover:bg-neutral-700 active:scale-98"
            : "cursor-default bg-neutral-800 text-neutral-500",
        )}
      >
        +
      </button>
      {!canIncrement && (
        <span id={reasonId} className="sr-only">
          {capReason}
        </span>
      )}
    </div>
  );
}
