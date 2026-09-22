import Image from "next/image";
import { cardSurface } from "@/components/ui/card";
import { cx } from "@/lib/cx";
import { formatNgn } from "@/lib/format";
import type { OrderLine } from "@/lib/order";
import type { ExperienceEvent } from "@/mock/data";

// The "what you're buying" card.
//  - S07 (ex13): chip + when, title, tier line(s), order total
//  - S08 (ex14, `withThumb`): thumbnail, chip, title, date, venue (canonical, flow.md §5)
export function OrderEventCard({
  event,
  lines,
  totalNgn,
  withThumb,
}: {
  event: ExperienceEvent;
  lines: OrderLine[];
  totalNgn?: number;
  withThumb?: boolean;
}) {
  const when = event.isLive ? "Tonight" : event.dateLabel;

  return (
    <section aria-label="Your order" className={cx(cardSurface, "flex items-center gap-4 p-4 md:p-5")}>
      {withThumb && (
        <div className="relative size-18 shrink-0 overflow-hidden rounded-thumb bg-neutral-800 md:size-20">
          <Image src={event.heroImage} alt="" fill sizes="80px" className="object-cover" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-400">
          {event.isLive && (
            <span className="label-caps inline-flex items-center gap-1.5 rounded-full border border-primary/60 bg-primary/10 px-2.5 py-0.5 text-primary">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
              Live
            </span>
          )}
          {withThumb ? event.city : [event.city, when, event.timeLabel].filter(Boolean).join(" · ")}
        </p>
        <h2 className="mt-1 font-display text-xl uppercase md:text-2xl">{event.title}</h2>
        {withThumb ? (
          <>
            <p className="text-sm text-neutral-200">
              {when}
              {event.dateLabel && event.isLive ? `, ${event.dateLabel.replace(/^\w+ /, "")}` : ""} · {event.timeLabel}
            </p>
            {event.venue && <p className="text-sm text-neutral-400">{event.venue}</p>}
          </>
        ) : (
          <p className="text-sm text-neutral-400">
            {lines.map((line) => `${line.tier.name}${line.qty > 1 ? ` ×${line.qty}` : ""}`).join(", ")}
          </p>
        )}
      </div>
      {totalNgn !== undefined && (
        <p className="shrink-0 self-end text-lg font-semibold tabular-nums md:text-xl">{formatNgn(totalNgn)}</p>
      )}
    </section>
  );
}
