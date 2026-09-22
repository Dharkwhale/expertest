// ex20's barcode: decorative, generated deterministically from the credential so every
// pass looks distinct but the same pass always renders the same. Not scannable, and
// hidden from assistive tech: the credential text next to it carries the meaning.
export function Barcode({ value, className }: { value: string; className?: string }) {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (const char of value.repeat(4)) {
    const code = char.charCodeAt(0);
    const bar = (code % 3) + 1;
    const gap = ((code >> 2) % 2) + 1;
    bars.push({ x, w: bar });
    x += bar + gap;
  }

  return (
    <svg
      viewBox={`0 0 ${x} 40`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {bars.map((bar) => (
        <rect key={bar.x} x={bar.x} y="0" width={bar.w} height="40" fill="currentColor" />
      ))}
    </svg>
  );
}
