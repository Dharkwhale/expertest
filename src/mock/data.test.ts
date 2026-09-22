import { describe, expect, it } from "vitest";
import { events, getEvent, getEvents, lowestTier, tiers } from "./data";

describe("mock data helpers", () => {
  it("getEvents resolves ids in order and skips unknown ones", () => {
    expect(getEvents(["sound-scape", "nope", "art-x"]).map((e) => e.id)).toEqual(["sound-scape", "art-x"]);
  });

  it("lowestTier is General Access at ₦25,000 (flow.md §5 canonical price)", () => {
    const tier = lowestTier("neon-solstice");
    expect(tier?.id).toBe("general");
    expect(tier?.priceNgn).toBe(25000);
  });

  it("a Squad Bundle uses 4 passes against the cap; the others use 1", () => {
    expect(Object.fromEntries(tiers.map((t) => [t.id, t.passes]))).toEqual({
      general: 1,
      "vip-soundscape": 1,
      "squad-bundle": 4,
    });
  });

  it("only Neon Solstice has tiers (GAP-007)", () => {
    expect(lowestTier("sound-scape")).toBeUndefined();
  });

  it("canonical data stays consistent with flow.md §5", () => {
    const neon = getEvent("neon-solstice");
    expect(neon?.venue).toBe("Main Hall & Resonance Pavilion");
    expect(neon?.timeLabel).toBe("8:00 PM");
    expect(neon?.details?.host.handle).toBe("@aura_pilot");
    expect(tiers.map((t) => t.priceNgn)).toEqual([25000, 65000, 85000]);
  });

  it("event ids are unique (they're URL segments)", () => {
    const ids = events.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
