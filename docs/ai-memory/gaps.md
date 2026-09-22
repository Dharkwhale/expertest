# Gaps — known weaknesses ledger

> A living ledger of everything known to be weak: security holes, missing/weak tests,
> fragile edge cases, tech debt. Populated by the `audit-gaps` skill and by persisting
> `/security-review` and `/code-review` findings; updated the moment a new weakness is
> noticed mid-task. **A gap that isn't written here does not exist for the next session.**
>
> Rules:
> - Every gap needs evidence — a real `file:line`, never a hypothetical.
> - Severity reflects the priority order: security > code quality > architecture fit.
> - Fixed gaps move to **Closed** with date + commit; never delete them.
> - IDs are sequential (`GAP-001`, `GAP-002`, …) and never reused.

**Severity guide:** `critical` = exploitable or data-loss now · `high` = will bite users or block a release · `medium` = costs real time or risk if left · `low` = worth fixing opportunistically.

## Open

<!-- Newest gaps at top of their severity group. Keep critical/high at the top of the file. -->

### GAP-001 — No test runner or tests

- **Category:** tests
- **Severity:** medium
- **Location:** `package.json:5` (scripts are dev / build / start / lint; no test)
- **Found:** 2026-09-21, noticed during the M1 scaffold
- **Problem:** Nothing guards the behaviour a typecheck can't catch: nav active-state logic (`isActive` in `src/components/nav/nav-items.ts`), Modal open / close / backdrop handling, and, from M3, checkout maths (tier × quantity, fees-included ₦ totals, USDC conversion). A regression in any of those would only be caught by hand.
- **Fix:** Before M3 (payments), add Vitest + Testing Library. Ask first, because new libraries need approval under CLAUDE.md §5. Start with `isActive` and the price helpers. Verify with `npm test`.
- **Update 2026-09-21:** Vitest 5.0.1 approved and installed (`npm test`, `vitest.config.mts`, node environment, pure logic only). 14 tests cover `isActive`, `readViewState`, the format helpers and the mock-data helpers. **Still open:** the M3 checkout maths (tier × qty totals, USDC) must get tests as it's written. Testing Library wasn't requested, so there are no component tests.
- **Update 2026-09-21 (M3):** checkout maths is covered test-first: `src/lib/order.test.ts` (parsing hostile URL input, the 4-pass cap, the bundle = 4 rule, totals, USDC rounding, the round trip) and `src/lib/checkout.test.ts`. 45 tests pass. What remains is component-level tests (would need Testing Library, not approved).
- **Status:** partially fixed (logic covered; components not)

### GAP-009 — Any valid order URL renders a pass (no payment record)

- **Category:** security
- **Severity:** low (mock only; must be fixed before any real payments)
- **Location:** `src/app/(checkout)/events/[eventId]/pass/page.tsx:43` (`paid` = the URL has a valid order + a method)
- **Found:** 2026-09-21, M3 plan §3 (declared up front, accepted for V1)
- **Problem:** The pass page trusts the URL: `/events/neon-solstice/pass?general=1&method=card` shows a pass without anyone paying. That's fine in a no-backend mock, but a real build must never mint or show a pass from client-supplied state.
- **Fix:** When a backend exists, S08's Pay creates the order server-side and S11 loads `/pass/:orderId` from it (record the contract in api-integration.md first, CLAUDE.md §8 rule 3). Verify: a hand-typed pass URL shows OrderProblem.
- **Status:** open

### GAP-007 — Buy flow only exists for Neon Solstice; "Join experience" 404s until M3

- **Category:** architecture
- **Severity:** medium
- **Location:** `src/components/event-details/EventAside.tsx:93` (links to `/events/${id}/access`); `src/mock/data.ts` `lowestTier()` returns tiers only for `neon-solstice`
- **Found:** 2026-09-21, building S05
- **Problem:** Every event's Details page links to `/events/:id/access`. That route is built in M3 and 404s until then. After M3 it will still only have tiers for Neon Solstice: Sound/Scape, Art X, Midnight Drift and Solar Pulse have no ticket data in any design.
- **Fix:** In M3, ask the user what non-Neon events do: reuse the ex9 tiers, hide the CTA, or show "Tickets not on sale yet". Verify by clicking Join on `/events/sound-scape`.
- **Status:** fixed 2026-09-21 (M3). The user chose D4 (a): Select Access (and every later step) shows "Tickets for {event} aren't on sale yet" + an Explore link, via `resolveCheckout` → `not-on-sale` (`src/lib/checkout.ts`). Tested in `src/lib/checkout.test.ts`; screenshot-verified on `/events/sound-scape/access`. Move to Closed with the M3 merge commit.

### GAP-006 — No skip-to-content link

- **Category:** accessibility
- **Severity:** low
- **Location:** `src/app/layout.tsx:36` (body has no skip link); `src/app/(tabs)/layout.tsx:10`
- **Found:** 2026-09-21, ui-ux-pro-max review of M2 (`skip-links`)
- **Problem:** On md+ a keyboard user tabs through the 6 top-nav links before reaching page content on every screen.
- **Fix:** Add a visually hidden "Skip to content" link as the first child of `<body>`, targeting `id="main"` on each screen's `<main>`. Verify with a Tab probe: first stop = skip link, Enter moves focus into main.
- **Status:** open

### GAP-008 — `?state=` review switch makes routes render dynamically, and ships to production

- **Category:** tech-debt
- **Severity:** low
- **Location:** `src/lib/view-state.ts:11`; used by `src/app/(tabs)/home/page.tsx:26`, `explore/page.tsx:13`, `src/app/welcome/page.tsx:20`, `src/app/(detail)/events/[eventId]/page.tsx:27`, every `(checkout)` page, and (M4, 2026-09-22) `/live`, S09 `checkout/wallet`, S10 `checkout/crypto` (S10 also reads `?state=declined`), and (M5) `/live/pocket`, `/live/prompts/light`, `/live/prompts/blue/capture`, and (M6) `/live/squad`, `/live/leaderboard`
- **Found:** 2026-09-21, `next build` route table after M2
- **Problem:** Reading `searchParams` opts `/home`, `/explore`, `/welcome` and `/events/[eventId]` into on-demand rendering (M1 had them static). Anyone in production can also force the loading/error/empty UI. Harmless (values are allow-listed, no data is exposed), but it isn't product behaviour.
- **Fix:** Once a real data layer exists, derive state from it and delete `readViewState`. Or, before a public deploy, honour `?state` only when `process.env.NODE_ENV !== "production"`. Verify: the `next build` route table shows ○ for those routes.
- **Status:** open

### GAP-002 — Shared components not yet used by any screen

- **Category:** tests
- **Severity:** low
- **Location:** `src/components/ui/Modal.tsx:17`, `src/components/ui/Chip.tsx:20`, plus `Button.tsx`, `LiveBadge.tsx` and `AvatarStack.tsx` in the same folder
- **Found:** 2026-09-21, M1 checkpoint
- **Problem:** M1 introduces these per the milestone plan, but only Avatar, the nav and SectionLabel render on an M1 route. The rest are typechecked and linted, not seen in a browser. Modal's backdrop-click and focus-return behaviour in particular is unverified.
- **Fix:** Verify each one in the first milestone that uses it: Chip, LiveBadge, AvatarStack and Button in M2 (Home), Modal in M3 or M5. Screenshot at 375 and 1280, and keyboard-test Modal (Tab stays inside, Esc closes it, focus returns to the trigger).
- **Update 2026-09-21 (M2):** Chip, LiveBadge, AvatarStack, Button/ButtonLink and IconButton are now used on M2 screens and verified (375/768/1280 screenshots, Tab-order probes, chip click probes). **Only Modal remains unexercised.**
- **Status:** open

### GAP-003 — Wordmark is a stand-in; the real EXPER logo asset is missing

- **Category:** tech-debt
- **Severity:** low
- **Location:** `src/components/Wordmark.tsx:3`
- **Found:** 2026-09-21, while building S01
- **Problem:** ex2's logo is custom brush lettering, and there's no font or SVG for it in the repo, so the splash and top nav use Anton instead. That visibly differs from the design, and fonts can't be changed without asking (CLAUDE.md §1).
- **Fix:** Get the logo as an SVG from the designer, save it as `public/brand/exper-wordmark.svg`, and render it inside `Wordmark` with `aria-label="Exper"`. Every usage then updates at once.
- **Status:** open

### GAP-004 — No security response headers

- **Category:** security
- **Severity:** low
- **Location:** `next.config.ts:4` (no `headers()`)
- **Found:** 2026-09-21, M1 scaffold
- **Problem:** No CSP, `frame-ancestors`, `Referrer-Policy` or `Permissions-Policy`. The risk is low while V1 is static mock UI, but once it's deployed the Buy flow (card and wallet screens) makes clickjacking and injected scripts matter.
- **Fix:** Before any public deploy, add `async headers()` to `next.config.ts` with `frame-ancestors 'none'`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, and a CSP that allows `images.unsplash.com` for images. Verify with `curl -I`.
- **Status:** open

### GAP-005 — ESLint 9 is deprecated upstream

- **Category:** tech-debt
- **Severity:** low
- **Location:** `package.json:21`
- **Found:** 2026-09-21, from the `create-next-app` install warning (`eslint@9.39.5 ... no longer supported`)
- **Problem:** This major version gets no more security fixes. `npm audit` currently reports 0 vulnerabilities. In the user's lamiefoods project, ESLint is held at 9 because the React plugin breaks on 10.
- **Fix:** Move to ESLint 10 once `eslint-config-next` supports it. Check with `npm view eslint-config-next peerDependencies`, then upgrade and run `npm run lint`.
- **Status:** open

## Closed

<!-- Move entries here when fixed. Keep them — they document why the code is the way it is. -->

### <GAP-XXX — title>
- **Fixed:** <YYYY-MM-DD>, <commit hash / PR>
- **How:** <one line>
