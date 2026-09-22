import type { Metadata } from "next";
import Link from "next/link";
import { ArrowsInIcon, BoltIcon, BurstIcon, DropIcon, InfinityIcon } from "@/components/icons";
import { PromptNav } from "@/components/live/PromptNav";
import { cx } from "@/lib/cx";
import { getEvent, liveNow, pulse } from "@/mock/data";

export const metadata: Metadata = { title: "How did that feel?" };

// S17 How Did That Feel? (ex25). In from any S13 Quick One reaction (Q7, 2026-09-22). Picking
// a feeling returns to S13 (mock: nothing is recorded); ✕ added, since ex25 has no exit
// (flow.md §6). Fixes: "Don Jazzy" → the ex10 host (answered 2026-09-22); headline in Anton;
// grey cards → neutral-800; pink / salmon / navy → tokens (see `pulse` in mock data).
const icons = { bolt: BoltIcon, burst: BurstIcon, drop: DropIcon, arrows: ArrowsInIcon, infinity: InfinityIcon };
const tones = { primary: "text-primary", secondary: "text-secondary", tertiary: "text-tertiary", neutral: "text-neutral-50" };

export default function PulsePage() {
  const host = getEvent(liveNow.eventId)?.details?.host.handle;
  // ex25: four square tiles, then Transcendental full width
  const grid = pulse.feelings.slice(0, 4);
  const wide = pulse.feelings[4];

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-linear-to-b from-neutral-950 via-primary/5 to-neutral-950 px-4 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:my-8 md:min-h-0 md:rounded-card">
      <div className="flex justify-end">
        <PromptNav kind="close" />
      </div>

      <div className="flex flex-1 flex-col justify-center gap-8 py-8">
        <header className="text-center">
          {host && (
            <p className="font-display text-title text-primary uppercase">
              {host} {pulse.performerLine}
            </p>
          )}
          <h1 className="mt-6 font-display text-display uppercase">{pulse.question}</h1>
        </header>

        {/* Each feeling is a way back to Live; the name is the accessible label */}
        <nav aria-label="Pick a feeling">
          <ul className="grid grid-cols-2 gap-4">
            {grid.map((feeling) => (
              <li key={feeling.id}>
                <Feeling feeling={feeling} />
              </li>
            ))}
            <li className="col-span-2">
              <Feeling feeling={wide} wide />
            </li>
          </ul>
        </nav>
      </div>
    </main>
  );
}

function Feeling({ feeling, wide }: { feeling: (typeof pulse.feelings)[number]; wide?: boolean }) {
  const Icon = icons[feeling.icon];
  return (
    <Link
      href="/live"
      className={cx(
        "flex items-center justify-center gap-3 rounded-card bg-neutral-800 p-5 transition-colors hover:bg-neutral-700 active:scale-98",
        wide ? "min-h-24 flex-row" : "aspect-square flex-col",
      )}
    >
      <Icon className={cx("size-9", tones[feeling.tone])} />
      <span className="label-caps text-neutral-200">{feeling.label}</span>
    </Link>
  );
}
