# M3 — Buy (card path): plan

Status: **approved and built 2026-09-21** (decisions D1–D4 all option a) (CLAUDE.md §8 rule 4: plan first for checkout, even when mocked).
Branch: `feat/m3-buy-card`. Screens: S06, S07, S08, S11 (flow.md §1). The USDC path (S09, S10) is M4.

**Done when** (milestones.md): Event Details → Select Access → Card → Review & Pay → "You're in"
works, and the tier, quantity and total match on every step.

## 1. Flow and routes

```
S05 /events/:id ──Join──▶ S06 /events/:id/access ──Proceed──▶ S07 /events/:id/checkout
                                                               │ Card ──Continue──▶ S08 /events/:id/checkout/card ──Pay──▶ S11 /events/:id/pass
                                                               │ USDC ──Continue──▶ S09 /events/:id/checkout/wallet   (M4; 404 until then)
S08 "Change" payment ──▶ S07 · S08 "Switch to crypto" ──▶ S07 with USDC selected · S11 ✕ ──▶ /home
S11 "Enter Neon Solstice Hub" ──▶ /live (M4 placeholder) · "View in Moments & Tickets" ──▶ /moments (M7 placeholder)
```

New route group `(checkout)` under the same URLs: no tab bar and no top nav (a focused
flow). Each screen has its own back / close header from its design.

## 2. The order: one source of truth, carried in the URL (pending decision D2)

`src/lib/order.ts` (pure, unit-tested):

- **Shape:** `{ eventId, lines: [{ tierId, qty }], method?: "card" | "usdc" }`.
  In the URL: `?general=1&vip-soundscape=0&squad-bundle=0&method=card`.
- **`parseOrder(eventId, searchParams)`:** treats input as hostile.
  - Only known tier ids.
  - Quantities are whole numbers 0–4.
  - At most 4 passes in total (ex9 "Max 4 passes / person"; a Squad Bundle counts as 4).
  - Anything invalid → the page shows the order-error state and a link back to Select Access. Nothing is silently fixed.
- **Prices are never read from the URL.** Totals are always recomputed from `mock/data.ts` tiers.
- **`orderTotals(order)`:** returns line totals, ₦ total, pass count and ≈ USDC.
  - The USDC rate comes from the canonical pair ₦25,000 ≈ 16.50 USDC (1 USDC = ₦1,515.15…).
  - The per-tier `priceUsdc` field goes away, so every tier converts the same way.
- **Fees are included** (flow.md §5; ex9 "all fees incl."), so there's no fee line anywhere.

Tests (Vitest), written alongside:
- parse: valid order, unknown tier, negative / decimal / huge qty, over 4 passes, repeated params, missing params;
- totals: single tier, mixed tiers, bundle counting as 4, USDC rounding to 2 dp;
- serialize → parse round trip.

## 3. Screens: design fixes and states

### S06 Select Access (ex9)
- **Fixes:**
  - "Stage 05" removed (flow.md §4).
  - Venue "Main Hall & Sound Pavilions" → canonical.
  - Default quantity 2 → **1× General Access** (flow.md §5 demo path).
  - "Max 4 passes / persona" → "/ person".
  - Share → unavailable.
- **Behaviour:**
  - Steppers on all three tiers, as designed, so mixed orders are allowed.
  - `+` is disabled at the 4-pass cap, with the reason announced ("Max 4 passes").
  - The total says "Total (N passes)".
  - Proceed is disabled at 0 passes.
- **Script accents** ("the room is alive!", "almost full tonight!") are handwritten in a font we don't have (Q10: two fonts only). They'll render in Space Grotesk italic in lime; flagged, not dropped.
- **States:**
  - loading: tier-card skeletons;
  - error: inline, with Retry;
  - empty: events with no tiers → "Tickets for {event} aren't on sale yet." (pending decision D4).

### S07 Payment Method (ex13)
- The summary card shows the order (tier line(s), ₦ total).
- Radio cards: Card / Bank and USDC ("Zero gas"). The default is **Card** (this milestone's path); ex13 pre-selects USDC.
- Continue routes by method. The lock icon is decorative, not a control.
- **States:** an invalid order → the order-error state.

### S08 Review & Pay, card (ex14; ex15 dropped as a duplicate)
- **Fixes:**
  - Venue "North Pavilion" → canonical.
  - Tier = what was picked on S06, not "Full Spectrum Pass ₦32,500".
  - The **"Wristband Sync & Spatial Memory" add-on is removed** (Q9, 2026-09-21).
  - The "Protocol & Spatial Sync Fee ₦2,500" line is removed (fees included).
  - Attendee "Tope Adebayo" → canonical **Tope Banjo**, with email `tope@exper.io` from ex14 (the only source).
  - CTA "Confirm pass · Pay ₦{total}".
- **Unavailable** (no screen): attendee "Edit", Terms and Refund Policy links.
- **Wired:** "Change" → S07. "Switch to crypto" → S07 with USDC selected.
- The card shown ("Mastercard •••• 4821 · Secured via Paystack") is **display-only mock text**. No card fields, no card data, no payment SDK.
- **Pay:** feedback per pending decision D3, then → S11.

### S11 Purchase Confirmation / Pass (ex20)
- **Fixes:**
  - Tier "VIP Immersion" → the purchased tier (for mixed orders, one pass card per line, marked "×qty").
  - The "Zone A + Sub-Bass Rig" line → that tier's tagline.
- **Credential and barcode:** the credential (`EXP-9042-SOL` style) and pass number are deterministic mock values. The barcode is a decorative SVG generated from the credential (`aria-hidden`); the credential text carries the meaning.
- **Controls:**
  - unavailable: Add to Wallet, Squad Invite, the "…" menu;
  - wired: ✕ → /home, Enter Hub → /live, View in Moments & Tickets → /moments.
- **Mock limit:** a pass URL with valid order params always renders a pass (there's no real payment record). Logged as a gap; acceptable in a mock with no backend.

## 4. Shared components introduced (milestones.md M3)
`QtyStepper` (accessible: labelled −/+ buttons, `aria-live` quantity), `TierCard`, `RadioCard`
(native radio input with a custom visual), `OrderSummary` (lines + total, reused on S07/S08), `PassCard`,
`CheckoutHeader` (back/close + centred title).

## 5. Verification (same bar as M2)
- tsc, eslint, `npm test` (new order tests), `next build`.
- CDP shots at 375/768/1280 × every state.
- Keyboard probes: steppers, radios, Pay.
- A scripted walk of the done-when path, asserting the same tier/qty/₦ total on S06 → S07 → S08 → S11.
- Then a PR into `main` (CLAUDE.md §3).

## 6. Decisions (answered by the user 2026-09-21: D1 a, D2 a, D3 a, D4 a)
- **D1 Desktop layout.**
  - (a) Two columns on lg: choices left, a sticky order summary + CTA right, like S05 §6.3.
  - (b) A single centred `max-w-md` column for all four screens (strict §6.5 "forms").
- **D2 Order state.**
  - (a) URL query params: survives refresh, deep-linkable, server-rendered, no new library.
  - (b) sessionStorage via a client context: clean URLs, but lost in a new tab and client-only.
- **D3 Pay feedback.**
  - (a) Pay shows "Processing…" (disabled, `aria-busy`) for ~1.2s, then → S11. A `?state=declined` review switch shows an inline "Card declined" error with retry.
  - (b) Instant navigation to S11, no processing or declined states.
- **D4 Events without tickets (GAP-007).**
  - (a) Select Access shows the empty state "Tickets for {event} aren't on sale yet" + Explore link.
  - (b) Hide "Join experience" on Details for those events.
