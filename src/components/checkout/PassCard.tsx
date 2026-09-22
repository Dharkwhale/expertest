import { Barcode } from "@/components/checkout/Barcode";
import { PinIcon } from "@/components/icons";
import type { OrderLine } from "@/lib/order";
import type { ExperienceEvent, Person } from "@/mock/data";

export type PassIds = { number: number; credential: string; serial: string; earlySync: string };

// ex20 pass. Fixes: access tier = the tier bought (ex20 says "VIP Immersion"), its detail =
// that tier's tagline; venue canonical (flow.md §5). The "1.2K squad" line is unreadable
// in the export and left out rather than invented.
export function PassCard({
  event,
  line,
  holder,
  ids,
}: {
  event: ExperienceEvent;
  line: OrderLine;
  holder: Person;
  ids: PassIds;
}) {
  return (
    <article
      aria-label={`${event.title} pass #${ids.number}, ${line.tier.name}`}
      className="overflow-hidden rounded-card border border-primary/30 bg-linear-to-br from-primary/25 via-secondary/15 to-tertiary/30"
    >
      <div className="flex flex-col gap-4 p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="label-caps inline-flex items-center gap-1.5 rounded-full border border-primary/60 bg-neutral-950/60 px-3 py-1 text-primary">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
            Live sensory protocol
          </span>
          <span className="label-caps rounded-full border border-neutral-50/20 bg-neutral-950/50 px-2.5 py-1 text-neutral-200">
            Pass #{ids.number}
          </span>
        </div>

        <div>
          <h2 className="font-display text-title uppercase">{event.title}</h2>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm">
            <PinIcon className="size-4 shrink-0 text-primary" />
            <span className="text-primary">{event.venue}</span>
            {event.area && (
              <>
                <span aria-hidden="true" className="text-neutral-400">
                  ·
                </span>
                <span className="text-neutral-200">{event.area}</span>
              </>
            )}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-thumb bg-neutral-950/70 p-4">
          <div>
            <dt className="label-caps text-neutral-400">Date &amp; doors</dt>
            <dd className="font-semibold text-neutral-50">
              {event.isLive ? "Tonight" : event.dateLabel} · {event.timeLabel}
            </dd>
            <dd className="text-sm text-primary">Early sync {ids.earlySync}</dd>
          </div>
          <div>
            <dt className="label-caps text-neutral-400">Access tier</dt>
            <dd className="font-semibold text-neutral-50">
              {line.tier.name}
              {line.qty > 1 && <span className="text-neutral-400 tabular-nums"> ×{line.qty}</span>}
            </dd>
            <dd className="text-sm text-neutral-400">{line.tier.tagline}</dd>
          </div>
          <div>
            <dt className="label-caps text-neutral-400">Holder alias</dt>
            <dd className="font-semibold text-neutral-50">{holder.name}</dd>
            <dd className="text-sm text-neutral-400">{holder.handle}</dd>
          </div>
          <div>
            <dt className="label-caps text-neutral-400">Token credential</dt>
            <dd className="font-semibold tracking-wide text-neutral-50">{ids.credential}</dd>
            <dd className="text-sm text-secondary">Verified on EXPER Core</dd>
          </div>
        </dl>
      </div>

      {/* Ticket perforation */}
      <div aria-hidden="true" className="relative mx-4 border-t-2 border-dashed border-neutral-50/20 md:mx-6">
        <span className="absolute -top-3 -left-7 size-6 rounded-full bg-neutral-950 md:-left-9" />
        <span className="absolute -top-3 -right-7 size-6 rounded-full bg-neutral-950 md:-right-9" />
      </div>

      <div className="flex flex-col gap-2 p-4 md:p-6">
        <Barcode value={ids.credential} className="h-14 w-full text-neutral-50" />
        <p className="label-caps flex flex-wrap items-center justify-between gap-2 text-neutral-400">
          <span className="flex items-center gap-1.5 text-primary">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
            NFC tap sensor active
          </span>
          <span className="tabular-nums">EXP · {ids.serial}</span>
        </p>
      </div>
    </article>
  );
}
