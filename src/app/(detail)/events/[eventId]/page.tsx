import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { EventAside } from "@/components/event-details/EventAside";
import { EventStory } from "@/components/event-details/EventStory";
import { BookmarkIcon, ShareIcon, UserIcon } from "@/components/icons";
import { BackButton } from "@/components/nav/BackButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { IconButton } from "@/components/ui/IconButton";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";
import { formatCompact } from "@/lib/format";
import { readViewState } from "@/lib/view-state";
import { attendeePreview, getEvent, lowestTier } from "@/mock/data";

export async function generateMetadata({ params }: PageProps<"/events/[eventId]">): Promise<Metadata> {
  const event = getEvent((await params).eventId);
  return { title: event?.title ?? "Event not found" };
}

// S05 Event Details (ex10). Mobile: stacked, full-bleed hero, fixed bottom CTA.
// lg: content 2/3 left, sticky facts + CTA card 1/3 right (CLAUDE.md §6.3).
export default async function EventDetailsPage({ params, searchParams }: PageProps<"/events/[eventId]">) {
  const [{ eventId }, query] = await Promise.all([params, searchParams]);
  const event = getEvent(eventId);
  if (!event) notFound();

  const state = readViewState(query);
  const fromTier = lowestTier(event.id);
  const retryHref = `/events/${event.id}`;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-32 md:px-8 md:pt-8 lg:pb-16">
      {/* Hero: full-bleed on mobile, contained + rounded at 420px from md (§6.4) */}
      <section
        aria-labelledby="event-title"
        className="relative isolate -mx-4 flex aspect-3/4 flex-col justify-end overflow-hidden sm:aspect-video md:mx-0 md:aspect-auto md:h-105 md:rounded-card"
      >
        <Image src={event.heroImage} alt="" fill preload sizes="(min-width: 1152px) 72rem, 100vw" className="-z-10 object-cover" />
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/10"
        />

        <div className="absolute inset-x-4 top-4 flex items-center justify-between md:inset-x-6 md:top-6">
          <BackButton fallbackHref="/explore" />
          <div className="flex gap-2">
            <IconButton label="Save" icon={<BookmarkIcon />} unavailable />
            <IconButton label="Share" icon={<ShareIcon />} unavailable />
          </div>
        </div>

        <div className="flex flex-col gap-3 p-4 md:p-6 lg:max-w-3xl">
          {event.isLive && (
            <ul className="flex flex-wrap gap-2" aria-label="Status">
              <li className="label-caps inline-flex items-center gap-1.5 rounded-full border border-primary/70 bg-neutral-950/70 px-3 py-1 text-primary backdrop-blur-sm">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
                Live now
              </li>
              {event.details && (
                <li className="label-caps rounded-full bg-neutral-800/80 px-3 py-1 text-neutral-200 backdrop-blur-sm">
                  {event.details.format}
                </li>
              )}
              {event.attendingCount && (
                <li className="label-caps inline-flex items-center gap-1.5 rounded-full bg-neutral-950/70 px-3 py-1 text-secondary backdrop-blur-sm">
                  <UserIcon className="size-3.5" />
                  {formatCompact(event.attendingCount)} in room
                </li>
              )}
            </ul>
          )}
          {/* "Experience 04" dropped: journey numbering leaked into the UI (flow.md §4) */}
          {(event.city || event.details) && (
            <p className="label-caps text-neutral-400">
              {[event.city, event.details?.season].filter(Boolean).join(" · ")}
            </p>
          )}
          <h1 id="event-title" className="font-display text-display uppercase">
            {event.title}
          </h1>
          <p className="max-w-xl text-neutral-200">{event.subtitle}</p>
        </div>
      </section>

      {state === "loading" ? (
        <SkeletonGroup label="event details" className="mt-6 grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-56 lg:col-start-3 lg:row-start-1" />
          <div className="flex flex-col gap-4 lg:col-span-2 lg:row-start-1">
            <Skeleton className="h-24" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </SkeletonGroup>
      ) : state === "error" ? (
        <ErrorState what="this experience's details" retryHref={retryHref} className="mt-6" />
      ) : (
        <div className="mt-6 grid gap-10 lg:mt-8 lg:grid-cols-3 lg:gap-8">
          {/* First in the DOM so the facts come right after the hero on mobile */}
          <div className="lg:col-start-3 lg:row-start-1">
            <EventAside event={event} fromTier={fromTier} attendeeFaces={attendeePreview} />
          </div>
          <div className="lg:col-span-2 lg:row-start-1">
            {state === "empty" || !event.details ? (
              <EmptyState
                message="The full lineup and details for this experience haven't been announced yet."
                action={{ label: "Explore other events", href: "/explore" }}
              />
            ) : (
              <EventStory description={event.description} details={event.details} />
            )}
          </div>
        </div>
      )}
    </main>
  );
}
