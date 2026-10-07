import { MeshBackdrop } from "@/components/glass/MeshBackdrop";
import { NoiseOverlay } from "@/components/glass/NoiseOverlay";

// The two background layers every glass screen gets, in order: drifting mesh blobs at the
// back, film grain above them, page content on top. Screens that already own a background
// (the live prompts) mount <NoiseOverlay> alone instead.
export function GlassScene() {
  return (
    <>
      <MeshBackdrop />
      <NoiseOverlay />
    </>
  );
}
