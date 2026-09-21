"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { EventGridCard } from "@/components/events/EventGridCard";
import { ArrowRightIcon, BookmarkIcon } from "@/components/icons";
import { AvatarStack } from "@/components/ui/AvatarStack";
import { cardInteractive, stretchedLink } from "@/components/ui/card";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { IconButton } from "@/components/ui/IconButton";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";
import { cx } from "@/lib/cx";
import { formatCount } from "@/lib/format";
import type { ViewState } from "@/lib/view-state";
import { REALITIES, type ExperienceEvent, type Reality } from "@/mock/data";

// ex6 "Worlds & frequencies" chips + the spotlight and stream they filter.
// lg: spotlight 2/3 with the stream stacked in the 1/3 beside it (2 stream cards
// would leave an empty cell in a 3-column row).
export function LanderWorlds({
  spotlight,
  spotlightTags,
  stream,
  activeWorlds,
  attendeeFaces,
  state,
}: {
  spotlight: ExperienceEvent;
  spotlightTags: string[];
  stream: ExperienceEvent[];
  activeWorlds: number;
  attendeeFaces: string[];
  state: ViewState;
}) {
  const [reality, setReality] = useState<Reality | "all">("all");
  const matches = (event: ExperienceEvent) => reality === "all" || event.realities.includes(reality);
  const visibleStream = stream.filter(matches);
  const showSpotlight = matches(spotlight);

  return (
    <>
      <section aria-labelledby="worlds-heading" className="flex flex-col gap-3">
        <div className="flex min-h-11 items-center justify-between gap-4">
          <SectionLabel>
            <span id="worlds-heading">Worlds &amp; frequencies</span>
          </SectionLabel>
          <p className="label-caps text-primary">{activeWorlds} active</p>
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
          <Chip selected={reality === "all"} onClick={() => setReality("all")}>
            All Realities
          </Chip>
          {REALITIES.map(({ id, label }) => (
            <Chip key={id} selected={reality === id} onClick={() => setReality(id)}>
              {label}
            </Chip>
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
        <section aria-labelledby="spotlight-heading" className="flex flex-col gap-3 lg:col-span-2">
          <div className="flex min-h-11 items-center justify-between gap-4">
            <SectionLabel>
              <span id="spotlight-heading">Global resonance spotlight</span>
            </SectionLabel>
            <p className="label-caps text-neutral-400">Now vibrating</p>
          </div>

          {state === "loading" ? (
            <SkeletonGroup label="spotlight" className="lg:flex-1">
              <Skeleton className="aspect-4/3 w-full lg:aspect-auto lg:h-full lg:min-h-105" />
            </SkeletonGroup>
          ) : state === "error" ? (
            <ErrorState what="the spotlight" retryHref="/welcome" />
          ) : state === "empty" || !showSpotlight ? (
            <EmptyState
              message="Nothing is live in this world right now."
              action={{ label: "Explore upcoming events", href: "/explore" }}
            />
          ) : (
            <article
              className={cx(
                cardInteractive,
                "isolate flex aspect-4/5 flex-col justify-end overflow-hidden rounded-card border border-neutral-800 bg-neutral-900 sm:aspect-4/3 lg:aspect-auto lg:min-h-105 lg:flex-1",
              )}
            >
              <Image
                src={spotlight.heroImage}
                alt=""
                fill
                sizes="(min-width: 1024px) 44rem, 100vw"
                className="-z-10 object-cover"
              />
              <span aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-neutral-950 via-neutral-950/50 to-transparent" />

              <span className="label-caps absolute top-4 left-4 rounded-full border border-primary/70 bg-neutral-950/70 px-3 py-1 text-primary backdrop-blur-sm">
                Featured portal
              </span>
              <IconButton
                label="Save"
                icon={<BookmarkIcon />}
                unavailable
                className="absolute top-3 right-3 z-10"
              />

              <div className="flex flex-col gap-2 p-5 md:p-6">
                <h3 className="font-display text-title uppercase">
                  <Link href={`/events/${spotlight.id}`} data-card-link className={stretchedLink}>
                    {spotlight.title}
                  </Link>
                </h3>
                <p className="text-neutral-200">
                  Multi-city synchronized session <span aria-hidden="true">·</span>{" "}
                  <span className="text-primary">Tonight, {spotlight.timeLabel}</span>
                </p>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  {spotlight.attendingCount && (
                    <p className="flex items-center gap-2 text-neutral-200">
                      <AvatarStack images={attendeeFaces} max={3} />
                      {formatCount(spotlight.attendingCount)} going
                    </p>
                  )}
                  <p className="label-caps text-neutral-400">{spotlightTags.join(" · ")}</p>
                </div>
              </div>
            </article>
          )}
        </section>

        <section aria-labelledby="stream-heading" className="flex flex-col gap-3">
          <div className="flex min-h-11 items-center justify-between gap-4">
            <h2 id="stream-heading" className="label-caps flex items-center gap-2 text-neutral-400">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
              Live realities stream
            </h2>
            <Link
              href="/explore"
              className="inline-flex min-h-11 items-center gap-1 text-sm text-neutral-400 hover:text-neutral-50"
            >
              View all
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>

          {state === "loading" ? (
            <SkeletonGroup label="live stream" className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-6">
              <Skeleton className="aspect-2/3 lg:aspect-square" />
              <Skeleton className="aspect-2/3 lg:aspect-square" />
            </SkeletonGroup>
          ) : state === "error" ? (
            <ErrorState what="the live stream" retryHref="/welcome" />
          ) : state === "empty" || visibleStream.length === 0 ? (
            <EmptyState
              message="No live streams in this world yet."
              action={{ label: "Explore upcoming events", href: "/explore" }}
            />
          ) : (
            <ul className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-6">
              {visibleStream.map((event) => (
                <li key={event.id}>
                  <EventGridCard event={event} variant="stream" imageClassName="lg:aspect-video" />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
