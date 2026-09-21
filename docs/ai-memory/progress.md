# Progress log

> Running task log, **newest first**. Written by the `log-progress` skill after every
> completed task. Purpose: a fresh session (any model) reads the top few entries and
> knows exactly where the project stands — what just happened, what's mid-flight, and
> what's next. Keep entries short; depth belongs in the other docs.

<!-- Entry template — copy to the TOP of the log:

## YYYY-MM-DD — <task title>

- **Done:** <what shipped, 1–3 bullets>
- **Files:** <key files touched>
- **Decisions:** <any decision made — if architectural, it ALSO goes in architecture.md>
- **Docs updated:** <which memory docs were updated, or "none needed">
- **Gaps:** <new GAP-IDs opened / closed, or "none">
- **Next / open threads:** <what a fresh session should pick up>
-->

## 2026-09-21 — Git workflow set up: GitHub repo + per-milestone PRs

- **Done:** Remote `origin` = github.com/Dharkwhale/expertest. `main` holds one empty base commit (`0b13c99`, the user's choice, so the first PR had a base). M1 + M2 are committed on `feat/m2-discover` with a PR into `main`. M1 was never committed separately, so it's in the same branch.
- **Decisions:** The user replaced CLAUDE.md §3's "never commit". Per milestone: a new branch named for the work, then push, then `gh pr create` into `main`. Never push to or merge `main`; the user merges. `gh` was installed via winget; the user runs `gh auth login` once.
- **Docs updated:** CLAUDE.md §3 (workflow rule)
- **Gaps:** none
- **Next / open threads:** the user merges the M2 PR, then M3 branches from the updated `main` (`git switch main && git pull` first).

## 2026-09-21 — M2 Discover built (awaiting user checkpoint)

- **Done:** S02 Lander, S03 Home, S04 Explore, S05 Event Details.
  - Verified: tsc 0, eslint 0, `next build` exit 0.
  - CDP shots at 375/768/1280 for every screen × ready/loading/error/empty: 0 overflow, 0 broken images.
  - Keyboard Tab probes and chip-filter click probes.
  - End-to-end flow on the prod build: `/` → `/welcome` → Home → card → Details → Back.
- **Design fixes** (the "what I changed and why" lines, CLAUDE.md §1):
  - Lander: ex6 22:00 → 8:00 PM; "1,840 connected" → canonical 1,240 going; Midnight Drift shows Apr 18, not LIVE.
  - Quote handle is `@mara` (M1 misread `@maia`).
  - ex7 "Join Pulse" → "Join experience".
  - ex10 "Experience 04" dropped; its venue → canonical; price label → "From ₦25,000" (tiers go to ₦85,000).
  - Pink Nightlife tag → tertiary (not in the palette).
  - Solar Pulse added to Explore's curated grid, so lg has no empty cell.
- **Decisions:**
  - Explore category tags per event are my mapping (ex7 doesn't say): Neon Solstice music+art, Sound/Scape music, Art X art, Midnight Drift music, Solar Pulse art+tech. Talks/Food are empty by design.
  - Mobile curated grid is 2 columns because ex7 shows it (design beats §6.2's single column on mobile).
  - Lander lg: stream in a 1/3 rail beside the spotlight (2 cards can't fill a 3-column row).
  - Details lg: price + CTA sit above the facts so the action is above the fold.
  - Architecture rows added: `(detail)` group, `NavigationTracker`, `@source`, `?state`.
- **Skill overrides:** listed in the entry below. `impeccable` was not installed, so its audit/polish was done manually against the ui-ux-pro-max checklist. That pass produced:
  - contrast fixes (neutral-500 text 4.17:1 → neutral-400; solid tag backgrounds);
  - `cursor: pointer` on buttons;
  - 44px hit areas on chips and icon buttons;
  - a valid list structure in the facts card;
  - an `aria-live` count for the Explore filter.
- **Files:** `src/app/{welcome,(detail)}/**`, `src/app/(tabs)/{home,explore}/page.tsx`, `src/components/{events,explore,lander,event-details}/**`, `src/components/ui/{card.ts,Skeleton,ErrorState,EmptyState,UnavailableButton,IconButton,Chip}.tsx`, `src/components/nav/{BackButton,NavigationTracker}.tsx`, `src/lib/{view-state,format,first-visit}.ts`, `src/mock/data.ts`, `src/app/globals.css`
- **Docs updated:** milestones.md (S02–S05 ticked), flow.md (Q3 answer, lineup host), architecture.md (4 decisions + 2 gotchas), frontend-conventions.md (`rounded-thumb`, M2 patterns), gaps.md
- **Gaps:** opened GAP-006 (no skip link), GAP-007 (Buy flow is Neon-only; Join 404s until M3), GAP-008 (`?state` makes 4 routes dynamic). GAP-002 updated (only Modal still unexercised).
- **Next / open threads:** the user reviews the M2 checkpoint and commits. M3 (Buy, card path) needs Q9 (the ex14 add-on stepper) and the plan-first rule for anything touching checkout (CLAUDE.md §8 rule 4).

## 2026-09-21 — M2 Discover: improvised-part decisions (user picked, before build)

- **Q3 answered: keep the ex6 Lander at `/welcome`.** Splash → `/welcome` on first visit only (remembered per browser), then `/home`. ex6's own World/Explore/Live/Moments nav is removed. Data fixes: "Tonight, 22:00" → 8:00 PM (canonical), and the "No tickets. No waiting lines." line is dropped because it contradicts the Buy flow. Solar Pulse is added to the mock data (from ex6). The app-screenshot collages are replaced with Unsplash photos.
- **Lineup host = `@aura_pilot`** (ex10 upscaled, matches ex18). flow.md §5's `@sonic_pilot` was a Phase 0 misread and has been corrected.
- **Desktop layouts:**
  - Lander: split, with headline + CTA on the left and the featured image on the right.
  - Home: live hero 2/3 + "Up next" rail 1/3.
  - Explore: §6.2 grid.
  - Event Details: §6.3 two columns plus a sticky CTA card.
- **Data states:** per-section and in place. Static skeletons shaped like the real content (no shimmer), an inline error panel with Retry, and one empty line plus an Explore link. Reviewable via `?state=loading|error|empty`.
- **Interaction:** hover steps the surface up one neutral (900→800) and brightens the border. Pressed = scale 0.98. Focus = the existing lime outline. Colour transitions only.
- **Controls with no screen** (bell, filter, map, "Change" city, "View map"): rendered as in the design but as real disabled buttons (`aria-disabled`, "Not available yet" title, no hover). Flagged, not built.
- **Skill overrides (user precedence rule):** design-taste-frontend rules ignored where they conflict with the designs/CLAUDE.md:
  - icon libraries / no hand-rolled SVG
  - Motion/GSAP and the motion dials
  - font picks
  - the mandatory light+dark mode (the designs are dark-only)
  - the eyebrow cap, overlay pills, status dots and the city strip (ex3/ex7 have all of these)
  - the "no avatar row in hero" ban
  
  `impeccable` is not installed (not in `.claude/skills`, `.agents/skills` or `~/.claude/skills`), so its audit/polish pass was done manually against ui-ux-pro-max + the fidelity checklist.

## 2026-09-21 — M1 Foundation built (awaiting user checkpoint)

- **Done:** Next.js 16.3.5 + Tailwind v4 scaffold; tokens from ex1/ex2 in `globals.css`; app shell with mobile bottom tab bar → md+ top nav; 8 shared components; `src/mock/data.ts`; S01 Splash auto-advancing to `/home`; placeholder pages for all 5 tabs.
- **Verified:** `tsc` 0 errors, `eslint` clean, `next build` passes (all routes static). Real-viewport screenshots at 375 / 768 / 1280 via CDP; splash advances `/` → `/home`; no horizontal overflow at any width. The image allow-list returns 200 for the pinned Unsplash URL and 400 for another host or query string.
- **Design fixes:** Primary button = lime (all real CTAs are lime; ex1's white swatch was the outlier). Pill buttons (ex3/ex9). Moments = bookmark icon, Live = radio waves (flow.md §5).
- **Answered questions:** Q11 → Next.js + Tailwind. Q10 → Anton + Space Grotesk, JetBrains Mono dropped (labels use the `label-caps` utility). Q6 → mock data kept as-is. Images: Unsplash only (Pinterest excluded: unlicensed).
- **Flagged, not fixed:** the lineup in flow.md §5 says `@sonic_pilot`, but ex10 and ex18 show `@aura_pilot`. Resolve in M2 (S05). No mock data was written for the lineup yet.
- **Files:** `src/**`, `next.config.ts`, `package.json`, `AGENTS.md` (+ `@AGENTS.md` import added to line 1 of CLAUDE.md)
- **Docs updated:** milestones.md (S01 ticked), flow.md (Q6/Q10/Q11 answers), architecture.md (system map + 6 decisions), frontend-conventions.md (full token table), gaps.md
- **Gaps:** opened GAP-001 (no tests), GAP-002 (shared components not yet exercised), GAP-003 (logo asset missing), GAP-004 (no security headers), GAP-005 (ESLint 9 deprecated)
- **Next / open threads:** User reviews the M1 checkpoint and commits (Claude does not commit here). Then run document-architecture and audit-gaps (CLAUDE.md §8 rule 7). M2 needs Q3 answered (keep the `/welcome` Lander?) before S02.

## 2026-09-21 — AI memory kit installed

- **Done:** Kit installed (11 files). Existing CLAUDE.md kept as-is; §8 appended with memory-doc pointers, the tracking split and the kit rules. `architecture.md` seeded from decisions already in CLAUDE.md.
- **Files:** `CLAUDE.md`, `docs/ai-memory/*`, `.claude/skills/*`
- **Decisions:** `milestones.md` is the only screen-status tracker; this log records decisions, design fixes and answered questions.
- **Docs updated:** architecture.md (seed), progress.md
- **Gaps:** none yet, since there's no code to audit
- **Next / open threads:** Answer Q6, Q10 and Q11 in `docs/flow.md` (they block M1). Then build M1: scaffold, and fill `frontend-conventions.md` tokens from `ex1`. After the scaffold, run document-architecture then audit-gaps.
