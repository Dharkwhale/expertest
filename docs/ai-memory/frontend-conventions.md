# Frontend Conventions — design tokens + design fidelity

> The visual system of this project. Components use tokens, never magic numbers. When a
> design needs a value that has no token, **add the token here first**, then use it.
> Designs are Stitch PNG exports in `designs/` (not Figma); `ex1.png` is the design system.

## Design tokens

**Token source of truth:** `src/app/globals.css` (`@theme` blocks). Edit there, then mirror here.
Tailwind's default colour and font palettes are **cleared** (`--color-*: initial`,
`--font-*: initial`), so a colour or font that isn't a token doesn't generate a class.

### Color

| Token | Value | Source | Use for |
|---|---|---|---|
| `primary` | `#D2FF00` | ex1 | CTAs, active tab, selected chips, live badge, focus ring |
| `secondary` | `#00D2FF` | ex1 | accents, info icons |
| `tertiary` | `#8B5CF6` | ex1 | accents, avatar orbs |
| `ink` | `#08080C` | ex1 | text on `primary` / `inverted` surfaces |
| `neutral-950` | `#08080C` | ex1 + sampled ex16 | app background |
| `neutral-900` | `#131418` | sampled ex3 tab bar | bars, sheets, raised surfaces |
| `neutral-800` | `#1F2128` | sampled ex3 | chips, secondary buttons, icon buttons |
| `neutral-700` | `#2A2B30` | sampled ex3 card | hover on 800 |
| `neutral-500` | `#6F727D` | sampled ex3 | outlines |
| `neutral-400` | `#9A9CA5` | derived | muted text, labels, inactive tabs |
| `neutral-200` | `#D4D5DA` | derived | secondary text on dark, hover borders |
| `neutral-50` | `#F5F5F7` | derived | primary text |
| `splash-violet` / `olive` / `teal` / `rose` / `ember` / `deep` | `#8B23AB` `#789B1B` `#0E6567` `#C5515A` `#C94829` `#290A14` | sampled ex2 | splash gradient only (`bg-splash` utility) |

"Sampled" means read from the design's pixels with `sharp`. "Derived" means the value isn't
visible in any design and was chosen to complete the scale; re-check derived values as screens are built.

### Typography (Q10: two faces)

| Token | Value | Use for |
|---|---|---|
| `font-display` | Anton 400 (`next/font`, `--font-anton`) | headlines, titles (uppercase) |
| `font-sans` | Space Grotesk variable (`--font-space-grotesk`) | body **and** labels |
| `text-hero` | `clamp(3.5rem, 2.4rem + 5.5vw, 7rem)` | splash wordmark |
| `text-display` | `clamp(2.25rem, 1.6rem + 3.2vw, 4rem)` | screen titles |
| `text-title` | `clamp(1.625rem, 1.3rem + 1.6vw, 2.5rem)` | section and modal titles |
| `text-wordmark` | `clamp(5rem, 36vw, 27rem)`, line-height 0.8 | site footer "EXPER" sign-off only; 36vw makes the Anton word (~2.5em wide) span the content width. Verified no overflow at 320–1280 (2026-09-22) |
| `label-caps` (utility) | Space Grotesk 600, 11px, uppercase, 0.14em tracking | labels, buttons, tags (replaces ex1's JetBrains Mono) |
| body | 14px mobile → 16px from `md` | set on `body` in globals.css |

### Radii / shadows / breakpoints

| Token | Value | Use for |
|---|---|---|
| `rounded-card` | `1.25rem` | cards, sheets, desktop modal |
| `rounded-full` | Tailwind | buttons, chips, badges, avatars (pill shape, ex3/ex9) |
| `rounded-thumb` | `0.75rem` | thumbnails inside cards (ex3, ex7) |
| `shadow-glow` | 28px lime glow at 30% | primary CTA |
| spacing | Tailwind default 0.25rem scale | all gaps and padding |
| breakpoints | base = mobile · `md` 768 · `lg` 1024 | CLAUDE.md §5 |

## Component conventions

- One component per file, named export, PascalCase. Shared UI goes in `src/components/ui/`,
  navigation in `src/components/nav/`, screen-level pieces in `src/components/`.
- Class joining: `cx()` from `src/lib/cx.ts` (no clsx, because new libraries need approval).
- Buttons: `Button` (a `<button>`) and `ButtonLink` (a Next `<Link>`) share `buttonClasses()`.
  Primary is a lime pill: every real CTA in the designs is lime, overriding ex1's white "Primary" swatch.
- Icons: inline SVGs in `src/components/icons.tsx`, `aria-hidden`. Give the *control* the
  accessible name (`IconButton` requires `label`). Canonical tab icons: bookmark = Moments, radio waves = Live.
- Images: Unsplash only, built with `unsplash(id)` from `src/lib/unsplash.ts` and rendered with
  `next/image`. `next.config.ts` allows exactly that host and query string, so a hand-written URL returns 400.
  Use the default quality: Next 16 only allows `75` unless `images.qualities` is changed.
- Motion: none beyond what a design shows. `prefers-reduced-motion` neutralises all
  animation and transition globally (globals.css).
- Focus: a global `:focus-visible` lime outline. Modal uses native `<dialog>` + `showModal()`.
- The tab bar and the top nav render from one list (`nav/nav-items.ts`). Change tabs there only.

### Patterns added in M2 (reuse them, don't add a second way)

- **Clickable cards:** `cardSurface` + `cardInteractive` from `ui/card.ts`. The card's one link gets `data-card-link` and `stretchedLink`, so its `::after` covers the card. Other controls in the card need `relative z-10`, and image/scrim layers go at `-z-10` inside an `isolate` card. The focus ring is drawn on the card via `has-[[data-card-link]:focus-visible]`.
- **Interaction states** (user's pick): hover = surface one neutral step up + brighter border; pressed = `scale-98`, which snaps; focus = the global lime outline. Colour transitions only.
- **Data states:** `Skeleton`/`SkeletonGroup` (static, shaped like the real content), `ErrorState` (inline, Retry is a link), `EmptyState` (one line plus a link or button action). Force them with `?state=loading|error|empty`.
- **No-screen controls:** `UnavailableButton` (text) / `IconButton unavailable`. They look as designed, are `aria-disabled`, and are announced "(not available yet)".
- **Touch targets:** interactive elements are ≥44px. `IconButton` is `size-11`; chips grow their hit area with `after:-inset-y-1`.
- **Contrast** (measured): `neutral-500` text is 4.17:1 on 950, so use it for decorative separators only. `tertiary` text needs a solid `neutral-950` background (4.72:1).
- **Type scale:** Tailwind's default `text-sm`…`text-2xl` for card-level text; the `clamp()` tokens for screen and section titles.
- **Hero images:** full-bleed on mobile, `md:h-105` (420px) + `rounded-card` from md. Use `preload` (Next 16 replaced `priority`) on the LCP image only.

### Patterns added in M4 (reuse them)

- **Checkout headers:** `CheckoutHeader` takes `close` for screens with back *and* ✕ (ex17). `StepIndicator` is the "● Step n of 3" pill on the USDC path.
- **Pay step:** `PayButton method="card" | "usdc"`. Never build a second processing/declined button.
- **Icon-only choices** (ex5 reactions): native radios drawn as tiles, with an `sr-only` name for each (`ReactionPicker`), like `RadioCard`.
- **Brand logos** (wallets): monogram tiles in palette tokens, never copied logos.
- **Off-palette design colours** stay mapped to the nearest token: ex5 green "Live" dots → `primary`; ex5 orange flame → `neutral-50`.
- **Dismissible notices:** `sessionStorage` read through `useSyncExternalStore` (server snapshot = visible). Wrap storage in try/catch.

### Patterns added in M5 (reuse them)

- **Full-screen live screens** go in `(prompt)`: `PromptNav` (back/✕ to `/live`) + a `max-w-md` main with `min-h-dvh` on mobile, `md:my-8 md:rounded-card` on desktop.
- **Photo capture:** `CaptureScreen` (ex8 layout) + `CapturePrompt`. Native file input with `accept="image/*" capture`, a local `blob:` URL (revoke it), `<img>` only for blob URLs (next/image can't optimise them). Never upload in V1.
- **Timers** (`CountdownRing`): count in text once per second, stop at zero, no ring animation unless a design shows one.
- **Handwritten asides** (ex8, ex24): Space Grotesk italic, as M3's ex9 asides.

### Patterns added in M6 (reuse them)

- **In-app notifications:** `NotificationCard` shell with a unique `storageKey`; the body is children (see `PreEventNotice`, `SquadNotice`). Two-line header (app · channel, then tag + time) so nothing truncates at 375px.
- **Progress / scores:** `ui/ProgressBar` (`role="progressbar"`, 0–100). Lime for the leader or primary metric, `tertiary` for squad synergy, `neutral` for the rest.
- **Ranked lists:** `<ol>` with an `sr-only` "Rank n" prefix; the number is visual only.

### Patterns added in M7 (reuse them)

- **Generated art:** `MemoryArtwork` (SVG, token fills, `variant="poster" | "card"`). Give it `label` when it's the subject (the reveal); leave it decorative inside cards.
- **Static data-viz:** `EnergyBars` and `ConstellationGraph` are decorative drawings with a text alternative (figcaption / scale labels). SVG geometry, including `fontSize`, uses SVG attributes, not Tailwind arbitrary values.
- **Filter chips with no data behind one option** ("Saved"): render it as an `UnavailableButton` styled like a chip, not a chip that leads to a fake empty list.

## Design → code fidelity checklist

1. **Inventory before coding:** layout, spacing, type, colours, radii, states shown.
   The PNGs are small, so upscale crops with `sharp` to read text, and sample colours from pixels.
2. **Map every value to a token.** If nothing is within tolerance, add a token above first.
3. **Build structure first, then style.** Semantic HTML, then visual polish.
4. **All states:** hover, focus-visible, active, disabled, loading / error / empty.
5. **Responsive pass** at 375 / 768 / 1280 per CLAUDE.md §6 and the global fluid rules.
6. **Visual diff:** take headless Chrome screenshots using CDP device emulation. Plain
   `--window-size` gives wrong layouts below about 500px. Compare to the design, fix, repeat.
7. **Human-reported errors:** fix exactly what was pointed at, then re-run the diff.
