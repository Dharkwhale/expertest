import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { cx } from "@/lib/cx";

type EmptyAction = { label: string } & ({ href: string; onClick?: never } | { onClick: () => void; href?: never });

// In-section empty state: one line plus the way forward (progress.md, M2 data states).
// The action is a link (go somewhere) or a button (e.g. clear a filter in place).
export function EmptyState({
  message,
  action,
  className,
}: {
  message: string;
  action?: EmptyAction;
  className?: string;
}) {
  const actionClasses =
    "inline-flex min-h-11 items-center gap-1.5 font-medium text-primary hover:text-neutral-50";

  return (
    <div
      className={cx(
        "flex flex-col items-start gap-2 rounded-card border border-dashed border-neutral-700 p-5",
        className,
      )}
    >
      <p className="text-neutral-200">{message}</p>
      {action?.href !== undefined && (
        <Link href={action.href} className={actionClasses}>
          {action.label}
          <ArrowRightIcon className="size-4" />
        </Link>
      )}
      {action?.onClick && (
        <button type="button" onClick={action.onClick} className={actionClasses}>
          {action.label}
        </button>
      )}
    </div>
  );
}
