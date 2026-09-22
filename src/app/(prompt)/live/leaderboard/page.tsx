import type { Metadata } from "next";
import Image from "next/image";
import { InfoIcon } from "@/components/icons";
import { PromptNav } from "@/components/live/PromptNav";
import { AvatarStack } from "@/components/ui/AvatarStack";
import { cardSurface } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { IconButton } from "@/components/ui/IconButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";
import { cx } from "@/lib/cx";
import { formatCount } from "@/lib/format";
import { readViewState } from "@/lib/view-state";
import { attendeePreview, getEvent, leaderboard, liveNow, type Tone } from "@/mock/data";

export const metadata: Metadata = { title: "Leaderboard" };

// S20 Event Leaderboard (ex27). In from S19 "My rank within the squad"; back → S19. No tab bar
// (flow.md §1). Fixes: "Name of the live event" → Neon Solstice; ex27's navy / periwinkle →
// neutral surfaces with lime for #1 (as M5 mapped ex25); squad photos → tone tiles; squad names
// kept as designed (Q6). ⓘ has no screen → unavailable.
const tiles: Record<Tone, string> = {
  primary: "border-primary/50 bg-primary/10 text-primary",
  secondary: "border-secondary/50 bg-secondary/10 text-secondary",
  tertiary: "border-tertiary/50 bg-neutral-950 text-tertiary",
};

export default async function LeaderboardPage({ searchParams }: PageProps<"/live/leaderboard">) {
  const state = readViewState(await searchParams);
  const event = getEvent(liveNow.eventId);
  const squads = state === "empty" ? [] : leaderboard.squads;
  const individuals = state === "empty" ? [] : leaderboard.individuals;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-8 px-4 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:my-8 md:min-h-0 md:rounded-card md:bg-neutral-900/40">
      <header className="grid grid-cols-[2.75rem_1fr_2.75rem] items-center gap-3">
        <PromptNav kind="back" href="/live/squad" label="Back to your squad" />
        <div className="text-center">
          <h1 className="text-lg font-semibold">Leaderboard</h1>
          <p className="label-caps text-primary">{event?.title}</p>
        </div>
        <IconButton label="About the leaderboard" icon={<InfoIcon />} unavailable />
      </header>

      {state === "loading" ? (
        <SkeletonGroup label="the leaderboard" className="flex flex-col gap-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="mt-6 h-18" />
          <Skeleton className="h-18" />
        </SkeletonGroup>
      ) : state === "error" ? (
        <ErrorState what="the leaderboard" retryHref="/live/leaderboard" />
      ) : (
        <>
          <section aria-labelledby="squads-heading" className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <h2 id="squads-heading" className="font-display text-title uppercase">
                Top squads leading
              </h2>
              <span className="label-caps inline-flex shrink-0 items-center gap-1.5 rounded-full border border-neutral-800 px-3 py-1 text-neutral-200">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
                Squads live
              </span>
            </div>
            {squads.length === 0 ? (
              <EmptyState message="No squads on the board yet." />
            ) : (
              <ol className="flex flex-col gap-2">
                {squads.map((s, index) => (
                  <li
                    key={s.id}
                    className={cx("flex items-center gap-4 rounded-card p-3", index === 0 ? "border border-primary/40 bg-neutral-900" : "")}
                  >
                    <span aria-hidden="true" className={cx("grid size-14 shrink-0 place-items-center rounded-thumb border font-display text-xl uppercase", tiles[s.tone])}>
                      {s.name.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-neutral-50">
                        <span className="sr-only">Rank {index + 1}: </span>
                        {s.name}
                      </p>
                      <p className="text-sm text-neutral-400 italic">{s.status}</p>
                    </div>
                    <div className="flex w-28 shrink-0 flex-col items-end gap-1">
                      <div className="flex w-full items-center gap-2">
                        <ProgressBar value={s.score} label={`${s.name} score`} tone={index === 0 ? "primary" : "neutral"} className="flex-1" />
                        <span className={cx("font-semibold tabular-nums", index === 0 ? "text-primary" : "text-neutral-200")}>{s.score}</span>
                      </div>
                      {"points" in s && <span className="text-xs text-neutral-400">{s.points}</span>}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section aria-labelledby="individuals-heading" className="flex flex-col gap-3">
            <div>
              <h2 id="individuals-heading" className="font-display text-title uppercase">
                Top individuals leading
              </h2>
              <p className="text-sm text-neutral-400">Leading individual spirits in this journey.</p>
            </div>
            {individuals.length === 0 ? (
              <EmptyState message="No one on the board yet." />
            ) : (
              <ol className="flex flex-col gap-3">
                {individuals.map((person, index) => (
                  <li
                    key={person.id}
                    className={cx(cardSurface, "flex items-center gap-4 p-3", "top" in person && "border-l-4 border-l-primary")}
                  >
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-neutral-800">
                      <Image src={person.avatar} alt="" fill sizes="48px" className="object-cover" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-neutral-50">
                        <span className="sr-only">Rank {index + 1}: </span>
                        {person.name}
                      </p>
                      {"top" in person && <p className="label-caps text-primary">Top contributor</p>}
                      <p className="label-caps text-neutral-400">{person.squad}</p>
                    </div>
                    <p className="text-right">
                      <span className="block text-lg font-semibold tabular-nums">{formatCount(person.essence)}</span>
                      <span className="label-caps text-neutral-400">Essence</span>
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <p className="mt-auto flex items-center gap-3 border-t border-neutral-800 pt-4 text-sm text-neutral-400">
            <AvatarStack images={attendeePreview.slice(0, 3)} />
            You are currently ranked #{leaderboard.myGatheringRank} in the gathering
          </p>
        </>
      )}
    </main>
  );
}
