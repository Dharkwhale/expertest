import Link from "next/link";
import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

// ex1 variants. Primary is lime: every CTA in ex3/ex9/ex10 is lime, overriding ex1's
// white "Primary" swatch (most-common-wins, CLAUDE.md §1). Pill shape per ex3/ex9.
export type ButtonVariant = "primary" | "secondary" | "inverted" | "outlined";

type StyleProps = {
  variant?: ButtonVariant;
  size?: "md" | "lg";
  fullWidth?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-ink shadow-glow hover:bg-primary/85",
  secondary: "bg-neutral-800 text-neutral-50 hover:bg-neutral-700",
  inverted: "bg-neutral-50 text-ink hover:bg-neutral-200",
  outlined:
    "border border-neutral-500 text-neutral-50 hover:border-neutral-200 hover:bg-neutral-900",
};

const sizes = {
  md: "min-h-11 px-5",
  lg: "min-h-14 px-7",
};

export function buttonClasses({ variant = "primary", size = "md", fullWidth }: StyleProps = {}) {
  return cx(
    "label-caps inline-flex items-center justify-center gap-2 rounded-full text-center transition-colors",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
  );
}

export function Button({
  variant,
  size,
  fullWidth,
  className,
  type = "button",
  ...props
}: StyleProps & ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={cx(buttonClasses({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant,
  size,
  fullWidth,
  className,
  ...props
}: StyleProps & ComponentProps<typeof Link>) {
  return (
    <Link className={cx(buttonClasses({ variant, size, fullWidth }), className)} {...props} />
  );
}
