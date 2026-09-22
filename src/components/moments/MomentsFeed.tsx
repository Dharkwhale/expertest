"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { EnergyBars } from "@/components/moments/EnergyBars";
import { MemoryArtwork } from "@/components/moments/MemoryArtwork";
import { Timeline } from "@/components/moments/Timeline";
import { cardInteractive, cardSurface, stretchedLink } from "@/components/ui/card";
import { Chip } from "@/components/ui/Chip";
import { UnavailableButton } from "@/components/ui/UnavailableButton";
import { cx } from "@/lib/cx";

// ex16's filter chips + content. There's one experience in V1, so "All" and "Experiences"
// show the same thing (ex16 draws Experiences selected with every section visible);
// "Generative" narrows to the memory. "Saved" has no data or design → unavailable.
type Filter = "All" | "Experiences" | "Generative";

export function MomentsFeed({
  title,
  tag,
  arrivedAt,
  when,
  journey,
  energy,
  energyScale,
  memoryTitle,
  memoryHref,
}: {
  title: string;
  tag: string;
  arrivedAt: string;
  when: string;
  journey: readonly string[];
  energy: readonly number[];
  energyScale: readonly string[];
  memoryTitle: string;
  memoryHref: string;
}) {
  const [filter, setFilter] = useState<Filter>("Experiences");
  const showExperience = filter !== "Generative";

  return (
    <div className="flex flex-col gap-8">
      <div role="group" aria-label="Filter moments" className="-mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        {(["All", "Experiences"] as const).map((f) => (
          <Chip key={f} selected={filter === f} onClick={() => setFilter(f)}>
            {f}
          </Chip>
        ))}
        <UnavailableButton label="Saved" className="shrink-0 rounded-full bg-neutral-800 px-4 font-medium text-neutral-200">
          Saved
        </UnavailableButton>
        <Chip selected={filter === "Generative"} onClick={() => setFilter("Generative")}>
          Generative
        </Chip>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        {showExperience && (
          <div className="flex flex-col gap-8">
            {/* ex16 experience card: the art motif, tag, time, title; arrow → the memory */}
            <article className={cx(cardSurface, cardInteractive, "isolate overflow-hidden")}>
              <div className="relative flex aspect-2/1 flex-col justify-between p-5">
                <MemoryArtwork variant="card" className="absolute inset-0 -z-10" />
                <p className="flex items-center justify-between">
                  <span className="label-caps rounded-thumb border border-secondary/60 bg-neutral-950/60 px-2 py-1 text-secondary">{tag}</span>
                  <span className="text-sm text-neutral-200">{arrivedAt}</span>
                </p>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="font-display text-title uppercase">
                      <Link href={memoryHref} data-card-link className={stretchedLink}>
                        {title}
                      </Link>
                    </h2>
                    <p className="text-sm text-neutral-200">{when}</p>
                  </div>
                  <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-neutral-950/70 text-neutral-50">
                    <ArrowRightIcon className="size-5" />
                  </span>
                </div>
              </div>
            </article>

            <section aria-labelledby="journey-heading" className="flex flex-col gap-4">
              <h2 id="journey-heading" className="text-lg font-semibold text-neutral-50">
                Your journey
              </h2>
              <Timeline steps={journey} />
            </section>
          </div>
        )}

        <div className="flex flex-col gap-8">
          {showExperience && (
            <section aria-labelledby="energy-heading" className="flex flex-col gap-4">
              <h2 id="energy-heading" className="text-lg font-semibold text-neutral-50">
                Your energy
              </h2>
              <EnergyBars values={energy} scale={energyScale} />
            </section>
          )}

          {/* ex16 "Your memory is ready →" (Q1: opens the memory reveal) */}
          <article className={cx(cardSurface, cardInteractive, "flex items-center gap-4 p-3")}>
            <span className="relative size-20 shrink-0 overflow-hidden rounded-thumb">
              <MemoryArtwork />
            </span>
            <div>
              <Link href={memoryHref} data-card-link className={cx(stretchedLink, "font-semibold text-neutral-50")}>
                {memoryTitle}
              </Link>
              <ArrowRightIcon aria-hidden="true" className="mt-1 size-4 text-neutral-400" />
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
