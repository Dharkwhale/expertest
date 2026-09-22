import { orderQuery, type PaymentMethod, type Quantities } from "@/lib/order";
import type { WalletId } from "@/lib/wallet";

// One place that builds checkout URLs (flow.md §1 S06–S11), so every step links to the
// next and previous one with the same order in the query string (decision D2).
function withQuery(path: string, query: string): string {
  return query ? `${path}?${query}` : path;
}

export const checkoutRoutes = {
  details: (eventId: string) => `/events/${eventId}`,
  access: (eventId: string, quantities?: Quantities) =>
    withQuery(`/events/${eventId}/access`, quantities ? orderQuery(quantities) : ""),
  method: (eventId: string, quantities: Quantities, method?: PaymentMethod) =>
    withQuery(`/events/${eventId}/checkout`, orderQuery(quantities, method)),
  card: (eventId: string, quantities: Quantities) =>
    withQuery(`/events/${eventId}/checkout/card`, orderQuery(quantities, "card")),
  wallet: (eventId: string, quantities: Quantities) =>
    withQuery(`/events/${eventId}/checkout/wallet`, orderQuery(quantities, "usdc")),
  // S10: the wallet picked on S09 rides along (decision D6); none = the generic Connect button
  crypto: (eventId: string, quantities: Quantities, walletId?: WalletId) =>
    withQuery(
      `/events/${eventId}/checkout/crypto`,
      orderQuery(quantities, "usdc") + (walletId ? `&wallet=${encodeURIComponent(walletId)}` : ""),
    ),
  pass: (eventId: string, quantities: Quantities, method: PaymentMethod) =>
    withQuery(`/events/${eventId}/pass`, orderQuery(quantities, method)),
};
