"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Wordmark } from "@/components/Wordmark";
import { hasBeenWelcomed } from "@/lib/first-visit";

// How long the splash holds before advancing (ex2 is a launch screen, no controls).
const SPLASH_MS = 2400;

// flow.md: S01 → S02 (/welcome) on first visit, else S03 (/home). Q3, 2026-09-21.
// The server can't read localStorage, so the no-JS / skip link always offers /welcome.
const FIRST_VISIT_ROUTE = "/welcome";
const RETURNING_ROUTE = "/home";

export function Splash() {
  const router = useRouter();

  useEffect(() => {
    const next = hasBeenWelcomed() ? RETURNING_ROUTE : FIRST_VISIT_ROUTE;
    router.prefetch(next);
    const timer = window.setTimeout(() => router.replace(next), SPLASH_MS);
    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <main className="bg-splash relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <h1>
        <Wordmark className="text-hero drop-shadow-lg" />
      </h1>
      <p className="mt-3 max-w-64 text-neutral-50/90 md:max-w-none md:text-lg">
        Discover. Participate. <br className="md:hidden" />
        Generate. Remember.
      </p>

      {/* No visual change: lets keyboard / screen-reader users skip the wait, and
          gives no-JS visitors a way in. */}
      <Link
        href={FIRST_VISIT_ROUTE}
        className="sr-only focus:not-sr-only focus:mt-6 focus:rounded-full focus:bg-neutral-950/70 focus:px-4 focus:py-2"
      >
        Continue to Exper
      </Link>

      <p className="absolute bottom-8 text-xs text-neutral-50/70">Exper</p>
    </main>
  );
}
