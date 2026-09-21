import { describe, expect, it } from "vitest";
import { resolveCheckout } from "./checkout";

describe("resolveCheckout", () => {
  it("passes a valid order through", () => {
    expect(resolveCheckout("neon-solstice", { general: "1", method: "card" })).toEqual({
      kind: "ok",
      quantities: { general: 1, "vip-soundscape": 0, "squad-bundle": 0 },
      method: "card",
    });
  });

  it("stops events that have no tiers (decision D4 / GAP-007)", () => {
    expect(resolveCheckout("sound-scape", { general: "1" })).toEqual({ kind: "not-on-sale" });
  });

  it("stops an order with no passes rather than charging ₦0", () => {
    expect(resolveCheckout("neon-solstice", {})).toEqual({ kind: "problem", reason: "empty" });
    expect(resolveCheckout("neon-solstice", { general: "0" })).toEqual({ kind: "problem", reason: "empty" });
  });

  it("surfaces invalid and over-cap orders", () => {
    expect(resolveCheckout("neon-solstice", { general: "x" })).toEqual({ kind: "problem", reason: "invalid" });
    expect(resolveCheckout("neon-solstice", { general: "4", "squad-bundle": "1" })).toEqual({
      kind: "problem",
      reason: "too-many",
    });
  });
});
