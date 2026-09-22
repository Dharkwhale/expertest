import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";
import { UnavailableButton } from "@/components/ui/UnavailableButton";
import { readViewState } from "@/lib/view-state";
import { getEvent, liveNow, pocketMode } from "@/mock/data";

export const metadata: Metadata = { title: "Pocket mode" };

// S14 Pocket Mode (ex21): "stepping away while staying in" (flow.md §6). In from S13's ✕.
// Out: "Return to {event}" → S13, "End Experience" → S21 Moments. Fixes: zone "Main Hall &
// Resonance" → canonical venue; ex21's mono labels → Space Grotesk label-caps (Q10).
// "Haptic cues only" is a setting with no design for its states → unavailable.
export default async function PocketModePage({ searchParams }: PageProps<"/live/pocket">) {
  const state = readViewState(await searchParams);
  const event = state === "empty" ? undefined : getEvent(liveNow.eventId);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-linear-to-b from-tertiary/15 via-neutral-950 to-neutral-950 px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:my-8 md:min-h-0 md:rounded-card">
      {state === "loading" ? (
        <SkeletonGroup label="pocket mode" className="flex flex-1 flex-col gap-4">
          <Skeleton className="mx-auto h-8 w-48 rounded-full" />
          <Skeleton className="mt-auto h-40" />
          <Skeleton className="h-14 rounded-full" />
        </SkeletonGroup>
      ) : state === "error" ? (
        <ErrorState what="pocket mode" retryHref="/live/pocket" />
      ) : !event?.isLive ? (
        <EmptyState message="You're not in a live experience right now." action={{ label: "Back to Live", href: "/live" }} />
      ) : (
        <>
          <header className="flex flex-col items-center gap-3 text-center">
            <p className="label-caps rounded-full bg-neutral-950 px-4 py-2 text-primary">{pocketMode.audioSync}</p>
            <p className="label-caps inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-2 text-neutral-200">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
              {pocketMode.status}
            </p>
            <p className="label-caps text-neutral-400">{pocketMode.statusDetail}</p>
          </header>

          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
            <h1 className="font-display text-display uppercase">
              {pocketMode.title[0]}
              <br />
              {pocketMode.title[1]}
            </h1>
            <p className="text-lg text-neutral-400">{pocketMode.body}</p>
          </div>

          <section aria-label="Your session" className="flex flex-col gap-4 rounded-card border border-neutral-800 bg-neutral-900/80 p-4">
            <div className="flex items-center justify-between gap-3 border-b border-neutral-800 pb-3">
              <p className="min-w-0 truncate">
                <span className="font-display uppercase">{event.title}</span>
                <span className="label-caps text-neutral-400"> · {event.city}</span>
              </p>
              <LiveBadge />
            </div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="label-caps text-neutral-400">Active duration</p>
                <p className="mt-1 font-display text-3xl tabular-nums">{pocketMode.activeDuration}</p>
              </div>
              <div className="min-w-0 text-right">
                <p className="label-caps text-neutral-400">Zone / Chamber</p>
                <p className="mt-1 text-sm text-neutral-50">{event.venue}</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-between gap-2 border-t border-neutral-800 pt-3 text-xs text-neutral-400">
              <p className="flex items-center gap-1.5">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
                {pocketMode.radar}
              </p>
              <p>{pocketMode.autoCapture}</p>
            </div>
          </section>

          <ButtonLink href="/live" size="lg" fullWidth className="mt-4">
            Return to {event.title}
            <ArrowRightIcon className="size-5" />
          </ButtonLink>
          <div className="mt-2 flex items-center justify-between gap-4 text-sm text-neutral-400">
            <Link href="/moments" className="inline-flex min-h-11 items-center hover:text-neutral-50">
              End experience
            </Link>
            <UnavailableButton label={pocketMode.hapticLabel} className="hover:text-neutral-400">
              {pocketMode.hapticLabel}
            </UnavailableButton>
          </div>
          <p className="text-center text-xs text-neutral-400">{pocketMode.note}</p>
        </>
      )}
    </main>
  );
}
