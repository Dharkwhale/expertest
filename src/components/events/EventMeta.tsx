import { ClockIcon, PinIcon } from "@/components/icons";
import { cx } from "@/lib/cx";
import type { ExperienceEvent } from "@/mock/data";

// "⌖ Lagos · ◷ Tonight · 8:00 PM" (ex3, ex7). A live event says "Tonight".
export function EventMeta({ event, className }: { event: ExperienceEvent; className?: string }) {
  const when = event.isLive ? "Tonight" : event.dateLabel;
  return (
    <p className={cx("flex flex-wrap items-center gap-x-3 gap-y-1 text-neutral-200", className)}>
      {event.city && (
        <span className="inline-flex items-center gap-1.5">
          <PinIcon className="size-4 shrink-0" />
          {event.city}
        </span>
      )}
      <span className="inline-flex items-center gap-1.5">
        <ClockIcon className="size-4 shrink-0" />
        {when}
        {event.timeLabel && (
          <>
            <span aria-hidden="true">·</span>
            {event.timeLabel}
          </>
        )}
      </span>
    </p>
  );
}
