import type { Metadata } from "next";
import { MomentsFeed } from "@/components/moments/MomentsFeed";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";
import { readViewState } from "@/lib/view-state";
import { getEvent, momentsSummary } from "@/mock/data";

export const metadata: Metadata = { title: "Moments" };

// S21 Moments (ex16; ex12 is its dropped duplicate). In from the tab bar, S11 and S14 "End
// experience". "Your memory is ready" and the experience card → the memory reveal (Q1).
// Fixes: ex12/ex16 icon mismatch resolved by the canonical tab bar (bookmark); the tag's
// off-palette cyan-on-navy → secondary; "Saved" unavailable (no data or design).
// Desktop: two columns on lg (experience + journey | energy + memory).
export default async function MomentsPage({ searchParams }: PageProps<"/moments">) {
  const state = readViewState(await searchParams);
  const event = state === "empty" ? undefined : getEvent(momentsSummary.eventId);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-display uppercase">Moments</h1>
      {state === "loading" ? (
        <SkeletonGroup label="your moments" className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="aspect-2/1" />
          <Skeleton className="h-40" />
        </SkeletonGroup>
      ) : state === "error" ? (
        <ErrorState what="your moments" retryHref="/moments" />
      ) : !event ? (
        <EmptyState message="No moments yet. They're made at live experiences." action={{ label: "Find an experience", href: "/explore" }} />
      ) : (
        <MomentsFeed
          title={event.title}
          tag={momentsSummary.tag}
          arrivedAt={momentsSummary.arrivedAt}
          when={event.isLive ? "Tonight" : event.dateLabel}
          journey={momentsSummary.journey}
          energy={momentsSummary.energy}
          energyScale={momentsSummary.energyScale}
          memoryTitle={momentsSummary.memoryTitle}
          memoryHref={`/moments/${event.id}`}
        />
      )}
    </div>
  );
}
