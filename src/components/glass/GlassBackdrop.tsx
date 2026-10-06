import type { ReactNode } from "react";

// Glass trial (branch `glass-trial`): the surface the glass blurs. A scaled, heavily blurred
// copy of the screen's own hero image or artwork, fixed behind the scrolling page, with a dark
// gradient over it so text stays readable wherever the image is bright. Decorative: the real
// hero/artwork is still in the page. Used by the two trial screens only.
export function GlassBackdrop({ children }: { children: ReactNode }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 scale-125 opacity-35 blur-3xl">{children}</div>
      <div className="absolute inset-0 bg-linear-to-b from-neutral-950/60 via-neutral-950/55 to-neutral-950/85" />
    </div>
  );
}
