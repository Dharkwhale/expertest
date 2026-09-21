// The single mock data source for V1 (CLAUDE.md §5). Values are the canonical ones in
// docs/flow.md §5 (Q6: kept as-is). Later milestones extend this file; don't create another.
import { unsplash } from "@/lib/unsplash";

export type Tone = "primary" | "secondary" | "tertiary";

export type Person = {
  id: string;
  name: string;
  handle?: string;
  email?: string;
  avatar?: string;
  tone?: Tone;
};

// Explore's filter chips (ex7). Talks and Food have no events in the designs, so those
// chips land on the empty state.
export const CATEGORIES = [
  { id: "music", label: "Music" },
  { id: "art", label: "Art" },
  { id: "tech", label: "Tech" },
  { id: "talks", label: "Talks" },
  { id: "food", label: "Food" },
] as const;
export type Category = (typeof CATEGORIES)[number]["id"];

// The Lander's "Worlds & frequencies" chips (ex6). ex6 shows a fourth chip cut off at
// the screen edge ("S…"); it can't be read, so it's left out.
export const REALITIES = [
  { id: "soundscapes", label: "Soundscapes" },
  { id: "spatial-light", label: "Spatial Light" },
] as const;
export type Reality = (typeof REALITIES)[number]["id"];

/** Small coloured tag on a card image ("Art fair", "Nightlife" in ex7) */
export type CardTag = { label: string; tone: Tone };

export type LineupAct = { handle: string; role: string; time?: string; tone?: Tone };

/** The long-form content of ex10. Only Neon Solstice has it; other events hide those sections. */
export type EventDetails = {
  season: string;
  format: string;
  features: { title: string; body: string; tone: Tone; icon: "speaker" | "bolt" | "memory" }[];
  host: LineupAct & { partner: string };
  acts: LineupAct[];
  protocol: { title: string; body: string }[];
};

export type ExperienceEvent = {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  /** Not every event in the designs states a city (Solar Pulse doesn't) */
  city?: string;
  venue?: string;
  area?: string;
  dateLabel: string;
  timeLabel?: string;
  timeRange?: string;
  attendingCount?: number;
  /** Lander stream wording ("640 tuned in", "212 exploring"); falls back to "N going" */
  countLabel?: string;
  heroImage: string;
  heroAlt: string;
  isLive: boolean;
  quote?: { text: string; handle: string };
  categories: Category[];
  realities: Reality[];
  tag?: CardTag;
  details?: EventDetails;
};

export type Tier = {
  id: "general" | "vip-soundscape" | "squad-bundle";
  name: string;
  tagline: string;
  description: string;
  priceNgn: number;
  per: string;
  /** Passes one unit uses up against the 4-per-person cap (Squad Bundle admits 4) */
  passes: number;
  perk: string;
  badge?: string;
};

// Current user (flow.md §5: Tope Banjo). `@stellar_01` is kept even though ex18 also
// lists it on another person (Q6: keep mock data as it is).
export const currentUser: Person = {
  id: "u-tope",
  name: "Tope Banjo",
  handle: "@stellar_01",
  // ex14 is the only screen with an email (it names "Tope Adebayo"; the name is canonicalised)
  email: "tope@exper.io",
  avatar: unsplash("1632765854612-9b02b6ec2b15"),
};

export const events: ExperienceEvent[] = [
  {
    id: "neon-solstice",
    title: "Neon Solstice",
    subtitle:
      "Where kinetic light, spatial sound, and human presence fuse into a living collective pulse.",
    description:
      "A multi-sensory descent into frequency, light, and architectural resonance. As the night deepens, dynamic laser lattices adjust in real time to the crowd's proximity and collective heart rate, weaving 1,200 individual voices into a singular auditory entity.",
    city: "Lagos",
    venue: "Main Hall & Resonance Pavilion",
    area: "Landmark Beach, Victoria Island, Lagos",
    dateLabel: "Fri Apr 12",
    timeLabel: "8:00 PM",
    timeRange: "8:00 PM – 3:30 AM WAT",
    attendingCount: 1240,
    heroImage: unsplash("1768054485751-bab2eda850b8"),
    heroAlt: "Crowd facing a stage washed in purple light",
    isLive: true,
    // ex3 upscaled reads "@mara" (M1 transcribed "@maia" from the unscaled PNG)
    quote: { text: "The room feels like it's breathing.", handle: "@mara" },
    categories: ["music", "art"],
    realities: ["soundscapes", "spatial-light"],
    details: {
      season: "Season 02",
      format: "Spatial A/V",
      features: [
        {
          title: "Resonance Chamber",
          body: "36-point directional spatial audio engineered by Stellar Sound Lab.",
          tone: "secondary",
          icon: "speaker",
        },
        {
          title: "Kinetic Laser Grid",
          body: "Reactive infrared arrays responding to collective crowd density in real time.",
          tone: "primary",
          icon: "bolt",
        },
        {
          title: "Generative Memory",
          body: "Biometric motion data mints an immutable post-event digital relic at 05:00 AM.",
          tone: "tertiary",
          icon: "memory",
        },
      ],
      // Host confirmed as @aura_pilot (ex10 upscaled, ex18), 2026-09-21
      host: { handle: "@aura_pilot", partner: "Stellar Lab", role: "Spatial Audio Architecture", tone: "primary" },
      // Set times are approximate: ex10 is ~150px wide and the times are barely legible
      acts: [
        { handle: "@marcus_flow", role: "Modular Subtleties", time: "10:30 PM", tone: "secondary" },
        { handle: "@elara_vibe", role: "Holographic Projection", time: "11:30 PM", tone: "tertiary" },
        { handle: "@nova_seeker", role: "Dawn Ambient Resonance", time: "02:45 AM", tone: "primary" },
      ],
      protocol: [
        { title: "Dress Aesthetic", body: "Kuro / Monochrome / Reflective accents recommended." },
        {
          title: "Sound Pressure",
          body: "Continuous 102dB spatial dynamics. Hi-fi acoustic ear protection provided upon check-in.",
        },
        { title: "Token Protocol", body: "Seamless tap-to-sync using EXPER NFC Wristband or mobile pass." },
      ],
    },
  },
  {
    id: "sound-scape",
    title: "Sound/Scape",
    subtitle: "Immersive listening experience",
    city: "Lagos",
    dateLabel: "Apr 25",
    timeLabel: "7:00 PM",
    heroImage: unsplash("1601777225811-1ee43af2b881"),
    heroAlt: "Beams of teal light cutting through a dark room",
    isLive: false,
    categories: ["music"],
    realities: ["soundscapes"],
    tag: { label: "Resonance", tone: "primary" },
  },
  // ex7 "Curated & happening"
  {
    id: "art-x",
    title: "Art X",
    subtitle: "Art fair",
    city: "Lagos",
    dateLabel: "Apr 12",
    attendingCount: 312,
    heroImage: unsplash("1531058020387-3be344556be6"),
    heroAlt: "Visitors walking through a bright exhibition hall",
    isLive: false,
    categories: ["art"],
    realities: [],
    tag: { label: "Art fair", tone: "secondary" },
  },
  // ex7 (Explore, Apr 18) and ex6 (Lander stream, where it's shown as LIVE). ex7 appears
  // twice (ex4 + ex7) so its date wins; the Lander shows the date instead of LIVE.
  {
    id: "midnight-drift",
    title: "Midnight Drift",
    subtitle: "Underground Deep Ambience",
    city: "Lagos",
    dateLabel: "Apr 18",
    attendingCount: 640,
    heroImage: unsplash("1503376780353-7e6692767b70"),
    heroAlt: "Black sports car on an empty road at dusk",
    isLive: false,
    categories: ["music"],
    realities: ["soundscapes"],
    // ex7 colours this tag pink, which isn't in the palette; tertiary is the nearest token
    tag: { label: "Nightlife", tone: "tertiary" },
  },
  // ex6 Lander stream. No city or date in the design.
  {
    id: "solar-pulse",
    title: "Solar Pulse",
    subtitle: "Kinetic Photon Chamber",
    dateLabel: "Now",
    attendingCount: 212,
    countLabel: "212 exploring",
    heroImage: unsplash("1545128485-c400e7702796"),
    heroAlt: "Silhouettes in a dark room lit by red neon bars",
    isLive: true,
    categories: ["art", "tech"],
    realities: ["spatial-light"],
    tag: { label: "Spatial art", tone: "secondary" },
  },
];

// ex6 Lander. "Tonight, 22:00" in ex6 is corrected to the canonical 8:00 PM; the
// "No tickets. No waiting lines." line is dropped (contradicts Buy). 2026-09-21.
export const lander = {
  inRoomGlobally: 2480,
  activeWorlds: 48,
  heroImage: unsplash("1514525253161-7a46d19cd819"),
  spotlightId: "neon-solstice",
  spotlightTags: ["Lights", "Sound", "Transcend"],
  streamIds: ["midnight-drift", "solar-pulse"],
  cities: ["Berlin", "Tokyo", "London", "Lagos", "São Paulo", "Seoul"],
};

// ex7 Explore layout: which events fill which section
export const explore = {
  featuredId: "neon-solstice",
  // Solar Pulse (ex6) added so the lg 3-column grid has no empty cell
  curatedIds: ["art-x", "midnight-drift", "solar-pulse"],
  forYouIds: ["sound-scape"],
  cities: ["Lagos", "Accra", "London"],
};

// ex3 Home: one live hero, then "up next"
export const home = {
  greeting: "Good evening,", // the mock world is frozen on the evening of Apr 12
  heroId: "neon-solstice",
  upNextIds: ["sound-scape"],
};

// Faces for the "people going" stack. Decorative; the count carries the meaning.
export const attendeePreview: string[] = [
  unsplash("1519699047748-de8e457a634e"),
  unsplash("1713845784497-fe3d7ed176d8"),
  unsplash("1535713875002-d1d0cf377fde"),
  unsplash("1601412436009-d964bd02edbc"),
];

// ex9. Prices are fees-included (flow.md §5). USDC is derived from NGN_PER_USDC for every tier.
export const tiers: Tier[] = [
  {
    id: "general",
    name: "General Access",
    tagline: "Standard floor & dynamic lights",
    description:
      "Full entry to main arena, crowd pulse sensor synchronization, and interactive real-time projection installations.",
    priceNgn: 25000,
    per: "person",
    passes: 1,
    perk: "Available now",
    badge: "Popular choice",
  },
  {
    id: "vip-soundscape",
    name: "VIP · Soundscape",
    tagline: "Elevated mezzanine & spatial audio",
    description:
      "Priority fast-track entry, sound mezzanine access, bespoke frequency stream & private curated cocktail bar.",
    priceNgn: 65000,
    per: "person",
    passes: 1,
    perk: "Exclusive lounge pass",
    badge: "16 left",
  },
  {
    id: "squad-bundle",
    name: "Squad Bundle (4x)",
    tagline: "Collaborative group experience",
    description:
      "Group access with synchronized squad avatars, collaborative memory timelines, and fast group entry check-in.",
    priceNgn: 85000,
    per: "4 guests",
    passes: 4,
    perk: "Squad sync enabled",
    badge: "Save 15%",
  },
];

export const MAX_PASSES_PER_PERSON = 4;

// The one canonical pair (flow.md §5): ₦25,000 ≈ 16.50 USDC. Every tier converts at this rate.
export const NGN_PER_USDC = 25000 / 16.5;

// ex9 event strip on Select Access + its two handwritten asides (rendered in Space Grotesk
// italic: the script face isn't one of the two approved fonts, Q10).
export const accessPage = {
  highlights: ["Instant QR access", "Memory mint", "Sensory sync"],
  cardAside: "the room is alive!",
  totalAside: "almost full tonight!",
};

// ex20 pass details. Deterministic mock values: there is no real payment record in V1.
export const passTemplate = {
  number: 42,
  credential: "EXP-9042-SOL",
  serial: "8020 4918 9042",
  earlySync: "7:30 PM",
  entryProtocol:
    "Kuro / reflective dress code recommended. High-fidelity acoustic ear filters provided complimentary at gate synchronization.",
};

// ex14 "Mastercard •••• 4821 · Secured via Paystack": display text only. No card data exists anywhere.
export const savedCard = { brand: "Mastercard", last4: "4821", processor: "Paystack" };

// flow.md §5: The Neon Nomads, 8 people. Named members from ex26.
export const squad = {
  id: "neon-nomads",
  name: "The Neon Nomads",
  memberCount: 8,
  members: [
    currentUser,
    { id: "u-sinmi", name: "Sinmi", tone: "tertiary" },
    { id: "u-bode", name: "Bode", tone: "secondary" },
    { id: "u-salman", name: "Salman", tone: "primary" },
  ] satisfies Person[],
};

// ex16: Moments summary for Neon Solstice.
export const momentsSummary = {
  eventId: "neon-solstice",
  tag: "#ACID",
  arrivedAt: "8:14 PM",
  journey: [
    "Arrived at 8:14 PM",
    "Joined The Neon Nomads",
    "Responded 14 times",
    "Explored 3 spaces",
    "Saved 2 moments",
  ],
  energyScale: ["Curious", "Electric", "Calm"],
  memoryReady: true,
};

export function getEvent(id: string): ExperienceEvent | undefined {
  return events.find((event) => event.id === id);
}

/** Resolve a list of ids, skipping any that don't exist */
export function getEvents(ids: readonly string[]): ExperienceEvent[] {
  return ids.flatMap((id) => getEvent(id) ?? []);
}

/** Lowest tier price, shown as "From" on Event Details. Tiers only exist for Neon Solstice. */
export function lowestTier(eventId: string): Tier | undefined {
  if (eventId !== "neon-solstice") return undefined;
  return tiers.reduce((low, tier) => (tier.priceNgn < low.priceNgn ? tier : low));
}
