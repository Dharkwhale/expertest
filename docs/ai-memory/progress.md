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

## 2026-09-22 — M5 Participate: prompts built (awaiting user checkpoint)

- **Done:** S14 Pocket Mode, S15 Capture a Moment of Light, S16 Find Something Blue (+ its capture step), S17 How Did That Feel?. S13's Quick One reactions now open S17. Verified:
  - tsc 0, eslint 0, 52 tests;
  - CDP shots at 375/768/1280 × 10 screen/state combos, none with horizontal overflow;
  - a 23-check scripted walk: every S13 entry into each prompt and back, a real file pick (a non-image refused; an image shown first from a blob: URL, count 486 → 487), the S16 timer ticking, and S14 Return / End experience;
  - keyboard probes on S13–S17.
- **Answered:**
  - Q7: any S13 reaction → S17, and a feeling or ✕ → S13.
  - ex25 "Don Jazzy" → @aura_pilot.
  - S15 capture stays on S15 with your photo first.
- **Design fixes (M5):**
  - ex21: zone → canonical venue; mono labels → label-caps; "Haptic cues only" unavailable.
  - ex8: tab bar dropped (full-screen prompt); green → primary; the script aside → Space Grotesk italic.
  - ex24: the "Live chamber" pill moved under the header (4 pills + ✕ don't fit at 375px); timer stops at 00:00.
  - ex25: ✕ added; grey/pink/salmon/navy → neutral-800/secondary/neutral-50; all headlines Anton.
- **Structure:** new `(prompt)` route group; `ReactionPicker` became links (no local state).
- **Docs updated:** flow.md (Q7 + two answers, S15/S17 rows), milestones.md (M5 ticked), architecture.md (2 decisions + map), gaps.md (GAP-008 widened), frontend-conventions.md (M5 patterns)
- **Gaps:** GAP-008 widened. None opened.
- **Next / open threads:** the user reviews the M5 PR and merges. M6 = Participate: squads (S18 squad notification as an in-app card per Q4 a, S19 Squad Hub, S20 Leaderboard). The Q9 squad half (hide Join/Create when already in a squad) is still open.

## 2026-09-22 — M4 Buy (USDC path) + Attend built (awaiting user checkpoint)

- **Done:** S09 Connect Wallet, S10 Confirm USDC, S13 Live Experience and the S12 notification card on Home, per `docs/plans/m4-usdc-attend.md` (D5–D9 all option a). Verified:
  - tsc 0, eslint 0, 52 unit tests (7 new: wallet allowlist, USDC route params, 16.50 total);
  - CDP full-page shots at 375/768/1280 × 13 screen/state combos, none with horizontal overflow;
  - a 25-check scripted walk: S06 → S07 (USDC) → S09 → MetaMask → S10 → Confirm → S11 → Enter Hub → /live, plus declined, a bad wallet, Cancel → S07 with USDC pre-selected, Home card → /live, and dismissal persisting.
- **Design fixes (M4):**
  - ex17: "General Access • Lagos Hall" → the ordered tier(s) + canonical venue; amounts computed; wallet logos → token monogram tiles.
  - ex11: "1X Nomad Access" → the ordered tier(s); Sound/Scape's subtitle → Neon Solstice's; gas line, "+0.0006 ETH" and "15 gwei" removed (Q8); network defaults to Base; "ID: #EXP-9920" dropped (it clashes with the S11 pass credential); "Checkout protocol" pill → "Step 3 of 3" to match ex17.
  - ex5: "North Pavilion" → Resonance Pavilion; ✕ → Pocket Mode; headline in Anton; green dots → primary; orange flame → neutral-50; reactions get accessible names (Flowing / Electric / Calm / Fiery; Electric and Calm reuse ex16's scale).
  - ex23: lock-screen chrome dropped; "starts in 30 minutes" → "is happening now" (D5); a ✕ dismiss added (D5 "dismissible").
- **Structure:** `/live` moved from `(tabs)` into a new `(live)` group (no footer, D9). `CheckoutHeader` gained `close`. `PayButton` gained `method`.
- **Process note:** `tsc` in the user's folder reports a stale `.next/types/validator.ts` entry for the old `(tabs)/live` path. The user's running dev server generated that file, and it clears on restart; the isolated build is the check.
- **Docs updated:** milestones.md (M4 ticked), architecture.md (4 decisions + system map), gaps.md (GAP-008 widened), frontend-conventions.md (M4 patterns), plan status
- **Gaps:** GAP-008 widened to /live, S09, S10. None opened.
- **Next / open threads:** the user reviews the M4 PR and merges. M5 = S14 Pocket Mode, S15/S16 prompts, S17 pulse; Q7 (reaction → ex25) is still open. S13's links to S14/S15/S16/S19 404 until then (D8).

## 2026-09-22 — M4 prep: Q2, Q4, Q8 answered; M4 plan drafted

- **Answered:**
  - Q2 (a): no check-in screen; the S11 pass barcode is the gate pass.
  - Q4 (a): lock-screen notifications (ex23, ex22) become in-app banners.
  - Q8: no gas line on S10; the network dropdown defaults to Base.
- **Done:**
  - Branch `feat/m4-attend`, stacked on `feat/site-footer` (that footer PR isn't merged yet).
  - Plan `docs/plans/m4-usdc-attend.md` drafted, with decisions D5–D9 open.
- **Design problems found while planning:**
  - ex5 "North Pavilion" isn't the canonical venue → Resonance Pavilion.
  - ex23 "starts in 30 minutes" contradicts Neon Solstice being live (D5).
  - ex11 "15 gwei" is a gas unit → dropped with the gas line.
- **Docs updated:** flow.md (Q2/Q4/Q8 answers, S12/S18/check-in rows), milestones.md (M4 lines)
- **Gaps:** none yet (GAP-008 will widen to S09/S10 when built)
- **Next / open threads:** the user answers D5–D9 and approves the plan, then build S09 → S10 → S13 → S12.

## 2026-09-22 — Site footer ("poster sign-off")

- **Done:** `SiteFooter` added (user request; the user picked the "poster sign-off" direction). It's shown on the tabs layout, the detail layout (S05) and `/welcome`, and not in checkout (a focused flow). Verified:
  - tsc 0, eslint 0, 45 tests;
  - headless CDP at 320/375/768/1280 on /welcome, /home, /explore and /events/neon-solstice: no horizontal overflow, the wordmark stays inside the gutters, and the last line clears the fixed bars (47px above the tab bar; 15px at 320 / 35px at 375 above S05's CTA bar).
- **Files:** `src/components/nav/SiteFooter.tsx`, `src/app/(tabs)/layout.tsx`, `src/app/(detail)/layout.tsx`, `src/app/(detail)/events/[eventId]/page.tsx`, `src/app/welcome/page.tsx`, `src/mock/data.ts` (`brand`), `src/app/globals.css`
- **Decisions:**
  - No design has a footer, so all copy is reused from existing screens (the ex19 brand line and ©, the ex2 tagline, the ex6 "Connected constellation" cities, the ex14 legal link names). Nothing was invented.
  - On phones the App column is dropped, because the bottom tab bar already carries those links.
  - Terms and Refund links use `UnavailableButton`, since neither screen exists yet (flow.md §3).
  - The mobile bottom padding that cleared fixed bars moved from the pages and layouts into the footer's `clearance` prop (`tabbar` | `cta` | `none`). Any new layout with a fixed bottom bar must pick one.
- **Docs updated:** frontend-conventions.md (`text-wordmark` token)
- **Gaps:** none
- **Next / open threads:** the user merged M3 (PR #2, `e837d52`), so the footer branch is one commit ahead of `main` and needs no rebase. The footer PR is waiting to be opened and merged by the user. M4 as below.

## 2026-09-21 — M3 Buy (card path) built (awaiting user checkpoint)

- **Done:** S06 Select Access, S07 Payment Method, S08 Review & Pay (card), S11 Purchase Confirmation / Pass, per `docs/plans/m3-buy-card.md`. Verified:
  - 45 unit tests, tsc 0, eslint 0;
  - `npm ci` + `next build` in an isolated copy (exit 0), leaving the user's dev server alone;
  - CDP shots at 375/768/1280 for every screen × states (ready, mixed order, loading, error, invalid URL, not on sale, declined);
  - Tab-order probes;
  - a scripted click walk Details → S06 → S07 → S08 → Pay → S11 asserting ₦90,000 (1 General + 1 VIP) at every step.
- **Design fixes (M3):**
  - ex9: "Stage 05" dropped; venue canonical; default qty 2 → 1; "persona" → "person".
  - ex14: add-on stepper removed (Q9); fee line removed (fees included); Tope Adebayo → Tope Banjo (+ ex14's email); North Pavilion → canonical.
  - ex20: "VIP Immersion" → the purchased tier; "Zone A…" → tier tagline; the unreadable "1.2K squad" is left out; the "Pass minted" pill only shows when a pass exists.
  - ex13: Card is the default method (ex13 pre-selects USDC).
  - Script accents → Space Grotesk italic.
  - Off-palette green/amber/pink → nearest tokens.
- **Bugs found by verification and fixed:**
  - Rapid stepper clicks read stale state (now a functional update + URL sync effect).
  - The mobile S08 bar was 255px (terms moved into the flow below lg).
- **Process incident:** the user's own `next dev` (:3000, same folder) was live while I ran `next build` at 18:28 (only my ports were checked). Their CSS was verified intact, the memory note was updated, and all M3 checks used their server read-only plus an isolated build copy.
- **Docs updated:** milestones.md (S06/S07/S08/S11 ticked), architecture.md (3 decisions), gaps.md, plan status
- **Gaps:** GAP-009 opened (pass from any valid URL, mock only). GAP-007 fixed (D4). GAP-001 now covers the checkout maths.
- **Next / open threads:** the user reviews the M3 PR and merges. M4 = S09 Connect Wallet, S10 Confirm USDC (Q8: gas line + default network), S12 pre-event notification (Q4), S13 Live Experience. Q2 (check-in) is still open.

## 2026-09-21 — M3 prep: Q9, Vitest, plan + decisions

- **Done:**
  - Branch `feat/m3-buy-card` created from the merged `main` (`c7c8da7`).
  - Vitest 5.0.1 installed; 14 tests pass. `@types/node` aligned to ^24.
  - `package-lock.json` regenerated once (npm bug cli#4828); diffed, direct deps unchanged.
  - M3 plan written: `docs/plans/m3-buy-card.md`.
- **Answered:**
  - Q9 (add-on half): remove the ex14 "Wristband Sync & Spatial Memory" stepper "for now".
  - Vitest approved (GAP-001 partially fixed).
  - M3 improvised parts (all option a):
    - D1: desktop = two columns + sticky summary/CTA.
    - D2: order carried in URL query params (validated; prices recomputed from mock data).
    - D3: Pay shows "Processing…" then the pass, plus a `?state=declined` review state.
    - D4 (GAP-007): events without tiers show "Tickets for {event} aren't on sale yet" on Select Access.
- **Correction to the entry below:** the user opened PR #1 and merged it themselves (merge `c7c8da7`). `gh` is installed but not logged in yet.
- **Docs updated:** flow.md (Q9), gaps.md (GAP-001), architecture.md (Vitest, lockfile rows)
- **Gaps:** GAP-001 partially fixed
- **Next / open threads:** get the go-ahead on the plan, then build S06 → S07 → S08 → S11 in that order, writing `lib/order.ts` + tests first.

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
