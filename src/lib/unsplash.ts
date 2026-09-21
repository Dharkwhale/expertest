// Single source for Unsplash image URLs. next.config.ts allows exactly this query
// string on images.unsplash.com, so the optimizer can't be used to fetch arbitrary
// URLs. Build every Unsplash src with `unsplash()`; a hand-written URL will 400.
export const UNSPLASH_SEARCH = "?auto=format&fit=crop&w=1600&q=80";

export function unsplash(photoId: string): string {
  return `https://images.unsplash.com/photo-${photoId}${UNSPLASH_SEARCH}`;
}
