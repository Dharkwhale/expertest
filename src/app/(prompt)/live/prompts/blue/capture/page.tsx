import type { Metadata } from "next";
import { CaptureScreen } from "@/components/live/CaptureScreen";
import { readViewState } from "@/lib/view-state";
import { prompts } from "@/mock/data";

export const metadata: Metadata = { title: "Capture something blue" };

// S16 → "I found blue": ex8's capture layout with the blue prompt (flow.md §6). No design
// has blue responses or a count, so Recent responses starts empty and shows only your photo.
// All copy is ex24's. Back → the blue prompt.
export default async function BlueCapturePage({ searchParams }: PageProps<"/live/prompts/blue/capture">) {
  const state = readViewState(await searchParams);
  const blue = prompts.blue;
  return (
    <CaptureScreen
      eyebrow={blue.mode}
      title={`${blue.title} ${blue.highlight}`}
      body={`${blue.hint}.`}
      image={blue.image}
      recent={[]}
      promptName="something blue"
      backHref="/live/prompts/blue"
      backLabel="Back to the blue prompt"
      state={state}
      retryHref="/live/prompts/blue/capture"
    />
  );
}
