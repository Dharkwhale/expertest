import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CloseIcon, UserIcon } from "@/components/icons";
import { ReactionPicker } from "@/components/live/ReactionPicker";
import { SpaceRow } from "@/components/live/SpaceRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";
import { formatCompact } from "@/lib/format";
import { readViewState } from "@/lib/view-state";
import { getEvent, liveNow } from "@/mock/data";

export const metadata: Metadata = { title: "Live" };

// S13 Live Experience, the event lobby (ex5). In from the tab bar, S11 "Enter Hub" and the
// S12 card on Home. Fixes: "North Pavilion" → Resonance Pavilion (canonical venue); ✕ →
// Pocket Mode (flow.md §6); headline in Anton (Q10). Quick One reactions open S17 (Q7). The
// Squad row's S19 404s until M6 (decision D8 a).
export default async function LivePage({ searchParams }: PageProps<"/live">) {
  const state = readViewState(await searchParams);
  const event = state === "empty" ? undefined : getEvent(liveNow.eventId);

  if (state === "loading") {
    return (
      <SkeletonGroup label="the live experience" className="flex flex-col gap-4">
        <Skeleton className="h-64" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </SkeletonGroup>
    );
  }
  if (state === "error") return <ErrorState what="the live experience" retryHref="/live" />;
  if (!event?.isLive) {
    return (
      <>
        <h1 className="mb-4 font-display text-display uppercase">Live</h1>
        <EmptyState message="Nothing is live right now." action={{ label: "Explore upcoming events", href: "/explore" }} />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Hero: ex5's dark header over the event image, bleeding to the edges on mobile */}
      <header className="relative isolate -mx-4 -mt-4 flex min-h-72 flex-col justify-between overflow-hidden px-4 pt-4 pb-5 md:mx-0 md:mt-0 md:rounded-card">
        <Image src={event.heroImage} alt="" fill preload sizes="(min-width: 768px) 28rem, 100vw" className="-z-20 object-cover" />
        <span aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-neutral-950/80 via-neutral-950/70 to-neutral-950" />
        <div className="flex items-center justify-between">
          <LiveBadge />
          <Link
            href="/live/pocket"
            aria-label="Step away to Pocket Mode"
            className="inline-flex size-11 items-center justify-center rounded-full bg-neutral-950/80 text-neutral-50 transition-colors hover:bg-neutral-800 active:scale-98 [&_svg]:size-5"
          >
            <CloseIcon />
          </Link>
        </div>
        <div>
          <h1 className="font-display text-display uppercase">{event.title}</h1>
          <p className="mt-1 flex items-center justify-between gap-4 text-neutral-200">
            <span>
              {event.city} · {liveNow.clock}
            </span>
            <span className="flex items-center gap-1.5">
              <UserIcon className="size-4 text-neutral-400" />
              <span className="sr-only">In the room:</span>
              {formatCompact(liveNow.inRoom)}
            </span>
          </p>
        </div>
      </header>

      <section aria-labelledby="happening-heading" className="flex flex-col gap-3">
        <SectionLabel>
          <span id="happening-heading">What&apos;s happening</span>
        </SectionLabel>
        <ul className="flex flex-col gap-3">
          {liveNow.spaces.map((space) => (
            <li key={space.id}>
              <SpaceRow title={space.title} status={space.status} image={space.image} href={"href" in space ? space.href : undefined} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="noticing-heading" className="flex flex-col gap-3">
        <SectionLabel>
          <span id="noticing-heading">What are you noticing?</span>
        </SectionLabel>
        {/* All three open the noticing prompt (S16, M5) */}
        <ul className="grid grid-cols-3 gap-3">
          {liveNow.noticing.options.map((option) => (
            <li key={option}>
              <Link
                href={liveNow.noticing.href}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-neutral-800 px-3 text-sm font-medium text-neutral-200 transition-colors hover:bg-neutral-700 active:scale-98"
              >
                {option}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ReactionPicker
        question={liveNow.quickOne.question}
        reactions={liveNow.quickOne.reactions}
        responses={liveNow.quickOne.responses}
        href={liveNow.quickOne.href}
      />
    </div>
  );
}
