import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EventMeta } from "@/components/events/EventMeta";
import { EventRowCard } from "@/components/events/EventRowCard";
import { PreEventNotice } from "@/components/live/PreEventNotice";
import { ArrowRightIcon, BellIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/Avatar";
import { AvatarStack } from "@/components/ui/AvatarStack";
import { ButtonLink } from "@/components/ui/Button";
import { cardInteractive, cardSurface, stretchedLink } from "@/components/ui/card";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { IconButton } from "@/components/ui/IconButton";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";
import { cx } from "@/lib/cx";
import { formatCount } from "@/lib/format";
import { readViewState } from "@/lib/view-state";
import { attendeePreview, currentUser, getEvent, getEvents, home, liveNotice } from "@/mock/data";

export const metadata: Metadata = { title: "Home" };

// S03 Home (ex3). lg: live hero 2/3 + "Up next" rail 1/3 (progress.md, M2 decisions).
export default async function HomePage({ searchParams }: PageProps<"/home">) {
  const state = readViewState(await searchParams);
  const hero = state === "empty" ? undefined : getEvent(home.heroId);
  const upNext = state === "empty" ? [] : getEvents(home.upNextIds);
  const firstName = currentUser.name.split(" ")[0];
  // S12 (ex23) card: only while its event is live (Q4 a, D5 a)
  const notice = state === "ready" ? getEvent(liveNotice.eventId) : undefined;

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <header className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-neutral-400">{home.greeting}</p>
          <h1 className="font-display text-display uppercase">{firstName}.</h1>
          <Link
            href="/explore"
            className="inline-flex min-h-11 items-center gap-1.5 self-start whitespace-nowrap text-neutral-400 hover:text-neutral-50"
          >
            Things happening around you
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {/* The dot is ex3's unread marker; there's no Notifications screen yet (flow.md §3) */}
          <span className="relative">
            <IconButton label="Notifications" icon={<BellIcon />} unavailable />
            <span aria-hidden="true" className="absolute top-2.5 right-2.5 size-2 rounded-full bg-primary" />
          </span>
          {/* md+: the top nav already shows this avatar and link */}
          <Link href="/you" aria-label={`Your profile, ${currentUser.name}`} className="inline-flex size-11 items-center justify-center rounded-full md:hidden">
            <Avatar name={currentUser.name} src={currentUser.avatar} ring decorative />
          </Link>
        </div>
      </header>

      {notice?.isLive && notice.venue && <PreEventNotice room={notice.venue} />}

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        <section aria-label="Happening now" className="lg:col-span-2">
          {state === "loading" ? (
            <SkeletonGroup label="live experience" className="flex flex-col gap-4">
              <Skeleton className="aspect-4/3 w-full md:aspect-auto md:h-105" />
              <Skeleton className="h-14 w-full rounded-full" />
            </SkeletonGroup>
          ) : state === "error" ? (
            <ErrorState what="what's happening near you" retryHref="/home" />
          ) : !hero ? (
            <EmptyState
              message="Nothing is live near you right now."
              action={{ label: "Explore upcoming events", href: "/explore" }}
            />
          ) : (
            <article className={cx(cardSurface, cardInteractive, "overflow-hidden")}>
              <div className="relative isolate flex aspect-4/3 flex-col justify-end md:aspect-auto md:h-105">
                <Image
                  src={hero.heroImage}
                  alt=""
                  fill
                  preload
                  sizes="(min-width: 1024px) 46rem, 100vw"
                  className="-z-10 object-cover"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-linear-to-t from-neutral-900 via-neutral-900/30 to-transparent"
                />
                {hero.city && <Chip className="absolute top-4 left-4">{hero.city}</Chip>}
                {hero.isLive && <LiveBadge className="absolute top-4 right-4" />}
                <div className="flex flex-col gap-2 p-4 md:p-6">
                  <h2 className="font-display text-title uppercase">{hero.title}</h2>
                  <EventMeta event={hero} />
                </div>
              </div>

              <div className="flex flex-col gap-4 p-4 pt-3 md:p-6 md:pt-4">
                {hero.attendingCount && (
                  <p className="flex items-center gap-2 text-neutral-400">
                    <AvatarStack images={attendeePreview} />
                    {formatCount(hero.attendingCount)} people going
                  </p>
                )}
                {hero.quote && (
                  <figure className="flex flex-col gap-1">
                    <blockquote className="text-neutral-200 italic">
                      &ldquo;{hero.quote.text}&rdquo;
                    </blockquote>
                    <figcaption className="text-sm text-neutral-400">— {hero.quote.handle}</figcaption>
                  </figure>
                )}
                {/* The card's one link: its ::after makes the whole card the target */}
                <ButtonLink
                  href={`/events/${hero.id}`}
                  size="lg"
                  fullWidth
                  data-card-link
                  aria-label={`Join experience: ${hero.title}`}
                  className={stretchedLink}
                >
                  Join experience
                </ButtonLink>
              </div>
            </article>
          )}
        </section>

        <section aria-labelledby="up-next-heading" className="flex flex-col gap-3">
          {/* ex3 has no visible heading here; the section still needs a name */}
          <h2 id="up-next-heading" className="sr-only">
            Up next
          </h2>
          {state === "loading" ? (
            <SkeletonGroup label="upcoming events">
              <Skeleton className="h-26 w-full" />
            </SkeletonGroup>
          ) : state === "error" ? (
            <ErrorState what="upcoming events" retryHref="/home" />
          ) : upNext.length === 0 ? (
            <EmptyState message="No upcoming events yet." action={{ label: "Explore", href: "/explore" }} />
          ) : (
            <ul className="flex flex-col gap-3">
              {upNext.map((event) => (
                <li key={event.id}>
                  <EventRowCard event={event} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
