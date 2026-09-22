import { describe, expect, it } from "vitest";
import { checkoutRoutes } from "./checkout-routes";
import { DEFAULT_QUANTITIES, orderTotals, parseOrder } from "./order";
import { parseWallet } from "./wallet";

describe("parseWallet", () => {
  it("accepts no wallet (the generic Connect Wallet button)", () => {
    expect(parseWallet({})).toEqual({ ok: true, wallet: undefined });
  });

  it("accepts each ex17 wallet id", () => {
    for (const id of ["metamask", "walletconnect", "coinbase", "rainbow"]) {
      const parsed = parseWallet({ wallet: id });
      expect(parsed.ok && parsed.wallet?.id).toBe(id);
    }
  });

  it("rejects unknown, repeated, empty and case-shifted values", () => {
    expect(parseWallet({ wallet: "phantom" }).ok).toBe(false);
    expect(parseWallet({ wallet: ["metamask", "rainbow"] }).ok).toBe(false);
    expect(parseWallet({ wallet: "" }).ok).toBe(false);
    expect(parseWallet({ wallet: "MetaMask" }).ok).toBe(false);
    expect(parseWallet({ wallet: "<script>" }).ok).toBe(false);
  });
});

describe("USDC path routes", () => {
  const params = (href: string) => Object.fromEntries(new URL(href, "http://x").searchParams);

  it("S09 → S10 carries the order, method=usdc and the wallet", () => {
    const href = checkoutRoutes.crypto("neon-solstice", DEFAULT_QUANTITIES, "metamask");
    expect(href.startsWith("/events/neon-solstice/checkout/crypto?")).toBe(true);
    expect(params(href)).toEqual({ general: "1", method: "usdc", wallet: "metamask" });
  });

  it("omits the wallet when none was picked", () => {
    expect(params(checkoutRoutes.crypto("neon-solstice", DEFAULT_QUANTITIES))).toEqual({
      general: "1",
      method: "usdc",
    });
  });

  it("the order still parses with the wallet param present, and totals 16.50 USDC", () => {
    const parsed = parseOrder(params(checkoutRoutes.crypto("neon-solstice", DEFAULT_QUANTITIES, "rainbow")));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.method).toBe("usdc");
      expect(orderTotals(parsed.quantities)).toMatchObject({ totalNgn: 25000, totalUsdc: 16.5 });
    }
  });

  it("the pass after USDC is marked method=usdc", () => {
    expect(params(checkoutRoutes.pass("neon-solstice", DEFAULT_QUANTITIES, "usdc"))).toEqual({
      general: "1",
      method: "usdc",
    });
  });
});
