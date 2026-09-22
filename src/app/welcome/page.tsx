import type { Metadata } from "next";
import Image from "next/image";
import { LanderWorlds } from "@/components/lander/LanderWorlds";
import { MarkWelcomed } from "@/components/lander/MarkWelcomed";
import { SiteFooter } from "@/components/nav/SiteFooter";
import { ArrowRightIcon, GlobeIcon, SearchIcon, StarIcon } from "@/components/icons";
import { Wordmark } from "@/components/Wordmark";
import { ButtonLink } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { formatCount } from "@/lib/format";
import { readViewState } from "@/lib/view-state";
import { attendeePreview, getEvent, getEvents, lander } from "@/mock/data";

export const metadata: Metadata = { title: "Welcome" };

// S02 Lander / The World (ex6). First-visit front door: Splash → here → /home (Q3).
// Outside the (tabs) group: ex6's own World/Explore/Live/Moments bar is removed, and
// the Lander has no tab bar at all (flow.md §2).
export default async function WelcomePage({ searchParams }: PageProps<"/welcome">) {
  const state = readViewState(await searchParams);
  const spotlight = getEvent(lander.spotlightId);
  const stream = getEvents(lander.streamIds);

  return (
    <>
      <MarkWelcomed />

      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
        {/* ex6 logo: EXPER + lime dot. Stand-in type until the logo SVG exists (GAP-003). */}
        <p className="flex items-start gap-1">
          <Wordmark className="text-2xl" />
          <span aria-hidden="true" className="mt-1 size-2 rounded-full bg-primary" />
        </p>
        <div className="flex gap-2">
          <IconButton label="Search" icon={<SearchIcon />} unavailable />
          <IconButton label="Choose region" icon={<GlobeIcon />} unavailable />
        </div>
      </header>

      <main>
        {/* Mobile: the photo sits behind the copy, full-bleed. lg: split, copy left,
            photo right, contained and rounded at 420px (CLAUDE.md §6.4). */}
        <section aria-labelledby="lander-heading" className="relative isolate overflow-hidden">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:px-8 md:py-20 lg:grid-cols-2 lg:items-center lg:py-12">
            <div className="flex flex-col items-start gap-5">
              <p className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-primary/40 bg-neutral-950/70 px-3 py-1.5 text-xs text-neutral-200 backdrop-blur-sm">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
                <span className="label-caps text-primary">Live collective</span>
                <span aria-hidden="true">·</span>
                {formatCount(lander.inRoomGlobally)} in the room globally
              </p>
              <h1 id="lander-heading" className="font-display text-display uppercase">
                There is always something to <span className="text-primary">experience.</span>
              </h1>
              <p className="max-w-md text-neutral-200">
                Immersive gatherings, underground soundscapes, collective spatial art, and fleeting
                frequencies occurring across the planet.
              </p>
              <div className="flex w-full items-center gap-3 sm:w-auto">
                <ButtonLink href="/home" size="lg" className="flex-1 sm:flex-none">
                  Enter the world
                  <ArrowRightIcon className="size-5" />
                </ButtonLink>
                <IconButton label="Save to favourites" icon={<StarIcon />} unavailable className="size-14" />
              </div>
            </div>

            <div className="absolute inset-0 -z-10 lg:relative lg:inset-auto lg:z-auto lg:h-105 lg:overflow-hidden lg:rounded-card">
              <Image
                src={lander.heroImage}
                alt=""
                fill
                preload
                sizes="(min-width: 1024px) 36rem, 100vw"
                className="object-cover"
              />
              <span aria-hidden="true" className="absolute inset-0 bg-neutral-950/75 lg:hidden" />
            </div>
          </div>
        </section>

        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-4 pb-16 md:px-8 md:pb-20">
          {spotlight && (
            <LanderWorlds
              spotlight={spotlight}
              spotlightTags={lander.spotlightTags}
              stream={stream}
              activeWorlds={lander.activeWorlds}
              attendeeFaces={attendeePreview}
              state={state}
            />
          )}

          <section
            aria-labelledby="constellation-heading"
            className="flex flex-col items-center gap-3 rounded-card border border-neutral-800 bg-neutral-900 px-5 py-6 text-center"
          >
            <SectionLabel>
              <span id="constellation-heading">Connected constellation</span>
            </SectionLabel>
            <ul className="flex flex-wrap justify-center gap-x-3 gap-y-1 font-medium text-neutral-50">
              {lander.cities.map((city, index) => (
                <li key={city} className="flex items-center gap-3">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-neutral-500">
                      ·
                    </span>
                  )}
                  {city}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
