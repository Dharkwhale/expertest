"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform, useVelocity } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ProgressiveBlur } from "@/components/glass/ProgressiveBlur";
import { cx } from "@/lib/cx";
import { NAV_ITEMS, isActive } from "./nav-items";

// Mobile/tablet-portrait nav (ex3, ex16), as a floating liquid-glass pill. Hidden from md up,
// where TopNav takes over. The glass is static CSS (no feDisplacementMap, no WebGL, no glass
// library); Framer Motion drives the droplet only.
//
// The droplet is a single element positioned from the tabs' MEASURED geometry, so it can
// either spring between tabs on navigation or track a finger during a drag. Dragging scrubs
// it across the bar and navigates on release; a plain tap navigates through the link itself,
// so keyboard and screen-reader users are unaffected.
const SPRING = { type: "spring" as const, stiffness: 400, damping: 30, mass: 0.8 };
const TAP_SLOP = 8; // movement under this stays a tap, not a drag
const OVERSHOOT = 8; // px the droplet may rubber-band past the end — the pill's padding
const MAX_STRETCH = 0.25; // scaleX up to 1.25 at speed
const IMPACT_SQUASH = 0.92; // vertical squash as the droplet lands

type Cell = { left: number; width: number };

// Navigating between route groups ((tabs) <-> (live)) remounts this bar — and the two groups
// load their own copy of this module — so an in-flight ripple would be lost. The arrival is
// handed over through sessionStorage, read once when the new bar mounts and cleared there.
const ARRIVAL_KEY = "exper.tabArrival";

function markArrival(index: number) {
  try {
    window.sessionStorage.setItem(ARRIVAL_KEY, String(index));
  } catch {
    // storage blocked: the ripple just doesn't survive the remount
  }
}

function readArrival(): number {
  try {
    return Number(window.sessionStorage.getItem(ARRIVAL_KEY) ?? -1);
  } catch {
    return -1;
  }
}

function clearArrival() {
  try {
    window.sessionStorage.removeItem(ARRIVAL_KEY);
  } catch {
    // nothing to clean up
  }
}

// The rings are a fixed 8px and scale up, so the target scale comes from the tab's measured
// width: the lead ring reaches ~2.5x the tab, the trailing one a little less.
function rippleScale(width?: number) {
  const w = width ?? 0;
  return {
    "--ripple-scale": ((w * 2.5) / 8).toFixed(2),
    "--ripple-scale-trail": ((w * 1.7) / 8).toFixed(2),
  } as React.CSSProperties;
}

export function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const reduced = useReducedMotion() ?? false;

  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [cells, setCells] = useState<Cell[]>([]);
  // Which tab the droplet is over while scrubbing. Tagged with the path it was set on, so it
  // lapses by itself once navigation lands and the lit tab falls back to the route's own.
  const [scrub, setScrub] = useState<{ index: number; path: string } | null>(null);

  const activeIndex = NAV_ITEMS.findIndex(({ href }) => isActive(pathname, href));
  const index = activeIndex === -1 ? 0 : activeIndex;

  const x = useMotionValue(0);
  const velocity = useVelocity(x);
  // stretch toward the direction of travel, proportional to speed
  const scaleX = useTransform(velocity, (v) => (reduced ? 1 : 1 + Math.min(Math.abs(v) / 3200, MAX_STRETCH)));
  // the landing squash, multiplied into the travel stretch so the two never fight
  const impact = useMotionValue(1);
  const scaleY = useTransform([scaleX, impact], ([s, i]: number[]) => (1 - (s - 1) * 0.4) * i);

  const land = useCallback(() => {
    if (reduced) return;
    impact.set(IMPACT_SQUASH);
    animate(impact, 1, { type: "spring", stiffness: 600, damping: 18, mass: 0.6 });
  }, [impact, reduced]);

  // Measure the tabs. ResizeObserver covers rotation and collapsing browser chrome, so the
  // droplet is never positioned from stale geometry.
  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const base = list.getBoundingClientRect().left;
    setCells(
      itemRefs.current.filter(Boolean).map((li) => {
        const r = li!.getBoundingClientRect();
        return { left: r.left - base, width: r.width };
      }),
    );
  }, []);

  useLayoutEffect(() => {
    measure();
    const list = listRef.current;
    if (!list || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(list);
    return () => observer.disconnect();
  }, [measure]);

  const litIndex = scrub && scrub.path === pathname ? scrub.index : index;

  // A ripple fires on arrival only. Changing this key remounts the rings, so the CSS
  // animation replays from the start and any in-flight pair is cancelled — rapid taps can
  // never stack. `firstIndex` keeps the very first render (a page load) from rippling.
  const [firstIndex] = useState(index);
  const [dragArrivals, setDragArrivals] = useState(0);
  const rippleKey = `${litIndex}:${dragArrivals}`;
  const [handedOver] = useState(() => (typeof window === "undefined" ? -1 : readArrival()));
  const rippled = index !== firstIndex || dragArrivals > 0 || handedOver === index;

  // Park the droplet on the active tab whenever the route or the geometry changes
  useEffect(() => {
    const cell = cells[index];
    if (!cell) return;
    if (reduced) x.set(cell.left);
    else animate(x, cell.left, SPRING);
    if (index !== firstIndex || handedOver === index) land();
    clearArrival();
  }, [cells, firstIndex, handedOver, index, land, reduced, x]);

  const drag = useRef({ active: false, moved: false, pointerId: -1, startX: 0, startY: 0 });

  const nearestIndex = useCallback(
    (left: number) => {
      let best = 0;
      let bestGap = Infinity;
      cells.forEach((cell, i) => {
        const gap = Math.abs(cell.left - left);
        if (gap < bestGap) {
          bestGap = gap;
          best = i;
        }
      });
      return best;
    },
    [cells],
  );

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!cells.length) return;
    drag.current = { active: false, moved: false, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (state.pointerId !== event.pointerId || !cells.length) return;
    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;

    if (!state.active) {
      // vertical intent wins: hand the gesture back to the page so it can scroll
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > TAP_SLOP) {
        state.pointerId = -1;
        return;
      }
      if (Math.abs(dx) <= TAP_SLOP) return;
      state.active = true;
      state.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    const first = cells[0].left;
    const last = cells[cells.length - 1].left;
    const raw = (cells[index]?.left ?? first) + dx;
    // Rubber-band past either end: resistance grows with distance and never exceeds the
    // pill's own padding, so however hard you pull, the droplet stays inside the pill.
    const resist = (over: number) => OVERSHOOT * (1 - 1 / (1 + over / OVERSHOOT));
    const clamped = raw < first ? first - resist(first - raw) : raw > last ? last + resist(raw - last) : raw;
    x.set(clamped);
    const over = nearestIndex(clamped);
    setScrub((prev) => (prev && prev.index === over && prev.path === pathname ? prev : { index: over, path: pathname }));
  }

  const endDrag = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const state = drag.current;
      if (state.pointerId !== event.pointerId) return;
      state.pointerId = -1;
      if (!state.active) return; // a tap: the link navigates on its own
      state.active = false;

      // snap to the nearest tab — including when the finger lifts outside the pill
      const target = nearestIndex(x.get());
      const cell = cells[target];
      if (cell) {
        if (reduced) x.set(cell.left);
        else animate(x, cell.left, SPRING);
      }
      setScrub({ index: target, path: pathname });
      setDragArrivals((n) => n + 1);
      markArrival(target);
      land();
      if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") navigator.vibrate(10);
      const href = NAV_ITEMS[target]?.href;
      if (href && target !== index) router.push(href);
      // release the click-suppression after this gesture's click has been swallowed
      window.setTimeout(() => {
        state.moved = false;
      }, 0);
    },
    [cells, index, land, nearestIndex, pathname, reduced, router, x],
  );

  const dropletWidth = cells[litIndex]?.width ?? 0;

  return (
    <nav
      aria-label="Main"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] md:hidden"
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        // touch-pan-y keeps vertical scrolling with the page; we only take over horizontally
        className="glass-high pointer-events-auto relative isolate w-full max-w-md touch-pan-y overflow-hidden rounded-full p-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)] select-none"
      >
        <ProgressiveBlur className="-z-10" />
        <span aria-hidden="true" className="glass-spec" />
        <ul ref={listRef} className="relative grid grid-cols-5">
          {/* One droplet for the whole bar, positioned from the measured cells */}
          {cells.length > 0 && (
            <motion.span
              aria-hidden="true"
              style={{ x, width: dropletWidth, scaleX, scaleY }}
              className="glass-droplet pointer-events-none absolute top-0 bottom-0 left-0 rounded-full"
            >
              <span className="glass-arc" />
            </motion.span>
          )}
          {NAV_ITEMS.map(({ href, label, icon: Icon }, i) => {
            const lit = litIndex === i;
            return (
              <li
                key={href}
                ref={(node) => {
                  itemRefs.current[i] = node;
                }}
                className="relative"
              >
                <Link
                  href={href}
                  data-tab-link
                  // links are natively draggable: without this the browser starts a
                  // drag-and-drop on mouse down and swallows the rest of the gesture
                  draggable={false}
                  onClick={(event) => {
                    // a drag already navigated on release; swallow its trailing click
                    if (drag.current.moved) event.preventDefault();
                    else markArrival(i);
                  }}
                  aria-current={isActive(pathname, href) ? "page" : undefined}
                  className={cx(
                    "relative flex min-h-12 w-full flex-col items-center justify-center gap-0.5 rounded-full px-1 py-2 text-nav transition-colors duration-200 ease-out",
                    lit ? "text-primary" : "text-neutral-50/60 hover:text-neutral-50",
                  )}
                >
                  {lit && (
                    // A hint of lime behind the icon, small enough not to tint the lens
                    <span aria-hidden="true" className="absolute top-3 size-6 rounded-full bg-primary/20 blur-md" />
                  )}
                  <span className="relative grid place-items-center">
                    {/* rings sit under the icon and above the droplet; clipped by the pill */}
                    {!reduced && rippled && lit && (
                      <span
                        key={rippleKey}
                        aria-hidden="true"
                        style={rippleScale(cells[i]?.width)}
                        className="absolute"
                      >
                        <span className="glass-ripple" />
                        <span className="glass-ripple glass-ripple-trail" />
                      </span>
                    )}
                    <Icon className="relative size-5" />
                  </span>
                  <span className="relative w-full truncate text-center leading-none tracking-normal">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
