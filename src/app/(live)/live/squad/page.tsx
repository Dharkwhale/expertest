import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon, InfoIcon } from "@/components/icons";
import { PromptNav } from "@/components/live/PromptNav";
import { Avatar } from "@/components/ui/Avatar";
import { cardSurface } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { IconButton } from "@/components/ui/IconButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";
import { UnavailableButton } from "@/components/ui/UnavailableButton";
import { cx } from "@/lib/cx";
import { readViewState } from "@/lib/view-state";
import { squad, squadHub } from "@/mock/data";

export const metadata: Metadata = { title: "Squad" };

// S19 Squad Hub (ex26). In from S13's Squad row and S18 "Join them"; back → S13; "My rank
// within the squad" → S20. Fixes: "Name of our squad" → The Neon Nomads; my rank #3 → #4
// (ex26's top 3 has no Tope); Join / Create Squad hidden while in a squad (Q9, 2026-09-22);
// purple primary → lime, purple kept as the accent (2026-09-22); ex26's own tab bar → the
// canonical one (layout); "View all" and ⓘ have no screens → unavailable.
export default async function SquadHubPage({ searchParams }: PageProps<"/live/squad">) {
  const state = readViewState(await searchParams);
  const ranking = squadHub.rankingIds.flatMap((id) => squad.members.find((m) => m.id === id) ?? []);
  const inSquad = state !== "empty";

  return (
    <div className="flex flex-col gap-8">
      <header className="grid grid-cols-[2.75rem_1fr_2.75rem] items-center gap-3">
        <PromptNav kind="back" />
        <h1 className="text-center text-lg font-semibold">{inSquad ? squad.name : "Squad"}</h1>
        <IconButton label="About squads" icon={<InfoIcon />} unavailable />
      </header>

      {state === "loading" ? (
        <SkeletonGroup label="your squad" className="flex flex-col gap-4">
          <Skeleton className="mx-auto size-40 rounded-full" />
          <Skeleton className="h-24" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </SkeletonGroup>
      ) : state === "error" ? (
        <ErrorState what="your squad" retryHref="/live/squad" />
      ) : !inSquad ? (
        // Not in a squad: the state where ex26's Join / Create buttons belong (Q9). Neither
        // flow has a screen yet, so they stay unavailable.
        <div className="flex flex-col gap-3">
          <EmptyState message="You're not in a squad yet." />
          <UnavailableButton label="Join a squad" className="w-full justify-center rounded-full bg-neutral-800 font-medium text-neutral-50">
            Join a Squad
          </UnavailableButton>
          <UnavailableButton label="Create new squad" className="w-full justify-center rounded-full bg-primary font-medium text-ink">
            Create New Squad
          </UnavailableButton>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-8 text-center">
            <p className="max-w-xs text-xl font-semibold text-neutral-50">{squadHub.tagline}</p>
            <div className="relative size-40 overflow-hidden rounded-full border-2 border-tertiary shadow-glow">
              <Image src={squadHub.image} alt={squadHub.imageAlt} fill sizes="160px" className="object-cover" />
            </div>
          </div>

          <section aria-label="Squad synergy" className={cx(cardSurface, "flex flex-col gap-3 p-5")}>
            <p className="flex items-center justify-between gap-3">
              <span className="font-semibold text-neutral-50">Squad synergy</span>
              <span className="text-tertiary tabular-nums">{squadHub.synergy}%</span>
            </p>
            <ProgressBar value={squadHub.synergy} label="Squad synergy" tone="tertiary" />
            <Link
              href="/live/leaderboard"
              className="inline-flex min-h-11 items-center justify-between gap-2 text-sm text-neutral-400 hover:text-neutral-50"
            >
              My rank within the squad #{squadHub.myRank}
              <ChevronRightIcon className="size-4" />
            </Link>
          </section>

          <section aria-labelledby="within-heading" className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <h2 id="within-heading" className="text-lg font-semibold text-neutral-50">
                Within the squad
              </h2>
              <UnavailableButton label="View all squad members" className="label-caps text-tertiary">
                View all
              </UnavailableButton>
            </div>
            <ol className="flex flex-col gap-3">
              {ranking.map((member, index) => (
                <li key={member.id} className={cx(cardSurface, "flex items-center gap-4 rounded-full px-5 py-3")}>
                  <span className={cx("w-4 font-semibold tabular-nums", index === 0 ? "text-tertiary" : "text-neutral-400")}>
                    <span className="sr-only">Rank </span>
                    {index + 1}
                  </span>
                  <Avatar name={member.name} src={member.avatar} tone={member.tone} decorative />
                  <span className="font-medium text-neutral-50">{member.name}</span>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
    </div>
  );
}
