import { cx } from "@/lib/cx";

// Stand-in wordmark. ex2's "EXPER" logo is custom brush lettering with no font or
// asset in the repo; Anton is used until the logo file (SVG) is supplied. See gaps.md.
export function Wordmark({ className }: { className?: string }) {
  return <span className={cx("font-display uppercase tracking-wide", className)}>Exper</span>;
}
