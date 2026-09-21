import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";
import { UNAVAILABLE_NOTE } from "@/components/ui/UnavailableButton";

type IconButtonProps = Omit<ComponentProps<"button">, "children" | "aria-label"> & {
  /** Accessible name. Required: the icon alone says nothing to a screen reader. */
  label: string;
  icon: ReactNode;
  /**
   * The design shows this control but its screen doesn't exist yet (flow.md §3).
   * Renders as designed, stays focusable, announces itself as unavailable, does nothing.
   */
  unavailable?: boolean;
};

export function IconButton({
  label,
  icon,
  unavailable,
  className,
  type = "button",
  onClick,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={unavailable ? `${label} (${UNAVAILABLE_NOTE})` : label}
      aria-disabled={unavailable || undefined}
      title={unavailable ? `${label}: ${UNAVAILABLE_NOTE}` : undefined}
      onClick={unavailable ? undefined : onClick}
      className={cx(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full",
        "bg-neutral-800/80 text-neutral-50 transition-colors [&_svg]:size-5",
        unavailable ? "cursor-default" : "hover:bg-neutral-700 active:scale-98",
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  );
}
