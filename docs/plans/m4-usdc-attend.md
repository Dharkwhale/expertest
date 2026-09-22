# M4 — Buy (USDC path) + Attend: plan

Status: **approved 2026-09-22** (D5 a, D6 a, D7 a, D9 a answered by the user; D8 a follows the M3 precedent) (CLAUDE.md §8 rule 4: plan first for checkout/USDC, even when mocked).
Branch: `feat/m4-attend`, from `main` after the footer PR (#3) merged. Screens: S09, S10, S12, S13 (flow.md §1).
Answered inputs: Q2 (a) no check-in screen, the S11 pass is the gate pass · Q4 (a) in-app banner · Q8 no gas line, network defaults to Base.

**Done when** (milestones.md): the USDC path reaches the same confirmation as the card path, and
"Enter Hub" / "Open Exper" land on Live Experience.

## 1. Flow and routes

```
S07 /events/:id/checkout ─USDC─▶ S09 /events/:id/checkout/wallet ─wallet─▶ S10 /events/:id/checkout/crypto ─Confirm─▶ S11 /events/:id/pass?…&method=usdc
S09 back ─▶ S07 (USDC selected) · S09 ✕ ─▶ S05 · S10 ✕ / "Cancel transaction" ─▶ S07 (USDC selected)
S11 "Enter Neon Solstice Hub" ─▶ S13 /live   (already wired in M3)
S12 banner "Open Exper" ─▶ S13 /live
```

S09 and S10 go in the existing `(checkout)` route group: no tab bar, no top nav, the design's own header.
They reuse the M3 order-in-URL model (D2) and the `resolveCheckout` gate unchanged, so the tier, quantity and total
are recomputed from mock data on every step. Nothing about price is read from the URL.

## 2. Security (mock only, but it still ships to a browser)

- **No wallet SDK, no `window.ethereum`, no signing, no RPC calls.** "Connect" is navigation only.
- The wallet address on S10 is a **fixed mock constant** (`0x7A4b…92C4`, from ex11). There's no address input.
- `wallet` in the URL (see D6) is checked against an allowlist of the four ex17 wallets. Anything else → the order-problem state, the same as a bad tier id.
- The network dropdown is a native `<select>` over an allowlist (Ethereum · Polygon · Base), defaulting to Base (Q8). It's client state only and isn't sent anywhere.
- The USDC amount comes from `orderTotals()` (the canonical rate ₦25,000 ≈ 16.50), never from the URL.

## 3. Screens: design fixes and states

### S09 Connect Wallet (ex17), "Step 2 of 3"
- **Fixes:**
  - "General Access • Lagos Hall" → the purchased tier(s) + canonical venue.
  - Ticket card total = `orderTotals` (16.50 USDC ≈ ₦25,000 for the demo path).
- **Wired:**
  - the big "[ Connect Wallet ]" button and each wallet row (MetaMask "Popular", WalletConnect, Coinbase Wallet, Rainbow) → S10;
  - back → S07; ✕ → S05.
- **Unavailable:** "All other wallets" (no screen).
- **Kept as copy:** the "Non-custodial & Zero-permission… single 16.50 USDC transfer" note, with the amount computed.
- **States:** loading skeleton · error + Retry · not on sale · order problem (all via the M3 components).
- **Desktop (D1, as M3):** two columns on lg. The wallet list is on the left; the order summary sits in a sticky card on the right.

### S10 Confirm Payment, USDC (ex11), "Step 3 of 3"
- **Fixes:**
  - "1X NOMAD ACCESS" → the purchased tier(s).
  - "Immersive listening experience" (Sound/Scape's copy) → Neon Solstice's own subtitle.
  - **Gas line dropped** and "+ 0.0006 ETH" removed from Total due (Q8).
  - "Network · Fast • 15 gwei" → "Network · Fast". Gwei is a gas unit, and there's no gas.
  - The network defaults to **Base** (Q8).
  - The wide extended headline face → Anton (Q10).
- **Kept:**
  - "Exper // Pass authorization";
  - the connected wallet row (mock address, "Web3" tag);
  - "Total due · Includes all protocol fees";
  - "Encrypted via EXPER protocol & ERC-721 smart contract".
- **Unavailable:** the top-right icon (unclear action), "01/01 Verified" and "ID: #EXP-9920" (decorative text, not controls).
- **Confirm Payment** reuses the M3 Pay pattern (D3) instead of a second one. `PayButton` gets label props:
  - "Confirm in your wallet…" (~1.2s, disabled, announced) → S11 with `method=usdc`;
  - the review switch `?state=declined` shows "Transaction rejected in your wallet", with retry and "pay by card" instead.
- **States:** the same four as S09.

### S12 Pre-event notification (ex23), in-app banner (Q4 a)
- A `NotificationCard` component carrying ex23's card content only:
  - "EXPER" header, "Your evening has plans." and the room line (Main Hall & Resonance Pavilion);
  - "Your people are looking for you · 1.2K in room";
  - "Open Exper →" and "Pass active on device".
- The lock-screen parts (clock, "Swipe up", flashlight, camera) are dropped.
- **Fixes:**
  - The pass code "SKD-9042" → the canonical pass credential from `passTemplate`.
  - **"Starts in 30 minutes" contradicts the rest of the app:** Neon Solstice is `isLive` and Home shows it as LIVE (ex5's clock reads 8:42 PM). See D5.
- **Wired:** "Open Exper" → `/live`. **Unavailable:** "View venue coordinates" (no map screen).
- Where it appears: **D5**.

### S13 Live Experience (ex5), `/live`
- Replaces the M1 placeholder. It's in the tabs layout (tab bar shown; Live active).
- **Content:**
  - Hero "LIVE · Neon Solstice · Lagos · 8:42 PM · 1.2K", using the event image darkened.
  - What's happening: Main Hall, **Resonance Pavilion** and Squad (The Neon Nomads · 8 people), as `SpaceRow`s.
  - What are you noticing?: Something / Someone / Somewhere chips.
  - Quick one: "What does this sound like?", with four reactions and "312 people have responded".
- **Fixes:**
  - "North Pavilion" → **Resonance Pavilion** (the canonical venue has no North Pavilion; M3 made the same fix on ex14).
  - ✕ → Pocket Mode (flow.md §6).
- **Links:**
  - Main Hall → S15, Squad → S19, noticing chips → S16, ✕ → S14.
  - Those are M5/M6 screens (see D8).
  - Resonance Pavilion has no destination in any design, so it's a non-link row.
- **Quick one:** the `ReactionPicker` is a radio group; picking one marks it selected locally. Opening the full-screen ex25 stays with **Q7 (M5)**.
- **States:** loading skeleton · error + Retry · empty ("Nothing live right now" + Explore link, when no event is live) · success.
- **Desktop:** D7.
- New mock data (`liveNow` in `mock/data.ts`) holds only the values above, from ex5.

## 4. Shared components (milestones.md M4)
`StepIndicator` ("Step 2 of 3" pill, ex17/ex11) · `WalletOption` (row button: icon, name, networks, optional badge) ·
`NotificationCard` · `SpaceRow` (thumb, title, status, "Live" dot; link or plain) · `ReactionPicker` (accessible radio group).
`PayButton` is extended, not duplicated.

## 5. Verification (same bar as M3)
- tsc, eslint, `npm test`. New unit tests cover the `wallet` param allowlist and USDC totals on the crypto path.
- `next build` in an isolated copy only, never in the user's folder while their dev server runs.
- CDP shots at 375/768/1280 × every state.
- Keyboard probes: wallet rows, network select, reaction radios, banner CTA.
- A scripted walk: S05 → S06 → S07 (USDC) → S09 → S10 → Confirm → S11, asserting 16.50 USDC / ₦25,000 at every step. Then S11 "Enter Hub" and the banner "Open Exper" → `/live`.
- Update GAP-008: the `?state=` switch now also reaches S09/S10.
- Commit, push, and open a PR into `main` (CLAUDE.md §3).

## 6. Decisions (answered 2026-09-22: D5 a, D6 a, D7 a, D8 a, D9 a)
- **D5: where the S12 banner shows, and its time line.**
  - (a) At the top of Home (S03), dismissible for the session. "Starts in 30 minutes" → "is happening now", to match the live event. **Recommended.**
  - (b) At the top of Home with ex23's copy unchanged. This contradicts Home's LIVE hero directly below it.
  - (c) On the S11 pass page, under the pass, as a "reminder" preview. Copy unchanged.
- **D6: which wallet was picked on S09.**
  - (a) Carry it in the URL (`&wallet=metamask`, allowlisted). S10's wallet row then names the wallet chosen. **Recommended.**
  - (b) Don't carry it. S10 always shows a generic "Personal Vault" as ex11 does.
- **D7: S13 desktop layout.**
  - (a) CLAUDE.md §6.7 "live participation: phone-first": a centred `max-w-md` column, the same interaction. **Recommended**, since it's the documented rule.
  - (b) Two columns on lg: the space list on the left, noticing + quick one on the right.
- **D8: links from S13 to screens that don't exist until M5/M6** (S14, S15, S16, S19).
  - (a) Link them now. They 404 until built, the same as M3 did for S09. **Recommended.**
  - (b) `UnavailableButton` until each screen ships, then swap to links.
- **D9: the site footer on `/live`.** The tabs layout adds the footer to every tab, including Live, and that milestone's screens are immersive.
  - (a) Hide it on `/live` (and later on M5's live screens) via a separate `(live)` route group with the same nav but no footer, like checkout. **Recommended.**
  - (b) Keep it, as on every other tab.
