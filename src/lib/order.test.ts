import { describe, expect, it } from "vitest";
import {
  DEFAULT_QUANTITIES,
  canAdd,
  orderQuery,
  orderTotals,
  parseOrder,
  passCount,
  toUsdc,
  type Quantities,
} from "./order";

const q = (general = 0, vip = 0, squad = 0): Quantities => ({
  general,
  "vip-soundscape": vip,
  "squad-bundle": squad,
});

describe("toUsdc", () => {
  it("converts at the canonical pair: ₦25,000 ≈ 16.50 USDC", () => {
    expect(toUsdc(25000)).toBe(16.5);
  });

  it("rounds to cents", () => {
    expect(toUsdc(65000)).toBe(42.9);
    expect(toUsdc(85000)).toBe(56.1);
    expect(toUsdc(1)).toBe(0);
  });
});

describe("parseOrder", () => {
  it("reads quantities and method", () => {
    expect(parseOrder({ general: "2", "squad-bundle": "0", method: "card" })).toEqual({
      ok: true,
      quantities: q(2),
      method: "card",
    });
  });

  it("treats missing tiers as 0 and a missing method as undefined", () => {
    expect(parseOrder({ "vip-soundscape": "1" })).toEqual({ ok: true, quantities: q(0, 1), method: undefined });
  });

  it("reports whether the URL carried an order at all", () => {
    const empty = parseOrder({});
    expect(empty.ok && passCount(empty.quantities)).toBe(0);
  });

  it.each([
    ["negative", { general: "-1" }],
    ["decimal", { general: "1.5" }],
    ["non-numeric", { general: "two" }],
    ["exponent", { general: "1e1" }],
    ["above 4", { general: "5" }],
    ["huge", { general: "99999999999999999999" }],
    ["empty string", { general: "" }],
    ["padded", { general: " 1" }],
    ["repeated param", { general: ["1", "2"] }],
    ["unknown method", { general: "1", method: "cash" }],
  ])("rejects %s input", (_label, params) => {
    expect(parseOrder(params)).toEqual({ ok: false, reason: "invalid" });
  });

  it("ignores unknown params (they never become prices or tiers)", () => {
    expect(parseOrder({ general: "1", price: "1", "platinum-tier": "3" })).toEqual({
      ok: true,
      quantities: q(1),
      method: undefined,
    });
  });

  it("rejects more than 4 passes in total", () => {
    expect(parseOrder({ general: "4", "vip-soundscape": "1" })).toEqual({ ok: false, reason: "too-many" });
    // A Squad Bundle is 4 passes on its own
    expect(parseOrder({ "squad-bundle": "1", general: "1" })).toEqual({ ok: false, reason: "too-many" });
    expect(parseOrder({ "squad-bundle": "2" })).toEqual({ ok: false, reason: "too-many" });
  });

  it("accepts exactly 4 passes", () => {
    expect(parseOrder({ "squad-bundle": "1" }).ok).toBe(true);
    expect(parseOrder({ general: "3", "vip-soundscape": "1" }).ok).toBe(true);
  });
});

describe("passCount / canAdd", () => {
  it("counts a Squad Bundle as 4 passes", () => {
    expect(passCount(q(1, 1, 0))).toBe(2);
    expect(passCount(q(0, 0, 1))).toBe(4);
  });

  it("allows adding only while the result stays within 4 passes", () => {
    expect(canAdd(q(3), "general")).toBe(true);
    expect(canAdd(q(4), "general")).toBe(false);
    expect(canAdd(q(1), "squad-bundle")).toBe(false);
    expect(canAdd(q(0), "squad-bundle")).toBe(true);
  });

  it("defaults to 1× General Access (flow.md §5 demo path)", () => {
    expect(DEFAULT_QUANTITIES).toEqual(q(1));
  });
});

describe("orderTotals", () => {
  it("prices a single tier from mock data, fees included", () => {
    const totals = orderTotals(q(1));
    expect(totals.totalNgn).toBe(25000);
    expect(totals.totalUsdc).toBe(16.5);
    expect(totals.passes).toBe(1);
    expect(totals.lines.map((l) => [l.tier.id, l.qty, l.subtotalNgn])).toEqual([["general", 1, 25000]]);
  });

  it("sums mixed tiers and lists only chosen lines, in tier order", () => {
    const totals = orderTotals(q(2, 1));
    expect(totals.lines.map((l) => l.tier.id)).toEqual(["general", "vip-soundscape"]);
    expect(totals.totalNgn).toBe(2 * 25000 + 65000);
    expect(totals.passes).toBe(3);
  });

  it("prices a Squad Bundle as one unit that admits 4", () => {
    const totals = orderTotals(q(0, 0, 1));
    expect(totals.totalNgn).toBe(85000);
    expect(totals.passes).toBe(4);
  });
});

describe("orderQuery", () => {
  it("writes only chosen tiers, plus the method", () => {
    expect(orderQuery(q(1, 0, 0), "card")).toBe("general=1&method=card");
    expect(orderQuery(q(2, 1, 0))).toBe("general=2&vip-soundscape=1");
  });

  it("round-trips through parseOrder", () => {
    const quantities = q(1, 2, 0);
    const params = Object.fromEntries(new URLSearchParams(orderQuery(quantities, "usdc")));
    expect(parseOrder(params)).toEqual({ ok: true, quantities, method: "usdc" });
  });
});
