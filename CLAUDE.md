@AGENTS.md

# Exper V1 — Build Instructions

Exper is a live-experience platform. Its core journey is:
Discover → Buy → Attend (check-in) → Participate → Generate → Remember.
Every screen belongs to one of these stages. The flow matters more than any single screenshot.

You'll receive mobile screen designs exported from Stitch (20+ screens). Your job is to
build each screen as ONE responsive component that works on mobile and adapts cleanly
to desktop. This is V1: keep it simple.

---

## 1. Designs may be wrong
The screenshots are a strong reference, not gospel. They are AI-generated and may contain:
- Screens in the wrong order, or a step in the wrong stage of the flow
- Missing back buttons, dead ends, or screens with no way forward
- Nav items, labels, or components that are inconsistent across screens
- Duplicate or near-duplicate screens
- Data that doesn't match between screens (e.g. a ticket price differs from checkout)
- Actions that don't make sense at that point (e.g. "Share artwork" before the event ends)

When you spot any of these:
1. Fix it so the flow is logical and follows the journey above.
2. Prefer the most common/consistent version of a component across screens.
3. Tell me what you changed and why in 1–2 lines per fix.
4. If the fix needs a new feature or screen, don't build it. Flag it and ask.

**You CAN change:** screen order, navigation links, element placement, clearly wrong
labels, and inconsistent components (use the consistent version).
**You CAN'T change without asking:** colors, fonts, overall visual style, or adding
features, sections, widgets, or data that aren't in any design.

---

## 2. Phase 0 — Planning (build nothing yet)
When I share all the screens and say "Start Phase 0":
1. Write `docs/flow.md`: every screen, its flow stage, and where it navigates in/out.
   Flag missing, duplicate, or misordered screens.
2. Write `docs/milestones.md`: group the screens into milestones of 3–5 screens each,
   ordered so each milestone produces something clickable end-to-end. Suggested grouping:
   - M1: Foundation — layout shell, nav, shared components, mock data
   - M2: Discover — home/feed, search, event details
   - M3: Buy — ticket selection, checkout, confirmation, my tickets
   - M4: Attend — check-in / QR, event lobby
   - M5: Participate — live interaction screens
   - M6: Generate & Remember — artwork reveal, memories gallery, profile
   Adjust to the actual screens. Each milestone lists its screens, the shared components
   it introduces, and a "done when" line.
3. STOP and wait for me to approve both files.

---

## 3. Milestone rules
- Work on one milestone at a time. Never start the next one without my go-ahead.
- After each screen, post a one-line status:
  `✅ [Screen name] — built | fixes: [x] | notes: [x]`
- At the end of each milestone, STOP and give a checkpoint report:
  - Screens completed, and the route/URL for each so I can open them
  - Design problems found and how you fixed them
  - Anything you skipped or need my decision on
  - What the next milestone covers
- Git workflow (set by the user 2026-09-21, replaces "never commit"): at the end of each
  milestone, commit the work on a new branch named for it (e.g. `feat/m3-buy-card`), push that
  branch to `origin` (github.com/Dharkwhale/expertest), and open a PR into `main` with `gh`.
  **Never push to `main` and never merge**: the user merges PRs themselves. Commit message
  format: `feat(ui): M[n] — [milestone name]`.
- Tick off completed screens in `docs/milestones.md`.
- At the start of any new session, read `docs/flow.md` and `docs/milestones.md` first
  and continue from the first unticked item.

---

## 4. Workflow per screen
1. State its flow stage and where it links in/out (check `docs/flow.md`).
2. List any design problems and how you'll fix them.
3. List the desktop layout changes in 3–5 bullets.
4. Build it and confirm it works at 375px and 1280px.
5. Post the one-line status.

---

## 5. Implementation
- One component per screen, responsive via Tailwind breakpoints. No separate desktop
  components or duplicated markup.
- Breakpoints: base = mobile, `md` (768px) = tablet, `lg` (1024px) = desktop.
- Page content max width: `max-w-6xl mx-auto px-4 md:px-8`.
- Extract repeated UI (event card, button, chip, avatar, modal) into shared components
  the first time it appears, and reuse them.
- Use mock data from a single `mock/` file. No backend calls in V1 UI work.
- Don't add libraries beyond what's already in the project without asking.

---

## 6. Mobile → Desktop layout patterns
1. **Navigation:** Mobile bottom tab bar → desktop top nav (logo left, the same tab items
   as links, profile/CTA right). No sidebar.
2. **Lists / feeds** (discovery, tickets, past experiences): single column →
   `md:grid-cols-2 lg:grid-cols-3` grid.
3. **Detail screens** (event page): stacked → two columns on `lg`. Content on the left (~2/3),
   and the primary action (tickets / buy / check-in) in a sticky card on the right (~1/3).
   A mobile sticky bottom CTA becomes that right card on desktop.
4. **Hero images:** full-bleed on mobile → rounded, contained, max height ~420px on desktop.
5. **Forms** (auth, checkout, profile edit): single column, centered, `max-w-md`.
6. **Bottom sheets / full-screen modals** → centered modal `max-w-lg` on desktop.
7. **Live participation screens** (prompts, reactions, games, squads): phone-first.
   On desktop, centered column `max-w-md`. Don't redesign the interaction.
8. **Artwork / memory screen:** stacked → two columns on `lg`. The artwork goes large on the
   left, and info plus share/download actions go on the right.

---

## 7. Don't / Do
**Don't:** add dashboards, sidebars, extra stats, carousels, or animations that aren't in
any design.
**Do:** add hover states on desktop, keep images `object-cover` with fixed aspect ratios,
and keep things simple. When in doubt, ask.

---

## 8. Project memory (AI memory kit)
Durable knowledge lives in `docs/`. Read the relevant doc before working; don't guess
what a doc already answers.

| Doc | Read it when |
|---|---|
| `docs/flow.md` | before any screen: its stage, routes in/out, open questions (Q1–Q11) |
| `docs/milestones.md` | at session start: **the source of truth for what is built** |
| `docs/ai-memory/progress.md` | at session start: recent decisions and design fixes |
| `docs/ai-memory/architecture.md` | before structural changes or "where does X live?" |
| `docs/ai-memory/frontend-conventions.md` | before writing any UI (tokens from `ex1`) |
| `docs/ai-memory/gaps.md` | before calling something done; when picking what to fix |
| `docs/ai-memory/api-integration.md` | only if a real backend appears (V1 is mock-only) |

**Tracking split, so nothing is recorded twice:**
- Screen status is ticked in `milestones.md` only. Never log "built X" in `progress.md`.
- `progress.md` (log-progress skill) records decisions, design fixes and answered
  questions. These are the "what I changed and why" lines from section 1, so they survive the session.

**Kit rules on top of sections 1–7:**
1. Priority order: security → code quality → architecture fit → design fidelity → endpoint consumption.
2. Colours, fonts, radius and spacing come from tokens in `frontend-conventions.md`, sourced
   from `ex1`, never magic numbers. Add a missing token there first, then use it.
3. Never invent API shapes. V1 uses `mock/` only; if a backend appears, record the contract
   in `api-integration.md` (consume-endpoint skill) before any code.
4. Plan first for anything touching checkout, payments or USDC, even when mocked.
5. Anything you can't fix inside V1 scope (and every `/security-review` or `/code-review`
   finding) goes in `gaps.md` so it doesn't vanish with the session.
6. If a change contradicts a decision in `architecture.md` or an answered question in
   `flow.md`, stop and flag it.
7. Once M1's scaffold exists, run document-architecture then audit-gaps; before that there is no code for them to read.
