"use client";

import { useState } from "react";
import { EventGridCard } from "@/components/events/EventGridCard";
import { EventRowCard } from "@/components/events/EventRowCard";
import { FeaturedEventCard } from "@/components/explore/FeaturedEventCard";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";
import { UnavailableButton } from "@/components/ui/UnavailableButton";
import type { ViewState } from "@/lib/view-state";
import { CATEGORIES, type Category, type ExperienceEvent } from "@/mock/data";

// ex7 below the title: category chips, the city line, then Featured / Curated / For you.
// Picking a category swaps the three sections for one filtered grid (done-when, M2).
// Mobile keeps ex7's 2-column curated grid; lg goes to 3 (CLAUDE.md §6.2).
export function ExploreFeed({
  featured,
  curated,
  forYou,
  cities,
  attendeeFaces,
  state,
}: {
  featured?: ExperienceEvent;
  curated: ExperienceEvent[];
  forYou: ExperienceEvent[];
  cities: string[];
  attendeeFaces: string[];
  state: ViewState;
}) {
  const [category, setCategory] = useState<Category | "all">("all");
  const all = [...(featured ? [featured] : []), ...curated, ...forYou];
  const activeLabel = CATEGORIES.find(({ id }) => id === category)?.label;
  const results = all.filter((event) => category !== "all" && event.categories.includes(category));
  const nothingAtAll = state === "empty" || all.length === 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div
          role="group"
          aria-label="Filter by category"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
        >
          <Chip selected={category === "all"} onClick={() => setCategory("all")}>
            All
          </Chip>
          {CATEGORIES.map(({ id, label }) => (
            <Chip key={id} selected={category === id} onClick={() => setCategory(id)}>
              {label}
            </Chip>
          ))}
        </div>
        {/* Always mounted, so screen readers announce the count when the filter changes */}
        <p aria-live="polite" className="sr-only">
          {category === "all" || state !== "ready"
            ? ""
            : `${results.length} ${activeLabel} ${results.length === 1 ? "event" : "events"}`}
        </p>

        <div className="flex items-center justify-between gap-3 text-sm text-neutral-400">
          <p className="flex items-center gap-2">
            <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-secondary" />
            <span>
              Exploring across{" "}
              {cities.map((city, index) => (
                <span key={city}>
                  {index > 0 && <span aria-hidden="true"> · </span>}
                  <span className={index === 0 ? "text-neutral-50" : undefined}>{city}</span>
                </span>
              ))}
            </span>
          </p>
          <UnavailableButton label="Change city" className="font-medium text-primary">
            Change
          </UnavailableButton>
        </div>
      </div>

      {state === "loading" ? (
        <SkeletonGroup label="events" className="flex flex-col gap-8">
          <Skeleton className="aspect-4/3 w-full md:aspect-auto md:h-105" />
          <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-3">
            <Skeleton className="aspect-3/4" />
            <Skeleton className="aspect-3/4" />
            <Skeleton className="hidden aspect-3/4 lg:block" />
          </div>
        </SkeletonGroup>
      ) : state === "error" ? (
        <ErrorState what="events" retryHref="/explore" />
      ) : nothingAtAll ? (
        <EmptyState message={`No events in ${cities.join(", ")} yet.`} />
      ) : category !== "all" ? (
        <section aria-labelledby="results-heading" className="flex flex-col gap-3">
          <SectionLabel>
            <span id="results-heading">{activeLabel}</span>
          </SectionLabel>
          {results.length === 0 ? (
            <EmptyState
              message={`No ${activeLabel} events in ${cities.join(", ")} yet.`}
              action={{ label: "Show all events", onClick: () => setCategory("all") }}
            />
          ) : (
            <ul className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-3">
              {results.map((event) => (
                <li key={event.id}>
                  <EventGridCard event={event} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <>
          {featured && (
            <section aria-labelledby="featured-heading" className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <SectionLabel>
                  <span id="featured-heading">Featured</span>
                </SectionLabel>
                {featured.isLive && <p className="label-caps text-primary">Live tonight</p>}
              </div>
              <FeaturedEventCard event={featured} attendeeFaces={attendeeFaces} />
            </section>
          )}

          {curated.length > 0 && (
            <section aria-labelledby="curated-heading" className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <SectionLabel>
                  <span id="curated-heading">Curated &amp; happening</span>
                </SectionLabel>
                <UnavailableButton label="View map" className="text-sm font-medium text-primary">
                  View map
                </UnavailableButton>
              </div>
              <ul className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-3">
                {curated.map((event) => (
                  <li key={event.id}>
                    <EventGridCard event={event} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {forYou.length > 0 && (
            <section aria-labelledby="for-you-heading" className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <SectionLabel>
                  <span id="for-you-heading">For you / unexpected</span>
                </SectionLabel>
                <p className="text-sm text-neutral-400">Based on your mood</p>
              </div>
              <ul className="grid gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {forYou.map((event) => (
                  <li key={event.id}>
                    <EventRowCard event={event} showTag kicker="Curated listening" showChevron />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
