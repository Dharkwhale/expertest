import { parseOrder, passCount, type PaymentMethod, type Quantities } from "@/lib/order";
import { lowestTier } from "@/mock/data";

type SearchParams = Record<string, string | string[] | undefined>;

export type CheckoutStep =
  | { kind: "ok"; quantities: Quantities; method: PaymentMethod | undefined }
  | { kind: "not-on-sale" }
  | { kind: "problem"; reason: "invalid" | "too-many" | "empty" };

/**
 * Shared gate for S07, S08 and S11: is this event on sale, and is the order in the URL
 * usable? Pages render OrderProblem / the not-on-sale state instead of guessing.
 */
export function resolveCheckout(eventId: string, query: SearchParams): CheckoutStep {
  if (!lowestTier(eventId)) return { kind: "not-on-sale" };
  const parsed = parseOrder(query);
  if (!parsed.ok) return { kind: "problem", reason: parsed.reason };
  if (passCount(parsed.quantities) === 0) return { kind: "problem", reason: "empty" };
  return { kind: "ok", quantities: parsed.quantities, method: parsed.method };
}
