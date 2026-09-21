// Card surface + the M2 interaction decision (progress.md, 2026-09-21):
// hover steps the surface up one neutral and brightens the border, pressed = 0.98,
// focus = the global lime outline, drawn on the card when its stretched link has focus.
// Colour transitions only; the press scale snaps (no motion beyond the designs).
export const cardSurface = "rounded-card border border-neutral-800 bg-neutral-900";

export const cardInteractive =
  "relative transition-colors hover:border-neutral-500 hover:bg-neutral-800 " +
  "has-[[data-card-link]:active]:scale-98 " +
  "has-[[data-card-link]:focus-visible]:outline-2 has-[[data-card-link]:focus-visible]:outline-offset-2 has-[[data-card-link]:focus-visible]:outline-primary";

/**
 * Put on the card's one primary link: its ::after covers the whole card, so the card is
 * one click target without nesting other controls inside an <a>. Other controls in the
 * card sit above it with `relative z-10`.
 */
export const stretchedLink =
  "after:absolute after:inset-0 after:rounded-card after:content-[''] focus-visible:outline-none";
