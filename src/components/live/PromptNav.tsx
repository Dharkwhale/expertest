import Link from "next/link";
import { ChevronLeftIcon, CloseIcon } from "@/components/icons";
import { cx } from "@/lib/cx";

// The one way out of a full-screen live screen (ex8 back, ex24 / ex25 ✕). Always an explicit
// link to S13, like CheckoutHeader, so it works when a prompt is opened directly.
export function PromptNav({
  href = "/live",
  label = "Back to Live",
  kind,
  className,
}: {
  href?: string;
  label?: string;
  kind: "back" | "close";
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cx(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-neutral-900/80 text-neutral-50 backdrop-blur-sm transition-colors hover:bg-neutral-800 active:scale-98 [&_svg]:size-5",
        className,
      )}
    >
      {kind === "back" ? <ChevronLeftIcon /> : <CloseIcon />}
    </Link>
  );
}
