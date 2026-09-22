# Exper V1 — Screen Flow

Journey: **Discover → Buy → Attend → Participate → Generate → Remember**

Source: 27 images in `/designs` (`ex1.png` … `ex27.png`). `ex1` is the design-system sheet, not a screen.
That leaves 26 screen images. After merging duplicates they make **23 unique screens**, and the
**Generate** stage has no screens at all (see Missing screens).

Screen IDs (`S01`…) follow journey order, not the numbers printed on the designs. Those
numbers collide and are out of order (see Misordered).

---

## 0. Design system reference (`ex1`)

| Token | Value |
|---|---|
| Primary | `#D2FF00` (lime) |
| Secondary | `#00D2FF` (cyan) |
| Tertiary | `#8B5CF6` (purple) |
| Neutral | `#08080C` |
| Headline font | Anton |
| Body font | Space Grotesk |
| Label font | JetBrains Mono |

Components shown: buttons (Primary / Secondary / Inverted / Outlined), search input, progress
bars, pill tab bar, icon buttons, label chip.

---

## 1. Screen inventory

Route params use `:eventId` (demo event: `neon-solstice`).

### Discover
| ID | Screen | File(s) | Route | In from | Out to |
|---|---|---|---|---|---|
| S01 | Splash | ex2 | `/` | app launch | auto → S02 (first visit) or S03 |
| S02 | Lander / The World | ex6 | `/welcome` | S01 | "Enter the World" → S03 · spotlight/stream cards → S05 |
| S03 | Home | ex3 | `/home` | S01, S02, tab bar | hero "Join Experience" → S05 · Sound/Scape card → S05 · "Things happening around you →" → S04 · avatar → S22 · bell → ⚠ no screen |
| S04 | Explore | **ex7** (ex4 = duplicate) | `/explore` | tab bar, S03 | any event card → S05 · search, filter, "Change" city, "View map" → ⚠ no screens |
| S05 | Event Details | ex10 | `/events/:eventId` | S02, S03, S04 | back → previous · "Join Experience" → S06 · Map → ⚠ no screen |

### Buy
| ID | Screen | File(s) | Route | In from | Out to |
|---|---|---|---|---|---|
| S06 | Select Access | ex9 | `/events/:eventId/access` | S05 | back → S05 · "Proceed to Payment" → S07 |
| S07 | Payment Method | ex13 | `/events/:eventId/checkout` | S06 | back → S06 · Card/Bank + Continue → S08 · USDC + Continue → S09 |
| S08 | Review & Pay (card) | **ex14** (ex15 = duplicate) | `/events/:eventId/checkout/card` | S07 | back → S07 · "Change" payment → S07 · "Pay" → S11 |
| S09 | Connect Wallet (USDC step 2/3) | ex17 | `/events/:eventId/checkout/wallet` | S07 | back → S07 · ✕ → S05 · wallet choice → S10 |
| S10 | Confirm Payment (USDC step 3/3) | ex11 | `/events/:eventId/checkout/crypto` | S09 | ✕ / "Cancel transaction" → S07 · "Confirm Payment" → S11 |
| S11 | Purchase Confirmation / Pass | ex20 | `/events/:eventId/pass` | S08, S10 | ✕ → S03 · "Enter Neon Solstice Hub" → S13 · "View in Moments & Tickets" → S21 (⚠ no Tickets screen) · Squad Invite → ⚠ no screen |

### Attend
| ID | Screen | File(s) | Route | In from | Out to |
|---|---|---|---|---|---|
| S12 | Pre-event notification | ex23 | in-app banner (Q4 a) | system notification | "Open Exper" → S13 |
| — | Check-in / gate pass | — | — | — | not built: the S11 pass barcode is the gate pass (Q2 a) |
| S13 | Live Experience (event lobby) | ex5 | `/live` | tab bar, S11, S12, S14 | Main Hall row → S15 · Squad row → S19 · "What are you noticing?" chip → S16 · Quick One reaction → S17 (Q7) · ✕ → S14 |
| S14 | Pocket Mode | ex21 | `/live/pocket` | S13 ✕ | "Return to Neon Solstice" → S13 · "End Experience" → S21 |

### Participate
| ID | Screen | File(s) | Route | In from | Out to |
|---|---|---|---|---|---|
| S15 | Capture a Moment of Light | ex8 | `/live/prompts/light` (+ `/live/prompts/blue/capture` for S16's blue prompt) | S13, S16 | back → S13 · capture → stays, your photo first in "Recent responses" (answered 2026-09-22) |
| S16 | Find Something Blue | ex24 | `/live/prompts/blue` | S13 | "I found blue" → capture (S15 layout, blue prompt) · "I'd rather just wander" / ✕ → S13 |
| S17 | How Did That Feel? | ex25 | `/live/pulse` | S13 Quick One reaction (Q7, answered) | choice → S13 · ✕ added → S13 |
| S18 | Squad notification | ex22 | in-app card at the top of `/live` (Q4 a, answered 2026-09-22) | S13 | "Join Them" → S19 |
| S19 | Squad Hub | ex26 | `/live/squad` | S13, S18 | back → S13 · "My rank within the squad" → S20 · View all → ⚠ no screen |
| S20 | Event Leaderboard | ex27 | `/live/leaderboard` | S19 | back → S19 |

### Generate
| ID | Screen | File(s) | Route | In from | Out to |
|---|---|---|---|---|---|
| — | Memory / artwork reveal (no design; built from existing parts, Q1) | ex16 + ex19 | `/moments/:eventId` | S21 "Your memory is ready", S21 experience card | back → S21 |

### Remember
| ID | Screen | File(s) | Route | In from | Out to |
|---|---|---|---|---|---|
| S21 | Moments | **ex16** (ex12 = duplicate) | `/moments` | tab bar, S11, S14 | "Your memory is ready" → ⚠ missing Generate screen · experience card → same |
| S22 | Your Constellation ("You" tab) | ex18 | `/you` | tab bar, S03 avatar | people rows → ⚠ no profile screens (static in V1) |
| S23 | Brand / Message | ex19 | skipped (Q5); its line and © live in the site footer | — | — |

### Tab bar (canonical)
**Home · Explore · Live · Moments · You** (from ex3, ex4, ex7, ex8, ex12, ex16, ex18).
Shown on S03, S04, S13, S19, S21, S22. Hidden on the splash, checkout flow, full-screen
prompts (S15–S17), Pocket Mode, and Leaderboard.

---

## 2. Duplicates / near-duplicates

| Kept | Dropped | Why |
|---|---|---|
| ex7 Explore / Discovery | ex4 Explore | Same screen. ex4's "For You" section is empty; ex7 fills it in and adds sections. |
| ex14 Review & Pay | ex15 Review & Pay | Same screen, different data. ex15 repeats payment-method selection (already on S07) and has a 3-line fee ledger that contradicts "all fees incl." on S06. |
| ex16 Moments | ex12 Moments | Almost identical. ex16's tab bar icons match the other screens; ex12's Live icon is different. |
| ex3 Home | — | ex6 is also labelled "02" and competes as a home screen. Kept as the logged-out Lander (S02), and its own bottom nav (World/Explore/Live/Moments) is removed (Q3). |
| ex5 "Quick one" reactions | — | This is a mini version of ex25 (full-screen reaction). Both kept: ex5's inline picker opens ex25 (Q7). |

## 3. Missing screens (flagged, not built)

1. **Generate — Memory / artwork reveal.** It's the whole Generate stage. Moments says "Your memory is ready. Tap to view →" and the link has nowhere to go. **Biggest gap.**
2. **Check-in / gate QR (Attend).** Nothing covers arriving at the gate. The pass on ex20 has a barcode that could serve as the gate pass.
3. **My Tickets.** Linked from ex20 ("View in Moments & Tickets") and listed in the suggested M3.
4. **Auth (sign in / sign up).** None exists, yet checkout shows attendee details (name, email).
5. Smaller dead links that stay non-functional in V1: Notifications (bell), Search, Filter sheet, City picker ("Change"), Map ("View map", venue Map), Squad Invite, Join / Create Squad, Squad "View all", other users' profiles.
6. Numbering gaps in the design labels (09, 10, P03–P06) suggest some screens weren't exported.

## 4. Misordered screens

- The labels collide: two "02"s (Home, Lander), two "03"s, two "04"s (Live Experience, Event Details), two "05"s (Participate, Ticket Selection), four "06"s, and two "P02"s.
- "04 Live Experience" is numbered before "05 Ticket Selection" and "06 Checkout", so it puts Attend ahead of Buy. Reordered to Discover → Buy → Attend.
- "05 Participate" is numbered alongside ticket selection. It belongs after the event lobby (S13).
- Journey labels leak into the UI: "STAGE 05" header on ex9 and "EXPERIENCE 04" on ex10. Remove them.

## 5. Data mismatches (canonical value in bold, used for all mock data)

| Field | Variants in designs | Canonical |
|---|---|---|
| Venue | Landmark Beach · Victoria Island (ex10); Main Hall & Sound Pavilions (ex9); Main Hall & North Pavilion (ex14); Main Hall & Resonance Pavilion (ex15, ex20, ex21, ex23) | **Main Hall & Resonance Pavilion · Landmark Beach, Victoria Island, Lagos** |
| Date/time | Tonight · Apr 12 · 8:00 PM (all) | **Fri Apr 12, 8:00 PM–3:30 AM WAT** (consistent already) |
| Ticket tier on checkout | General Access (ex9, ex13); "Nomad Access" (ex11); Full Spectrum Pass (ex14, ex15); VIP Immersion (ex20) | **The tier picked on S06** (General Access / VIP · Soundscape / Squad Bundle). Demo path: **1× General Access** |
| Price | ₦25,000 (ex9, ex10, ex11, ex13); ₦32,500 + ₦2,500 fee (ex14); ₦30,000 + fees = ₦35,000 (ex15) | **₦25,000, fees included** (ex9 says "all fees incl."), ≈ **16.50 USDC** |
| Quantity | 2 passes default (ex9); 1 everywhere else | **Default 1** |
| Gas | "ZERO GAS" (ex13) and "single 16.50 USDC transfer" (ex17) vs 0.0006 ETH gas line (ex11) | **Zero gas.** Drop the gas line on S10 (Q8) |
| Network | "Ethereum · Polygon · Base" (ex17) vs Ethereum (ex11) | Keep the network dropdown on S10, default **Base** (Q8, answered) |
| Event subtitle | ex11 says "Immersive listening experience", which is Sound/Scape's copy | Use **Neon Solstice's own subtitle** |
| User | Tope Adebayo, tope@exper.io (ex14); Tope Banjo @stellar_01 (ex15, ex20); Home greets "Tope" | **Tope Banjo** (Q6). ⚠ `@stellar_01` is also listed as *another* person on ex18 |
| Squad | "The Neon Nomads · 8 people" (ex5, ex12); "SOL-SQUAD" (ex22); "Name of our squad" placeholder (ex26); Sinmi/Bode/Salman are members (ex26) but each leads a rival squad (ex27) | **The Neon Nomads** (8 people). Leaderboard squads need other names (Q6) |
| Placeholders | "Name of our squad" (ex26), "Name of the live event" (ex27) | **The Neon Nomads**, **Neon Solstice** |
| Performer | "Don Jazzy just finished performing" (ex25) vs lineup @aura_pilot (host, with Stellar Lab), @marcus_flow, @elara_vibe, @nova_seeker (ex10) | Use a **lineup act** (Q6). Also, Don Jazzy is a real artist |
| CTA label | "Join Experience" (ex3, ex10) vs "Join Pulse" (ex7) | **Join Experience** |
| Tab bar icons | Moments = plus-square / bookmark / sparkle / book across screens | **Bookmark** for Moments, **radio waves** for Live |

## 6. Dead ends / illogical actions (fixes)

- **ex25 How Did That Feel?** has no back or close. Add ✕ → S13, and return to S13 after a choice.
- **ex5 Live Experience ✕** has no stated destination. → Pocket Mode (S14), which is what "stepping away while staying in" means.
- **ex24 "I found blue"** has no next screen. → capture layout (S15) with the blue prompt.
- **ex8 capture** has no success state. Stay on S15 and put the photo first in its own "Recent responses" (S13 has no such section); no new UI. Answered 2026-09-22.
- **ex26 Squad Hub** shows "Join a Squad" / "Create New Squad" to someone already in a squad. Hidden in the in-squad state (Q9, answered 2026-09-22).
- **ex19 Brand / Message** has no navigation in or out.
- **ex20 "Enter Neon Solstice Hub"** skips check-in. Fine for the V1 demo, flagged under missing screen 2.
- **ex14 "Wristband Sync & Spatial Memory" add-on** with a stepper appears on no other screen or tier (Q9).

## 7. Visual inconsistencies (need your call, since I can't change fonts or colours)

- **Fonts:** ex1 says Anton / Space Grotesk / JetBrains Mono. ex3, ex4, ex5, ex12 and ex16 use an Inter-style sans for headlines. ex11 uses a wide extended display face ("CONFIRM PAYMENT"). ex19 uses a brush script.
- **Logo:** brush script (ex2, ex19) vs bold sans "EXPER•" (ex6).
- **Colours:** ex26 uses purple (tertiary) as the primary CTA colour and has its own purple tab bar. ex25 uses flat grey cards plus a navy button, which isn't in the palette. ex19 is a light cream theme; every other screen is dark.
- **Primary button:** white in ex1, lime `#D2FF00` on every screen. Lime is used.

## 8. Asset quality

The exports are about 190–300px wide. Small text on ex6, ex9, ex10, ex15 and ex20 can't be read exactly, so some copy and labels will be approximate. Higher-res exports (or the Stitch HTML/code) are needed before building those screens.

---

## Open questions (need answers before or during the milestones noted)

- **Q1 (M7):** Should I build the Generate "memory reveal" screen from the CLAUDE.md §6.8 pattern (artwork left, info and share/download right)? Or will you supply a design?
  **Answered 2026-09-22:** build it from existing parts only, at `/moments/:eventId`: §6.8 layout, artwork = ex19's wave-and-dots art card rebuilt in tokens, info = ex16's tag / journey / energy. Share and Download are shown but unavailable (no feature). No new copy or data.
- **Q2 (M4):** Check-in: add a screen, or reuse the S11 pass (barcode) as the gate pass?
  **Answered 2026-09-22:** (a) reuse the S11 pass. Its barcode is the gate pass; no check-in screen is built.
- **Q3 (M2):** Lander (ex6): keep it as the first-visit landing at `/welcome` with its bottom nav removed? Or drop it?
  **Answered 2026-09-21:** keep it at `/welcome`, shown on first visit only (Splash → `/welcome` → `/home`). Its own bottom nav is removed. Desktop is a split layout (copy left, featured image right). ex6 data fixes: 8:00 PM, not 22:00; "No tickets. No waiting lines." is dropped because it contradicts Buy; Solar Pulse is added to the mock data. Lineup host confirmed as `@aura_pilot` (the `@sonic_pilot` in Phase 0 was a misread).
- **Q4 (M4/M6):** Lock-screen notifications (ex22, ex23) can't be real OS lock screens on the web. Options: (a) build the notification card as an in-app banner, (b) standalone demo routes that mimic the lock screen, (c) skip.
  **Answered 2026-09-22:** (a) in-app banner, for ex23 (M4) and ex22 (M6). No fake lock screen.
- **Q5 (M7):** Brand / Message (ex19, light theme): skip, or build as an `/about` page?
  **Answered 2026-09-22:** skip. The site footer already carries ex19's line and ©; the cream theme and brush script would need new tokens and a third font.
- **Q6 (M1):** Confirm the canonical mock data: user **Tope Banjo**, whether to keep handle `@stellar_01` (it collides with ex18), leaderboard squad names, and which lineup act replaces "Don Jazzy".
  **Answered 2026-09-21:** keep the mock data as it is. Use the canonical values in §5 unchanged (Tope Banjo `@stellar_01`, The Neon Nomads, Neon Solstice). Leaderboard squad names and the lineup act stay as the designs show them.
- **Q7 (M5):** Entry to ex25: tapping a "Quick one" reaction on S13 opens the full-screen version. OK?
  **Answered 2026-09-22:** yes. Tapping any S13 Quick One reaction opens S17 `/live/pulse`; picking a feeling or ✕ returns to S13. (ex25's five feelings don't match ex5's four icons, so nothing is pre-selected.) Also answered in the same pass: ex25's "Don Jazzy" → **@aura_pilot** (ex10 host, the only act on before 8:42 PM), and S15 capture **stays on S15** with your photo first in Recent responses (count 486 → 487; the photo never leaves the browser).
- **Q8 (M4):** USDC: drop the gas line (zero gas) and default the network to Base?
  **Answered 2026-09-22:** yes to both. S10 has no gas line; the network dropdown stays (Ethereum · Polygon · Base) and defaults to Base.
- **Q9 (M3/M6):** Remove the ex14 add-on stepper, and hide Join / Create Squad when the user is already in a squad?
  **Answered 2026-09-21 (add-on half):** remove the ex14 "Wristband Sync & Spatial Memory" add-on stepper "for now". The Join / Create Squad half stays open until M6.
  **Answered 2026-09-22 (squad half):** (a) hide "Join a Squad" / "Create New Squad" while the user is in a squad. Same pass: ex26's purple primary button → lime like every other screen (purple/tertiary kept as an accent); S18 (ex22) shows as an in-app card at the top of `/live`.
- **Q10 (M1):** Fonts: use the ex1 system (Anton / Space Grotesk / JetBrains Mono) everywhere?
  **Answered 2026-09-21:** use two fonts only. **Anton** for headlines, **Space Grotesk** for body *and* labels. JetBrains Mono is dropped; labels become Space Grotesk, uppercase, wide tracking.
- **Q11 (M1):** Stack: the repo is empty. Proposed: **Vite + React + React Router + Tailwind**, since this is a mock-data SPA and doesn't need SSR. Or Next.js?
  **Answered 2026-09-21:** **Next.js (App Router) + Tailwind CSS**. Images come from Unsplash (licensed for free use). Pinterest is excluded: its images are unlicensed re-pins.
