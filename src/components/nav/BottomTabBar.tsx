"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cx } from "@/lib/cx";
import { NAV_ITEMS, isActive } from "./nav-items";

// The sliding lens behind the active tab. `layoutId` makes Framer Motion travel the element
// between tabs instead of cross-fading it. The squash on tap is the "liquid" part; with
// reduced motion it becomes a plain cross-fade and never travels.
const SPRING = { type: "spring" as const, stiffness: 400, damping: 30, mass: 0.8 };
const SQUASH_MS = 260;

function Droplet({ squashing, reduced }: { squashing: boolean; reduced: boolean }) {
  if (reduced) {
    return (
      <motion.span
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-droplet absolute inset-0 rounded-full"
      >
        <span className="glass-arc" />
      </motion.span>
    );
  }

  return (
    <motion.span
      aria-hidden="true"
      layoutId="tab-droplet"
      transition={SPRING}
      animate={squashing ? { scaleX: 1.08, scaleY: 0.94 } : { scaleX: 1, scaleY: 1 }}
      className="glass-droplet absolute inset-0 rounded-full"
    >
      <span className="glass-arc" />
    </motion.span>
  );
}

// Mobile/tablet-portrait nav (ex3, ex16). Hidden from md up, where TopNav takes over.
//
// Glass trial (branch `glass-trial`, round 5): on the Moments screens — the list and the
// memory reveal — the bar becomes a floating liquid-glass pill. Every other screen keeps the
// flush bar below, byte for byte. The glass itself is static CSS (no feDisplacementMap, no
// WebGL, no glass library); only the droplet's travel uses Framer Motion (round 6).
function isTrialScreen(pathname: string): boolean {
  return pathname === "/moments" || pathname.startsWith("/moments/");
}

export function BottomTabBar() {
  const pathname = usePathname();
  const floating = isTrialScreen(pathname);
  const reduced = useReducedMotion() ?? false;
  const [squashing, setSquashing] = useState(false);

  // The squash is a pulse: it releases on its own once the droplet is travelling
  useEffect(() => {
    if (!squashing) return;
    const timer = window.setTimeout(() => setSquashing(false), SQUASH_MS);
    return () => window.clearTimeout(timer);
  }, [squashing]);

  // The wrapper spans the width; the pill inside is content-width and centred, so there is
  // visible background on both sides of it.
  if (floating) {
    return (
      <nav
        aria-label="Main"
        className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-5 pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <div className="glass-high pointer-events-auto relative mx-auto inline-flex w-auto max-w-[calc(100vw-2.5rem)] items-center overflow-hidden rounded-full px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {/* Specular sheen across the pill */}
          <span aria-hidden="true" className="glass-spec" />
          <ul className="relative flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href} className="relative">
                  {active && <Droplet squashing={squashing} reduced={reduced} />}
                  <Link
                    href={href}
                    onClick={() => setSquashing(true)}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      // The colour and scale land as the droplet arrives, hence the delay
                      "relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-full px-3 text-xs transition-all delay-150 duration-200 ease-out active:scale-95",
                      active ? "scale-105 text-primary" : "text-neutral-50/60 hover:text-neutral-50",
                    )}
                  >
                    {active && (
                      // Lime glow behind the active icon
                      <span aria-hidden="true" className="absolute top-2 size-9 rounded-full bg-primary/30 blur-lg" />
                    )}
                    <Icon className="relative size-6" />
                    <span className="relative">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-800 bg-neutral-900/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "relative flex min-h-16 flex-col items-center justify-center gap-1 text-xs transition-colors",
                  active ? "text-primary" : "text-neutral-400 hover:text-neutral-50",
                )}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute top-2 right-1/2 size-1.5 translate-x-4 rounded-full bg-primary"
                  />
                )}
                <Icon className="size-6" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
