# Exper V1 — Milestones

Screen IDs and routes are defined in [flow.md](flow.md). Tick each `[ ]` when the screen is
built and has been checked at 375px and 1280px.

Every data-driven view also gets loading / error / empty states, driven by the mock layer.

---

## M1 — Foundation
**Screens**
- [x] S01 Splash (ex2): `/`

**Introduces**
- Project scaffold (Next.js App Router + Tailwind, Q11) with Tailwind theme tokens from ex1: colours, fonts (Anton + Space Grotesk, Q10), radius, spacing
- App shell: page container `max-w-6xl mx-auto px-4 md:px-8`
- Nav: mobile bottom tab bar → desktop top nav (Home · Explore · Live · Moments · You)
- Shared: `Button` (primary/secondary/inverted/outlined), `IconButton`, `Chip`, `LiveBadge`, `Avatar`, `AvatarStack`, `SectionLabel`, `Modal` (sheet on mobile → centered `max-w-lg` on desktop)
- `mock/data` (single file): user, events, tiers, squad, moments, following the canonical values in flow.md §5

**Done when:** `/` shows the splash and auto-advances. The shell and nav switch between placeholder pages for all 5 tabs at 375px and 1280px.

---

## M2 — Discover
**Screens**
- [x] S02 Lander / The World (ex6): `/welcome` (Q3: kept, first visit only)
- [x] S03 Home (ex3): `/home`
- [x] S04 Explore (ex7): `/explore`
- [x] S05 Event Details (ex10): `/events/:eventId`

**Introduces:** `EventCard` (hero / grid / compact variants), `FilterChips`, `StickyCTA` (mobile bottom bar → desktop sticky right card), `DetailHero`

**Done when:** Splash → Lander → Home → any event card → Event Details works, and Explore's category chips filter the grid.

---

## M3 — Buy (card path)
**Screens**
- [x] S06 Select Access (ex9): `/events/:eventId/access`
- [x] S07 Payment Method (ex13): `/events/:eventId/checkout`
- [x] S08 Review & Pay, card (ex14): `/events/:eventId/checkout/card`
- [x] S11 Purchase Confirmation / Pass (ex20): `/events/:eventId/pass`

**Introduces:** `TierCard`, `QtyStepper`, `RadioCard`, `OrderSummary`, checkout state (tier + qty carried through the flow), `PassCard`

**Done when:** Event Details → Select Access → Card → Review & Pay → "You're in" works, and the tier, quantity and total match on every step.

---

## M4 — Buy (USDC path) + Attend
**Screens**
- [x] S09 Connect Wallet (ex17): `/events/:eventId/checkout/wallet`
- [x] S10 Confirm Payment, USDC (ex11): `/events/:eventId/checkout/crypto` (Q8: no gas line, network defaults to Base)
- [x] S12 Pre-event notification (ex23): in-app card at the top of `/home` (Q4 a, D5 a)
- [x] S13 Live Experience (ex5): `/live`

**Introduces:** `StepIndicator`, `WalletOption`, `NotificationCard`, `SpaceRow` (live space list), `ReactionPicker`

**Done when:** the USDC path reaches the same confirmation as the card path, and "Enter Hub" / "Open Exper" land on Live Experience. No check-in screen: the S11 pass barcode is the gate pass (Q2 a).

---

## M5 — Participate: prompts
**Screens**
- [ ] S14 Pocket Mode (ex21): `/live/pocket`
- [ ] S15 Capture a Moment of Light (ex8): `/live/prompts/light`
- [ ] S16 Find Something Blue (ex24): `/live/prompts/blue`
- [ ] S17 How Did That Feel? (ex25): `/live/pulse` (pending Q7)

**Introduces:** `PromptLayout` (phone-first, centered `max-w-md` on desktop), `CaptureButton` (file input, mock only, no upload), `CountdownRing`

**Done when:** from Live Experience you can open each prompt and get back. Pocket Mode opens from ✕ and returns, and "End Experience" goes to Moments.

---

## M6 — Participate: squads
**Screens**
- [ ] S18 Squad notification (ex22): pending Q4
- [ ] S19 Squad Hub (ex26): `/live/squad`
- [ ] S20 Event Leaderboard (ex27): `/live/leaderboard`

**Introduces:** `ProgressBar`, `RankRow`, `MemberRow`

**Done when:** Live Experience → Squad row → Squad Hub → Leaderboard works and backs out cleanly, with squad names consistent across all three.

---

## M7 — Generate & Remember
**Screens**
- [ ] S21 Moments (ex16): `/moments`
- [ ] S22 Your Constellation (ex18): `/you`
- [ ] Memory / artwork reveal: **not designed** (Q1), built only if approved
- [ ] S23 Brand / Message (ex19): pending Q5

**Introduces:** `Timeline`, `EnergyBars`, `ConstellationGraph` (static SVG)

**Done when:** Pocket Mode "End Experience" → Moments → "Your memory is ready" completes the journey, and the You tab shows the constellation.

---

## Before M1 can start
✅ Q6, Q10 and Q11 answered 2026-09-21 (see flow.md "Open questions"). M1 is unblocked. The other
questions can wait until their milestone.
