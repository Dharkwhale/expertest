import type { Metadata } from "next";
import { ConstellationGraph } from "@/components/you/ConstellationGraph";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";
import { cx } from "@/lib/cx";
import { readViewState } from "@/lib/view-state";
import { constellation, type Tone } from "@/mock/data";

export const metadata: Metadata = { title: "You" };

// S22 Your Constellation, the "You" tab (ex18). In from the tab bar and Home's avatar. Fixes:
// off-palette node gradients → tokens; the people list, clipped off-screen in ex18, is laid
// out below the graph on mobile and beside it on lg; the two sparkle doodles are decorative.
// People rows are text only: no profile screens exist (flow.md §3).
const dots: Record<Tone, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
};

export default async function YouPage({ searchParams }: PageProps<"/you">) {
  const state = readViewState(await searchParams);
  const empty = state === "empty";

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-display uppercase">{constellation.title}</h1>
        <p className="max-w-md text-neutral-400">{constellation.intro}</p>
      </header>

      {state === "loading" ? (
        <SkeletonGroup label="your constellation" className="grid gap-8 lg:grid-cols-3">
          <Skeleton className="aspect-square lg:col-span-2" />
          <Skeleton className="h-64" />
        </SkeletonGroup>
      ) : state === "error" ? (
        <ErrorState what="your constellation" retryHref="/you" />
      ) : empty ? (
        <EmptyState message="Your constellation grows as you join experiences." action={{ label: "Find an experience", href: "/explore" }} />
      ) : (
        <div className="grid items-center gap-10 lg:grid-cols-3">
          <div className="relative mx-auto w-full max-w-lg lg:col-span-2">
            <ConstellationGraph nodes={constellation.nodes} edges={constellation.edges} />
            {/* ex18's sparkle doodles */}
            <svg aria-hidden="true" viewBox="0 0 24 24" className="absolute -top-4 right-4 size-10 text-primary">
              <path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>

          <section aria-labelledby="people-heading" className="flex flex-col gap-4">
            <h2 id="people-heading" className="label-caps text-neutral-400">
              People
            </h2>
            <ul className="flex flex-col gap-4">
              {constellation.people.map((person) => (
                <li key={person.handle} className="flex items-center gap-3">
                  <span aria-hidden="true" className={cx("size-9 shrink-0 rounded-full", dots[person.tone])} />
                  <span className="text-neutral-200">{person.handle}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
