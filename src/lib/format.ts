// Fixed locale so server and client render the same string (no hydration mismatch).
const whole = new Intl.NumberFormat("en-US");
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

/** 1240 → "1,240" (ex3, ex10) */
export function formatCount(value: number): string {
  return whole.format(value);
}

/** 1240 → "1.2K" (ex5, ex7) */
export function formatCompact(value: number): string {
  return compact.format(value);
}

/** 25000 → "₦25,000" */
export function formatNgn(value: number): string {
  return `₦${whole.format(value)}`;
}
