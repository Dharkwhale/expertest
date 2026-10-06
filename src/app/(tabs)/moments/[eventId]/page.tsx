import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DownloadIcon, ShareIcon } from "@/components/icons";
import { MeshBackdrop } from "@/components/glass/MeshBackdrop";
import { NoiseOverlay } from "@/components/glass/NoiseOverlay";
import { EnergyBars } from "@/components/moments/EnergyBars";
import { MemoryArtwork } from "@/components/moments/MemoryArtwork";
import { Timeline } from "@/components/moments/Timeline";
import { PromptNav } from "@/components/live/PromptNav";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";
import { UnavailableButton } from "@/components/ui/UnavailableButton";
import { readViewState } from "@/lib/view-state";
import { getEvent, momentsSummary } from "@/mock/data";

export const metadata: Metadata = { title: "Your memory" };

// Memory / artwork reveal: the Generate stage. No design exists (flow.md §3); built from
// existing parts only (Q1, 2026-09-22): CLAUDE.md §6.8 layout, ex19's art motif as the
// artwork, ex16's tag / journey / energy as the info. Share and Download have no feature yet →
// unavailable. In from S21; back → S21. Only events with a moments summary have a memory.
export default async function MemoryPage({ params, searchParams }: PageProps<"/moments/[eventId]">) {
  const [{ eventId }, query] = await Promise.all([params, searchParams]);
  const event = getEvent(eventId);
  if (!event || eventId !== momentsSummary.eventId) notFound();
  const state = readViewState(query);

  return (
    <div className="flex flex-col gap-6">
      {/* Glass trial round 3: the mesh replaces the blurred-artwork layer here */}
      <MeshBackdrop />
      <NoiseOverlay />
      <PromptNav kind="back" href="/moments" label="Back to Moments" />
      {state === "loading" ? (
        <SkeletonGroup label="your memory" className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-3/4" />
          <Skeleton className="h-64" />
        </SkeletonGroup>
      ) : state === "error" ? (
        <ErrorState what="your memory" retryHref={`/moments/${event.id}`} />
      ) : (
        <div className="flex flex-col gap-8">
          {/* Glass trial: the artwork sits BEHIND the panel. Mobile: the panel rides up over
              the artwork's bottom edge. lg: the artwork fills the block and the panel overlays
              its right edge. */}
          <section className="relative isolate lg:min-h-128">
            <div className="relative -mx-4 overflow-hidden md:mx-0 md:rounded-card lg:absolute lg:inset-0">
              <div className="aspect-3/4 sm:aspect-video lg:aspect-auto lg:h-full">
                <MemoryArtwork label={`Your generated memory of ${event.title}: soft violet and cyan light over a dark horizon`} />
              </div>
            </div>

            <div className="glass-card relative z-10 -mt-24 overflow-hidden rounded-card p-5 lg:mt-0 lg:ml-auto lg:w-[46%] lg:translate-x-6 lg:self-center lg:p-6">
              <span aria-hidden="true" className="glass-spec" />
              <header className="flex flex-col gap-2">
                <p className="flex items-center gap-3">
                  <span className="label-caps rounded-thumb border border-secondary/60 px-2 py-1 text-secondary">{momentsSummary.tag}</span>
                  <span className="text-sm text-neutral-200">{event.dateLabel}</span>
                </p>
                <p className="label-caps text-primary">{momentsSummary.memoryTitle}</p>
                <h1 className="font-display text-display uppercase">{event.title}</h1>
                {event.venue && <p className="text-neutral-200">{event.venue}</p>}
              </header>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <UnavailableButton label="Share memory" className="justify-center gap-2 rounded-full bg-primary px-5 font-medium text-ink">
                  <ShareIcon className="size-5" />
                  Share
                </UnavailableButton>
                <UnavailableButton label="Download memory" className="justify-center gap-2 rounded-full border border-neutral-50/25 px-5 font-medium text-neutral-50">
                  <DownloadIcon className="size-5" />
                  Download
                </UnavailableButton>
              </div>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <section aria-labelledby="memory-journey" className="flex flex-col gap-4">
              <h2 id="memory-journey" className="text-lg font-semibold text-neutral-50">
                Your journey
              </h2>
              <Timeline steps={momentsSummary.journey} />
            </section>

            <section aria-labelledby="memory-energy" className="flex flex-col gap-4">
              <h2 id="memory-energy" className="text-lg font-semibold text-neutral-50">
                Your energy
              </h2>
              <EnergyBars values={momentsSummary.energy} scale={momentsSummary.energyScale} />
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
