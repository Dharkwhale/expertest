import Image from "next/image";
import { EventMeta } from "@/components/events/EventMeta";
import { BookmarkIcon } from "@/components/icons";
import { AvatarStack } from "@/components/ui/AvatarStack";
import { ButtonLink } from "@/components/ui/Button";
import { cardInteractive, cardSurface, stretchedLink } from "@/components/ui/card";
import { IconButton } from "@/components/ui/IconButton";
import { cx } from "@/lib/cx";
import { formatCompact } from "@/lib/format";
import type { ExperienceEvent } from "@/mock/data";

// ex7 "Featured" card. The CTA is the card's one link (ex7's "Join Pulse" renamed to the
// canonical "Join experience", flow.md §5). md+: image capped at 420px (CLAUDE.md §6.4).
export function FeaturedEventCard({
  event,
  attendeeFaces,
}: {
  event: ExperienceEvent;
  attendeeFaces: string[];
}) {
  return (
    <article className={cx(cardSurface, cardInteractive, "overflow-hidden")}>
      <div className="relative aspect-4/3 md:aspect-auto md:h-105">
        <Image
          src={event.heroImage}
          alt=""
          fill
          preload
          sizes="(min-width: 1152px) 70rem, 100vw"
          className="object-cover"
        />
        <span className="label-caps absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-neutral-950/80 px-3 py-1 text-primary backdrop-blur-sm">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
          Trending #1
        </span>
        {/* ex7's stacked tagline over the photo */}
        <p className="label-caps absolute top-4 right-4 flex flex-col items-end gap-0.5 rounded-thumb bg-neutral-950/70 px-2.5 py-2 text-right backdrop-blur-sm">
          <span className="text-secondary">Lights</span>
          <span className="text-primary">Sound</span>
          <span className="text-tertiary">People</span>
          <span className="text-neutral-50 underline decoration-primary underline-offset-2">You?</span>
        </p>
      </div>

      <div className="flex flex-col gap-3 p-4 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <h3 className="font-display text-title uppercase">{event.title}</h3>
            <EventMeta event={event} className="text-neutral-400" />
          </div>
          <IconButton label="Save" icon={<BookmarkIcon />} unavailable className="relative z-10" />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-neutral-800 pt-3">
          {event.attendingCount && (
            <p className="flex items-center gap-2 text-neutral-200">
              <AvatarStack images={attendeeFaces} max={3} />
              {formatCompact(event.attendingCount)} going
            </p>
          )}
          <ButtonLink
            href={`/events/${event.id}`}
            data-card-link
            aria-label={`Join experience: ${event.title}`}
            className={stretchedLink}
          >
            Join experience
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
