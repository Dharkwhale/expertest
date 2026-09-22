import { orderQuery, type PaymentMethod, type Quantities } from "@/lib/order";

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
  // S09 is M4: this route 404s until then
  wallet: (eventId: string, quantities: Quantities) =>
    withQuery(`/events/${eventId}/checkout/wallet`, orderQuery(quantities, "usdc")),
  pass: (eventId: string, quantities: Quantities, method: PaymentMethod) =>
    withQuery(`/events/${eventId}/pass`, orderQuery(quantities, method)),
};
