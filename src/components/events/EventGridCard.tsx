import Image from "next/image";
import Link from "next/link";
import { CardTag } from "@/components/events/CardTag";
import { Avatar } from "@/components/ui/Avatar";
import { cardInteractive, cardSurface, stretchedLink } from "@/components/ui/card";
import { cx } from "@/lib/cx";
import { formatCount } from "@/lib/format";
import type { ExperienceEvent } from "@/mock/data";

// Image-top event card.
//  - "explore": ex7 "Curated & happening" (city · date, then "N going")
//  - "stream":  ex6 "Live realities stream" (subtitle, then count + LIVE or the date)
export function EventGridCard({
  event,
  variant = "explore",
  headingLevel: Heading = "h3",
  imageClassName,
}: {
  event: ExperienceEvent;
  variant?: "explore" | "stream";
  headingLevel?: "h2" | "h3";
  /** Aspect override, e.g. a shorter 16:9 image where cards stack in a side rail */
  imageClassName?: string;
}) {
  const count = event.countLabel ?? (event.attendingCount ? `${formatCount(event.attendingCount)} going` : undefined);

  return (
    <article className={cx(cardSurface, cardInteractive, "flex h-full flex-col overflow-hidden")}>
      <div className={cx("relative aspect-4/3 bg-neutral-800", imageClassName)}>
        <Image
          src={event.heroImage}
          alt=""
          fill
          sizes="(min-width: 1024px) 22rem, 50vw"
          className="object-cover"
        />
        {event.tag && <CardTag tag={event.tag} className="absolute top-3 left-3" />}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3 md:p-4">
        <Heading className="font-display text-lg leading-tight uppercase md:text-xl">
          <Link href={`/events/${event.id}`} data-card-link className={stretchedLink}>
            {event.title}
          </Link>
        </Heading>
        <p className="text-neutral-400">
          {variant === "stream"
            ? event.subtitle
            : [event.city, event.isLive ? "Live now" : event.dateLabel].filter(Boolean).join(" · ")}
        </p>

        {count && (
          <div className="mt-auto flex items-center justify-between gap-2 border-t border-neutral-800 pt-3 text-neutral-400">
            <span className="flex items-center gap-2">
              {variant === "explore" && (
                <Avatar name={event.title} size="sm" tone={event.tag?.tone} decorative />
              )}
              {count}
            </span>
            {variant === "stream" &&
              (event.isLive ? (
                <span className="label-caps text-primary">Live</span>
              ) : (
                <span className="label-caps">{event.dateLabel}</span>
              ))}
          </div>
        )}
      </div>
    </article>
  );
}
