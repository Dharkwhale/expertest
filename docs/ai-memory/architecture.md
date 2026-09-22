# Architecture

> The mental model a senior engineer would hand a new hire: how this project is put
> together and **why** the big decisions were made. Maintained by the
> `document-architecture` skill; updated by `distill-session` when decisions change.
>
> **Status: M1 built (2026-09-21).** The system map below reflects the real tree after
> M1 (the scaffold, shell, nav, shared components and splash). Run `document-architecture`
> next to check this against the code and capture any "why" still missing.

## Mental model

Exper V1 is a live-experience platform built as a **UI-only prototype**. Every screen
belongs to one stage of a single journey: **Discover → Buy → Attend → Participate →
Generate → Remember**. The flow is the product; the logic of moving between stages matters
more than any single screen.

Source designs are 27 AI-generated Stitch exports in `designs/`. They're a strong
reference but may be wrong (misordered, duplicated, inconsistent). Fixing them is part of the job,
within the limits in CLAUDE.md §1.

There is no backend in V1. All data comes from one `mock/` layer, so data-driven views
still need loading / error / empty / success states, driven by that mock layer.

## System map

| Path | Owns | Notes |
|---|---|---|
| `src/app/layout.tsx` | root HTML, fonts, metadata, viewport | the only `<html>`/`<body>`; Anton + Space Grotesk via `next/font` |
| `src/app/globals.css` | **all design tokens** (`@theme`), `label-caps` and `bg-splash` utilities | Tailwind v4: there's no `tailwind.config.js`; default palette cleared |
| `src/app/page.tsx` | S01 Splash route `/` | outside `(tabs)`: no nav |
| `src/app/(tabs)/layout.tsx` | app shell: TopNav (md+), BottomTabBar (mobile), page container | wraps every screen that shows the tab bar |
| `src/app/(tabs)/{home,explore,moments,you}/page.tsx`, `(tabs)/moments/[eventId]/page.tsx` | 4 of the 5 tab routes + the memory reveal | home + explore (M2); Home shows the S12 card (M4); S21 Moments, S22 You and the memory reveal `/moments/:eventId` (M7, Q1) |
| `src/app/(live)/layout.tsx`, `(live)/live/page.tsx`, `(live)/live/squad/page.tsx` | S13 Live Experience `/live` (+ S18 card on top), S19 Squad Hub `/live/squad` | same nav as `(tabs)` but **no site footer** and a centred `max-w-md` column (§6.7) |
| `src/app/(prompt)/layout.tsx`, `(prompt)/live/{pocket,prompts/light,prompts/blue,prompts/blue/capture,pulse,leaderboard}` | S14–S17 + S20 full-screen live screens | no nav at all; each screen has its own back/✕ (`live/PromptNav`) to `/live`; centred `max-w-md` on desktop (§6.7) |
| `src/app/(checkout)/events/[eventId]/checkout/{wallet,crypto}/page.tsx` | S09 Connect Wallet, S10 Confirm USDC | M4 USDC path; same order-in-URL gate as the card path |
| `src/app/welcome/page.tsx` | S02 Lander: own header, no nav | first visit only (`lib/first-visit.ts`) |
| `src/app/(detail)/events/[eventId]/page.tsx` | S05 Event Details | the `(detail)` layout is TopNav only; the screen owns its bottom CTA |
| `src/components/live/` | M4: `SpaceRow`, `ReactionPicker`, `NotificationCard` (S12). M5: `PromptNav`, `CaptureScreen` + `CapturePrompt` (S15 and S16's capture step), `CountdownRing`. M6: `NotificationCard` became a shell (header, per-card dismiss, CTA) filled by `PreEventNotice` (S12) and `SquadNotice` (S18) | `ui/ProgressBar` added in M6 |
| `src/components/{events,explore,lander,event-details}/` | M2 screen pieces: event cards, Explore feed, Lander worlds, Details aside/story | shared cards live in `events/` |
| `src/components/nav/` | `nav-items.ts` (single tab list), `BottomTabBar`, `TopNav` | both navs render from the one list |
| `src/components/ui/` | shared primitives: Button/ButtonLink, IconButton, Chip, LiveBadge, Avatar, AvatarStack, SectionLabel, Modal | extract new shared UI here on first use |
| `src/components/moments/` | M7: `Timeline`, `EnergyBars`, `MemoryArtwork` (SVG art in tokens), `MomentsFeed` (filter chips) | |
| `src/components/you/` | M7: `ConstellationGraph` (static SVG) | |
| `src/components/` | screen-level pieces: `Splash`, `Wordmark`, `icons.tsx` | `PlaceholderScreen` deleted in M7 once every tab was real |
| `src/mock/data.ts` | **the only data source**: user, events, tiers, squad, moments | later milestones extend this file |
| `src/lib/` | `unsplash.ts` (image URL builder + allowed query), `cx.ts` | `next.config.ts` imports `UNSPLASH_SEARCH` |

**Route groups.** `(tabs)` holds screens with the tab bar. Full-screen flows (checkout
S06–S10, prompts S15–S17, Pocket Mode S14, Leaderboard S20) go in sibling groups with
their own layouts, even when they share a URL prefix (`/live` vs `/live/prompts/*`).

## Data flow

UI → `mock/` → render. No network calls, no persistence decided yet. If a real backend
is introduced, its contract goes in `api-integration.md` first and this section is rewritten.

## Key decisions

Append-only. Supersede with a new row; never delete.

| Date | Decision | Why | Alternatives rejected |
|---|---|---|---|
| 2026-09-21 | One responsive component per screen (base mobile, `md` 768, `lg` 1024) | Designs are mobile-only; one source of markup avoids desktop/mobile drift | Separate desktop components (duplicated markup) |
| 2026-09-21 | Mock data only, from a single `mock/` file | V1 is a UI prototype; no backend exists | Calling a real/stub API |
| 2026-09-21 | Mobile bottom tab bar → desktop top nav, no sidebar | Keeps the same nav items across breakpoints (CLAUDE.md §6.1) | Sidebar layout |
| 2026-09-21 | Colours, fonts and visual style can't change without asking; flow/order/labels may be fixed | Designs are the visual authority but not the flow authority | Free redesign |
| 2026-09-21 | Screen IDs (`S01`…) follow journey order, not design image numbers | Printed numbers on the designs collide and are out of order | Using `exN` numbers as IDs |
| 2026-09-21 | Screen status tracked only in `milestones.md`; `progress.md` logs decisions and fixes | Avoid two trackers drifting apart | Logging "built X" in both |

| 2026-09-21 | Next.js (App Router) + Tailwind CSS, TypeScript | User's choice (Q11); matches their other projects | Vite + React Router (proposed in Phase 0) |
| 2026-09-21 | Two fonts: Anton (headlines) + Space Grotesk (body and labels) | User asked for 2 of ex1's 3. Anton carries the poster-style brand voice; labels get a distinct style from uppercase + tracking instead of a third face | Keeping JetBrains Mono for labels; dropping Anton |
| 2026-09-21 | Mock data kept exactly as the canonical values in flow.md §5 | User's choice (Q6) | Renaming the handle / squads / lineup act |
| 2026-09-21 | Images from Unsplash only, served from `images.unsplash.com` via `next/image` | Unsplash license allows free use; hotlinking is what Unsplash's guidelines expect | Pinterest (unlicensed re-pins, unstable URLs) |
| 2026-09-21 | Icons are hand-written inline SVG components, not an icon package | CLAUDE.md §5 forbids new libraries without asking; the icon set is small | lucide-react / heroicons |
| 2026-09-21 | Route groups split tabbed screens from full-screen ones | flow.md says the tab bar shows on some routes and not others, even under the same path prefix (`/live` vs `/live/prompts/*`) | Toggling nav visibility per page |
| 2026-09-21 | Vitest 5 for unit tests of pure logic (`vitest.config.mts`, `src/**/*.test.ts`); `@types/node` ^20 → ^24 | User approved Vitest (M3 prep). Vitest 5 needs @types/node ≥22, and the machine runs Node 24, so ^20 was already wrong | Jest; `--legacy-peer-deps` |
| 2026-09-21 | `package-lock.json` regenerated once (M3 prep) | npm bug cli#4828 dropped Rolldown's Windows binary, so Vitest couldn't start. Diffed against main: direct deps unchanged except @types/node; typescript-eslint 8.70.0 → 8.70.1 | Adding the binary as a direct dependency (breaks Linux installs) |
| 2026-09-21 | `(checkout)` route group for S06–S11 (same `/events/:id/...` URLs): no tab bar, no top nav; each screen's own back/close header (`CheckoutHeader`) | A focused purchase flow; flow.md hides the tab bar there | Reusing `(detail)` (would show the top nav mid-checkout) |
| 2026-09-21 | The order lives in the URL (`?general=1&vip-soundscape=0&squad-bundle=0&method=card`), parsed by `lib/order.ts`; prices are always recomputed from `mock/data.ts`, never read from the URL | User's pick D2: survives refresh, deep-linkable for review, server-rendered, no new library. The URL is treated as hostile input (tested) | sessionStorage + client context |
| 2026-09-21 | One USDC rate for every tier (`NGN_PER_USDC` = 25000/16.5), replacing a per-tier `priceUsdc` | Only one canonical pair exists (flow.md §5); per-tier values would be invented | A USDC price per tier |
| 2026-09-21 | `(detail)` route group: top nav on md+, no tab bar, screen owns its bottom CTA | flow.md hides the tab bar on S05; desktop still needs a way out of a deep page | Putting details in `(tabs)` and hiding the bar per page |
| 2026-09-21 | Data states are per-section, reviewable via `?state=loading\|error\|empty` (`lib/view-state.ts`, allow-listed) | Mock data is synchronous, so non-ready states are otherwise unreachable for review (user's pick, M2). Cost: those 4 routes render dynamically (GAP-008) | Route-level `loading.tsx`/`error.tsx`; an artificial delay |
| 2026-09-21 | Back button uses an in-app route counter (`nav/NavigationTracker.tsx`), not `history.length` | `history.length` counts pre-app pages, so Back on a deep link left the site (reproduced in S05 verification) | `history.length > 1`; `document.referrer` |
| 2026-09-22 | The memory reveal (no design) is assembled from existing parts: §6.8 layout, `MemoryArtwork` = ex19/ex16's wave-and-dots motif as token-coloured SVG, info = ex16 data; Share/Download unavailable | User's pick Q1: complete the journey without inventing copy, data or features | Waiting for a design; a raster placeholder image |
| 2026-09-22 | ex19 Brand / Message not built | User's pick Q5: the site footer already carries its message; cream theme + brush script would need new tokens and a third font | An `/about` page |
| 2026-09-22 | `NotificationCard` is one shell for every in-app notification (S12, S18): per-card `storageKey` for session dismissal, content passed as children | Don't add a second pattern for a solved problem; ex22 and ex23 share the card chrome | Two separate card components |
| 2026-09-22 | `(prompt)` route group for S14–S17 (URLs under `/live/…`, next to `(live)/live`) | flow.md hides all nav on Pocket Mode and the prompts; a separate group keeps `/live` itself in the tab shell | Hiding nav per page inside `(live)` |
| 2026-09-22 | Capture is a native `<input type=file accept=image/* capture>`; the photo is shown from a local `blob:` URL (revoked on replace/unmount), never uploaded; non-images refused | V1 is mock-only (no backend), and the security bar says treat input as hostile; a blob URL can't carry script into the page | Uploading to a stub; reading the file as a data URL into state |
| 2026-09-22 | `(live)` route group for `/live`: TopNav + BottomTabBar, no `SiteFooter`, `max-w-md` column | User's pick D9 + D7: live is immersive like checkout; §6.7 phone-first on desktop | Keeping `/live` in `(tabs)` with the footer; a two-column desktop lobby |
| 2026-09-22 | USDC path is mock navigation only: no wallet SDK, no `window.ethereum`, no signing; fixed mock address; `?wallet=` allowlisted in `lib/wallet.ts` (D6); network is client state over an allowlist, default Base (Q8) | Security bar + V1 is mock-only; a wallet library would need approval and a real contract | A wallet SDK (wagmi/viem); carrying the network in the URL |
| 2026-09-22 | One `PayButton` for both paths (`method: "card" \| "usdc"` picks the copy) | Don't add a second pattern for a solved problem (D3's processing/declined flow) | A separate USDC confirm button |
| 2026-09-22 | S12 notification is an in-app card on Home, dismissible per browser session via `sessionStorage` + `useSyncExternalStore` | Q4 a + D5 a: a website can't draw on the lock screen; dismissal is a per-viewer convenience | Fake lock-screen route; `localStorage` (would hide it forever) |
| 2026-09-21 | Controls whose screen doesn't exist render as designed but `aria-disabled` (`UnavailableButton`, `IconButton unavailable`) | User's pick, M2: keeps design fidelity, no dead clicks, announced as "not available yet" | Hiding them; dimming them |
| 2026-09-21 |  route group: top nav on md+, no tab bar, screen owns its bottom CTA | flow.md hides the tab bar on S05; desktop still needs a way out of a deep page | Putting details in  and hiding the bar per page |
| 2026-09-21 | Data states are per-section and reviewable via  (, allow-listed) | Mock data is synchronous, so non-ready states are otherwise unreachable for review (user pick, M2) | Route-level /; an artificial delay |
| 2026-09-21 | Back button uses an in-app route counter (), not  |  counts pre-app pages, so a deep link's Back left the site (reproduced) | ;  |
| 2026-09-21 | Controls with no screen render as designed but  (, ) | User pick, M2: keeps design fidelity without dead clicks; announced as "not available yet" | Hiding them; dimming them |

## Gotchas (non-obvious things that will bite you)

- `designs/ex1.png` is the **design-system sheet**, not a screen. Tokens come from it.
- 26 screen images collapse to **23 unique screens** after merging duplicates (`docs/flow.md`).
- The **Generate** stage has **no designs at all**. Don't build it without an answer to Q1.
- Lock-screen notification designs (ex22, ex23) can't be real OS lock screens on the web (Q4).
- **Tailwind 4.3 auto-detection skipped ** (no classes generated from it, dev or build).  now has . Don't remove it; every M3 checkout route lives under .
- The dev server caches Tailwind's file list: classes in a brand-new file may not appear until the server restarts.
- **Tailwind 4.3's auto-detection skipped `src/app/(detail)/events/[eventId]/`**: no classes from it were generated, in dev or build. `globals.css` has `@source "../app";` to fix it. Don't remove it: every M3 checkout route lives under `[eventId]`.
- The dev server caches Tailwind's file list. Classes in a brand-new file can be missing until the dev server restarts; check the compiled CSS before debugging layout.
- React Strict Mode runs effects twice in dev. Module-level counters must count *changes*, not effect runs (see `NavigationTracker`).
- Claude never runs git write commands in this repo (CLAUDE.md §3). It suggests commit messages only.

## Glossary

| Term | Meaning |
|---|---|
| Journey stage | One of Discover / Buy / Attend / Participate / Generate / Remember |
| `S01`…`S23` | Canonical screen IDs, in journey order (defined in `docs/flow.md`) |
| `exN` | Source design image `designs/exN.png` |
| M1…M7 | Milestones in `docs/milestones.md` |
| Squad | Group of attendees during live participation |
