// Glass trial round 3: film grain over the background layers, under the content. Inline
// feTurbulence, so no asset is fetched. Mounted per screen (not in the root layout) so the
// trial still touches only its two screens.
export function NoiseOverlay() {
  return (
    <svg aria-hidden="true" className="pointer-events-none fixed inset-0 z-[-5] size-full opacity-[0.03]">
      <filter id="glass-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#glass-noise)" />
    </svg>
  );
}
