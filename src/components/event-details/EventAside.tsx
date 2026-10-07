import { ProgressiveBlur } from "@/components/glass/ProgressiveBlur";
import { ArrowRightIcon, ChevronRightIcon, ClockIcon, PinIcon } from "@/components/icons";
import { AvatarStack } from "@/components/ui/AvatarStack";
import { ButtonLink } from "@/components/ui/Button";
import { cardSurface } from "@/components/ui/card";
import { UnavailableButton } from "@/components/ui/UnavailableButton";
import { cx } from "@/lib/cx";
import { formatCount, formatNgn } from "@/lib/format";
import { toUsdc } from "@/lib/order";
import type { ExperienceEvent, Tier } from "@/mock/data";

// ex10's facts card + the primary action. One element for both layouts (CLAUDE.md §6.3):
//  - mobile: facts card in the flow; the CTA block is a fixed bottom bar
//  - lg: a sticky right column holding both
export function EventAside({
  event,
  fromTier,
  attendeeFaces,
}: {
  event: ExperienceEvent;
  /** Cheapest tier. Only Neon Solstice has tiers; others show no price. */
  fromTier?: Tier;
  attendeeFaces: string[];
}) {
  const when = event.isLive ? `Tonight, ${event.dateLabel.replace(/^\w+ /, "")}` : event.dateLabel;
  const hours = event.timeRange ?? event.timeLabel;

  return (
    <aside aria-label="Event essentials" className="flex flex-col gap-4 lg:sticky lg:top-24">
      <ul className={cx(cardSurface, "flex flex-col divide-y divide-neutral-800")}>
        <li className="flex items-center gap-3 p-4">
          <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-thumb bg-neutral-800 text-secondary">
            <PinIcon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-neutral-50">
              <span className="sr-only">Where: </span>
              {event.venue ?? event.city ?? "Location to be announced"}
            </p>
            {event.area && <p className="text-sm text-neutral-400">{event.area}</p>}
          </div>
          {event.venue && (
            <UnavailableButton label="Venue map" className="text-sm font-medium text-primary">
              Map
              <ChevronRightIcon className="size-4" />
            </UnavailableButton>
          )}
        </li>

        <li className="flex items-center gap-3 p-4">
          <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-thumb bg-neutral-800 text-primary">
            <ClockIcon className="size-5" />
          </span>
          <div>
            <p className="font-medium text-neutral-50">
              <span className="sr-only">When: </span>
              {when}
            </p>
            {hours && <p className="text-sm text-neutral-400">{hours}</p>}
          </div>
        </li>

        {event.attendingCount && (
          <li className="flex flex-wrap items-center gap-3 p-4">
            <p className="flex flex-1 items-center gap-2 text-neutral-200">
              <AvatarStack images={attendeeFaces} max={3} />
              {formatCount(event.attendingCount)} Nomads attending
            </p>
            {/* Squad Hub is M6 (S19) */}
            <UnavailableButton label="View squad" className="text-sm font-medium text-neutral-400">
              View squad
              <ChevronRightIcon className="size-4" />
            </UnavailableButton>
          </li>
        )}
      </ul>

      {/* Mobile: fixed to the bottom edge (ex10). lg: first in the sticky column, so the
          primary action is above the fold at 1280×900. */}
      {/* Glass trial round 4: on mobile the bar sits over scrolling content, so its blur ramps
          from clear at the lit top edge to fully frosted at the bottom (`glass-ramp`, four
          masked layers; values in globals.css). On lg the same element is a static card with
          the accent gradient border and no ramp. */}
      <div
        className={cx(
          "fixed inset-x-0 bottom-0 z-40 isolate overflow-hidden border-t border-neutral-50/20 bg-ink/35",
          "grid grid-cols-[auto_1fr] items-center gap-4 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
          "md:px-8 lg:static lg:order-first lg:grid-cols-1 lg:gap-3 lg:rounded-card lg:border-t-0 lg:bg-transparent lg:p-5 lg:glass-card",
        )}
      >
        <ProgressiveBlur className="-z-10 lg:hidden" />
        <span aria-hidden="true" className="glass-spec -z-10" />

        {fromTier && (
          <div className="min-w-0">
            <p className="label-caps text-neutral-200">From</p>
            <p className="font-display text-2xl whitespace-nowrap tabular-nums">{formatNgn(fromTier.priceNgn)}</p>
            <p className="text-xs whitespace-nowrap text-neutral-200 tabular-nums">
              ≈ {toUsdc(fromTier.priceNgn).toFixed(2)} USDC
            </p>
          </div>
        )}
        <ButtonLink
          href={`/events/${event.id}/access`}
          size="lg"
          className={cx("w-full", fromTier && "col-start-2")}
        >
          Join experience
          <ArrowRightIcon className="size-5" />
        </ButtonLink>
      </div>
    </aside>
  );
}
