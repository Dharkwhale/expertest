"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Counts route views inside this tab's app session. BackButton uses it instead of
// history.length, which also counts pages from before the app loaded, so on a deep
// link "back" would leave the site (found verifying S05, 2026-09-21).
let routeViews = 0;
let lastPathname: string | null = null;

export function canGoBackInApp(): boolean {
  return routeViews > 1;
}

export function NavigationTracker() {
  const pathname = usePathname();
  useEffect(() => {
    // Count changes, not effect runs: Strict Mode runs effects twice on mount in dev
    if (pathname === lastPathname) return;
    lastPathname = pathname;
    routeViews += 1;
  }, [pathname]);
  return null;
}
