import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { CountdownRing } from "@/components/live/CountdownRing";
import { PromptNav } from "@/components/live/PromptNav";
import { ButtonLink } from "@/components/ui/Button";
import { prompts } from "@/mock/data";

export const metadata: Metadata = { title: "Find something blue" };

// S16 Find Something Blue (ex24). In from S13's "What are you noticing?" chips. Out: "I found
// blue" → the capture layout with the blue prompt (flow.md §6); ✕ and "I'd rather just
// wander" → S13. Fixes: script aside and mono labels → Space Grotesk (Q10); headline in Anton.
export default function BluePromptPage() {
  const blue = prompts.blue;
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:my-8 md:min-h-0 md:rounded-card md:bg-neutral-900/40">
      {/* ex24 fits four pills and ✕ in one row; at 375px they don't, so the "Live chamber"
          status moves to a centred line below (placement only) */}
      <header className="flex items-center gap-2">
        <p className="label-caps rounded-full border border-neutral-800 px-3 py-2 text-neutral-400">{blue.number}</p>
        <p className="label-caps rounded-full border border-primary/60 px-3 py-2 text-primary">{blue.mode}</p>
        <PromptNav kind="close" className="ml-auto" />
      </header>
      <p className="label-caps mt-3 inline-flex items-center gap-1.5 self-center rounded-full border border-neutral-800 px-3 py-2 text-neutral-200">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
        {blue.chamber}
      </p>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10 text-center">
        <CountdownRing seconds={blue.seconds} />
        <p className="text-neutral-400 italic">{blue.aside}</p>
        <h1 className="font-display text-display uppercase">
          {blue.title}{" "}
          <span className="text-secondary underline decoration-2 underline-offset-8">{blue.highlight}</span>
        </h1>
        <p className="text-neutral-200">{blue.body}</p>
        <p className="flex items-center gap-2 text-sm text-neutral-400">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-secondary" />
          {blue.hint}
        </p>
      </div>

      <ButtonLink href="/live/prompts/blue/capture" size="lg" fullWidth>
        I found blue
        <ArrowRightIcon className="size-5" />
      </ButtonLink>
      <Link href="/live" className="mt-2 inline-flex min-h-11 items-center justify-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-50">
        I&apos;d rather just wander
        <ArrowRightIcon className="size-4" />
      </Link>
    </main>
  );
}
