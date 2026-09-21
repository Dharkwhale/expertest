// Per-browser "has seen the Lander" flag (Q3: /welcome on first visit only).
// A UX convenience, not security: nothing depends on it being trustworthy.
export const WELCOMED_KEY = "exper.welcomed";

export function hasBeenWelcomed(): boolean {
  try {
    return window.localStorage.getItem(WELCOMED_KEY) === "1";
  } catch {
    return false;
  }
}
