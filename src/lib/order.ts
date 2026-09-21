// The checkout order (M3 plan §2, decision D2): carried between screens in the URL as
// ?general=1&vip-soundscape=0&squad-bundle=0&method=card.
// URL input is hostile: only known tier ids, whole quantities 0–4, at most 4 passes in
// total. Prices are NEVER read from the URL; totals are always recomputed from mock data.
import { MAX_PASSES_PER_PERSON, NGN_PER_USDC, tiers, type Tier } from "@/mock/data";

export type TierId = Tier["id"];
export type Quantities = Record<TierId, number>;
export type PaymentMethod = "card" | "usdc";

type SearchParams = Record<string, string | string[] | undefined>;

export type ParsedOrder =
  | { ok: true; quantities: Quantities; method: PaymentMethod | undefined }
  | { ok: false; reason: "invalid" | "too-many" };

const METHODS: readonly PaymentMethod[] = ["card", "usdc"];
const WHOLE = /^\d+$/;

const NONE: Quantities = { general: 0, "vip-soundscape": 0, "squad-bundle": 0 };

/** flow.md §5 demo path: 1× General Access */
export const DEFAULT_QUANTITIES: Quantities = { ...NONE, general: 1 };

export function toUsdc(ngn: number): number {
  return Math.round((ngn / NGN_PER_USDC) * 100) / 100;
}

export function passCount(quantities: Quantities): number {
  return tiers.reduce((sum, tier) => sum + quantities[tier.id] * tier.passes, 0);
}

/** Whether one more unit of this tier still fits under the per-person cap (ex9: max 4). */
export function canAdd(quantities: Quantities, tierId: TierId): boolean {
  const tier = tiers.find((t) => t.id === tierId);
  return !!tier && passCount(quantities) + tier.passes <= MAX_PASSES_PER_PERSON;
}

export function parseOrder(params: SearchParams): ParsedOrder {
  const quantities = { ...NONE };

  for (const tier of tiers) {
    const raw = params[tier.id];
    if (raw === undefined) continue;
    if (typeof raw !== "string" || !WHOLE.test(raw)) return { ok: false, reason: "invalid" };
    const qty = Number(raw);
    if (qty > MAX_PASSES_PER_PERSON) return { ok: false, reason: "invalid" };
    quantities[tier.id] = qty;
  }

  const rawMethod = params.method;
  let method: PaymentMethod | undefined;
  if (rawMethod !== undefined) {
    method = METHODS.find((m) => m === rawMethod);
    if (!method) return { ok: false, reason: "invalid" };
  }

  if (passCount(quantities) > MAX_PASSES_PER_PERSON) return { ok: false, reason: "too-many" };
  return { ok: true, quantities, method };
}

export type OrderLine = { tier: Tier; qty: number; subtotalNgn: number };

export function orderTotals(quantities: Quantities) {
  const lines: OrderLine[] = tiers
    .filter((tier) => quantities[tier.id] > 0)
    .map((tier) => ({ tier, qty: quantities[tier.id], subtotalNgn: tier.priceNgn * quantities[tier.id] }));
  const totalNgn = lines.reduce((sum, line) => sum + line.subtotalNgn, 0);
  return { lines, totalNgn, totalUsdc: toUsdc(totalNgn), passes: passCount(quantities) };
}

/** Query string for the next step: only chosen tiers, then the method. */
export function orderQuery(quantities: Quantities, method?: PaymentMethod): string {
  const params = new URLSearchParams();
  for (const tier of tiers) if (quantities[tier.id] > 0) params.set(tier.id, String(quantities[tier.id]));
  if (method) params.set("method", method);
  return params.toString();
}
