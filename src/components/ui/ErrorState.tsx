import { ButtonLink } from "@/components/ui/Button";
import { cx } from "@/lib/cx";

// Inline, in-section error (progress.md, M2 data states). Says what failed and how to
// fix it; Retry reloads the route without the review ?state param.
export function ErrorState({
  what,
  retryHref,
  className,
}: {
  /** What failed to load, e.g. "events" */
  what: string;
  retryHref: string;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cx(
        "flex flex-col items-start gap-3 rounded-card border border-neutral-800 bg-neutral-900 p-5",
        className,
      )}
    >
      <p className="font-medium text-neutral-50">Couldn&apos;t load {what}.</p>
      <p className="text-neutral-400">Check your connection, then try again.</p>
      <ButtonLink href={retryHref} variant="secondary">
        Retry
      </ButtonLink>
    </div>
  );
}
