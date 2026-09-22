"use client";

import { useEffect, useState } from "react";

// ex24's radar with its "01:00" badge. The time counts down once per second and stops at
// 00:00 (no design shows what happens after). The ring itself is static: ex24 draws no
// motion. The minute is announced once, not every tick (aria-live off on the timer).
function format(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function CountdownRing({ seconds }: { seconds: number }) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    const timer = window.setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative grid place-items-center">
      <span aria-hidden="true" className="absolute size-56 rounded-full bg-secondary/15 blur-3xl" />
      <svg viewBox="0 0 120 120" className="relative size-40 text-secondary" aria-hidden="true">
        <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeDasharray="2 4" />
        <path d="M60 4v8M60 108v8M4 60h8M108 60h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="60" cy="60" r="34" className="fill-neutral-950" />
        <circle cx="60" cy="60" r="20" fill="none" stroke="currentColor" strokeOpacity="0.6" />
        <circle cx="60" cy="60" r="5" fill="currentColor" />
      </svg>
      <p className="label-caps relative -mt-5 rounded-full bg-neutral-950 px-3 py-1 text-secondary tabular-nums">
        <span className="sr-only">Time left: </span>
        <time dateTime={`PT${left}S`}>{format(left)}</time>
      </p>
    </div>
  );
}
