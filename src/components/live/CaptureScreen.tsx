import Image from "next/image";
import { CapturePrompt } from "@/components/live/CapturePrompt";
import { PromptNav } from "@/components/live/PromptNav";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";
import type { ViewState } from "@/lib/view-state";

// ex8's layout: a photo header fading into the prompt, the capture button, recent responses.
// Used by S15 (light) and by S16's "I found blue" step (flow.md §6: S15 layout, blue prompt).
// ex8's tab bar is dropped: flow.md hides it on the full-screen prompts.
export function CaptureScreen({
  eyebrow,
  title,
  body,
  image,
  recent,
  shared,
  aside,
  promptName,
  backHref,
  backLabel,
  state = "ready",
  retryHref,
}: {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  recent: readonly string[];
  shared?: number;
  aside?: string;
  promptName: string;
  backHref?: string;
  backLabel?: string;
  /** Review switch for Recent responses (?state=loading|error|empty, GAP-008) */
  state?: ViewState;
  retryHref: string;
}) {
  return (
    <main className="mx-auto w-full max-w-md pb-[max(2rem,env(safe-area-inset-bottom))] md:py-8">
      <div className="relative isolate flex min-h-96 flex-col justify-between overflow-hidden px-4 pt-4 pb-6 md:rounded-card">
        <Image src={image} alt="" fill preload sizes="(min-width: 768px) 28rem, 100vw" className="-z-20 object-cover" />
        <span aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-neutral-950/40 via-neutral-950/60 to-neutral-950" />
        <PromptNav kind="back" href={backHref} label={backLabel} />
        <div className="mt-40 flex flex-col gap-3">
          {/* ex8's green "PLAY" is off-palette → primary */}
          <p className="label-caps text-primary">{eyebrow}</p>
          <h1 className="font-display text-display uppercase">{title}</h1>
          <p className="text-neutral-200">{body}</p>
        </div>
      </div>
      <div className="px-4 pt-4">
        {state === "loading" ? (
          <SkeletonGroup label="recent responses" className="flex flex-col items-center gap-10">
            <Skeleton className="size-20 rounded-full" />
            <Skeleton className="h-24 w-full" />
          </SkeletonGroup>
        ) : state === "error" ? (
          <ErrorState what="recent responses" retryHref={retryHref} />
        ) : (
          // empty: no one has responded yet, so only the capture button shows until you do
          <CapturePrompt
            recent={state === "empty" ? [] : recent}
            shared={state === "empty" ? undefined : shared}
            aside={aside}
            promptName={promptName}
          />
        )}
      </div>
    </main>
  );
}
