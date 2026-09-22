import type { Metadata } from "next";
import { CaptureScreen } from "@/components/live/CaptureScreen";
import { readViewState } from "@/lib/view-state";
import { prompts } from "@/mock/data";

export const metadata: Metadata = { title: "Capture a moment of light" };

// S15 Capture a Moment of Light (ex8). In from S13's Main Hall row; back → S13. Fixes: tab bar
// dropped (full-screen prompt, flow.md §1); green accents → primary; "THE ROOM IS ALIVE"
// script → Space Grotesk italic (Q10); headline in Anton. Capture stays here and puts your
// photo first in Recent responses (answered 2026-09-22).
export default async function LightPromptPage({ searchParams }: PageProps<"/live/prompts/light">) {
  const state = readViewState(await searchParams);
  const light = prompts.light;
  return (
    <CaptureScreen
      eyebrow={light.eyebrow}
      title={light.title}
      body={light.body}
      image={light.image}
      recent={light.recent}
      shared={light.shared}
      aside={light.aside}
      promptName="a moment of light"
      state={state}
      retryHref="/live/prompts/light"
    />
  );
}
