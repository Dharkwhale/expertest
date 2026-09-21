import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

// ex13 payment option: a native radio (keyboard arrows, form semantics, screen-reader
// "radio, 1 of 2, checked" for free) drawn as a card. The whole card is the <label>.
export function RadioCard({
  name,
  value,
  checked,
  onChange,
  title,
  description,
  badge,
  aside,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  title: string;
  description: string;
  badge?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <label
      className={cx(
        "flex cursor-pointer items-center gap-4 rounded-card border bg-neutral-900 p-4 transition-colors active:scale-98",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
        checked ? "border-primary" : "border-neutral-800 hover:border-neutral-500 hover:bg-neutral-800",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cx(
          "grid size-6 shrink-0 place-items-center rounded-full border-2",
          checked ? "border-primary" : "border-neutral-500",
        )}
      >
        {checked && <span className="size-3 rounded-full bg-primary" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2 font-semibold text-neutral-50">
          {title}
          {badge}
        </span>
        <span className="block text-sm text-neutral-400">{description}</span>
      </span>
      {aside}
    </label>
  );
}
