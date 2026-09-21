import Image from "next/image";
import Link from "next/link";
import { CardTag } from "@/components/events/CardTag";
import { ChevronRightIcon } from "@/components/icons";
import { cardInteractive, cardSurface, stretchedLink } from "@/components/ui/card";
import { cx } from "@/lib/cx";
import type { ExperienceEvent } from "@/mock/data";

// Thumbnail-left event row: ex3 (Sound/Scape under the hero) and ex7 "For you".
export function EventRowCard({
  event,
  kicker,
  showTag,
  showChevron,
  headingLevel: Heading = "h3",
}: {
  event: ExperienceEvent;
  /** Small line above the title, beside the tag (ex7: "Curated Listening") */
  kicker?: string;
  showTag?: boolean;
  showChevron?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const when = [event.city, event.dateLabel, event.timeLabel].filter(Boolean).join(" · ");

  return (
    <article className={cx(cardSurface, cardInteractive, "flex items-center gap-4 p-3 md:p-4")}>
      <div className="relative size-18 shrink-0 overflow-hidden rounded-thumb bg-neutral-800 md:size-20">
        <Image src={event.heroImage} alt="" fill sizes="80px" className="object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        {(kicker || (showTag && event.tag)) && (
          <p className="mb-1 flex flex-wrap items-center gap-2 text-sm text-neutral-400">
            {showTag && event.tag && <CardTag tag={event.tag} className="py-0.5" />}
            {kicker}
          </p>
        )}
        <Heading className="font-display text-lg leading-tight uppercase md:text-xl">
          <Link href={`/events/${event.id}`} data-card-link className={stretchedLink}>
            {event.title}
          </Link>
        </Heading>
        <p className="text-neutral-400">{event.subtitle}</p>
        <p className="text-sm text-neutral-400">{when}</p>
      </div>

      {showChevron && <ChevronRightIcon className="size-5 shrink-0 text-neutral-400" />}
    </article>
  );
}
