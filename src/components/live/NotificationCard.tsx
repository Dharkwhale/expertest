"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { ArrowRightIcon, CloseIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";

// The in-app version of ex23 / ex22's lock-screen notifications (Q4 a): only the card is
// kept, never the lock-screen chrome. S12 (Home) and S18 (/live) fill the body. Dismissing
// hides a card for this browser session, per card: a per-viewer convenience, so storage
// failures just mean it shows again.
const listeners = new Set<() => void>();
const hiddenThisPage = new Set<string>(); // covers blocked storage for this page's lifetime

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function isDismissed(key: string): boolean {
  if (hiddenThisPage.has(key)) return true;
  try {
    return window.sessionStorage.getItem(key) === "1";
  } catch {
    return false; // storage blocked: keep showing it
  }
}

function dismiss(key: string) {
  hiddenThisPage.add(key);
  try {
    window.sessionStorage.setItem(key, "1");
  } catch {
    // storage blocked: the card comes back on the next reload
  }
  listeners.forEach((listener) => listener());
}

export function NotificationCard({
  storageKey,
  titleId,
  channel,
  tag,
  time,
  cta,
  footer,
  children,
}: {
  /** sessionStorage key for "dismissed" */
  storageKey: string;
  /** id of the heading inside `children`, which names the card */
  titleId: string;
  channel: string;
  tag?: string;
  time: string;
  cta: { label: string; href: string };
  footer?: ReactNode;
  children: ReactNode;
}) {
  // Server render (no storage) shows the card; the client hides it if dismissed this session
  const dismissed = useSyncExternalStore(subscribe, () => isDismissed(storageKey), () => false);
  if (dismissed) return null;

  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col gap-4 rounded-card border border-neutral-800 bg-neutral-900 p-4 md:p-5 lg:max-w-2xl"
    >
      <header className="flex items-center gap-3 border-b border-neutral-800 pb-3">
        <span aria-hidden="true" className="label-caps grid size-9 shrink-0 place-items-center rounded-thumb border border-primary/60 bg-neutral-950 text-primary">
          Exp
        </span>
        {/* ex22's two-line header: app · channel, then tag + time. Nothing truncates at 375px */}
        <div className="min-w-0 flex-1">
          <p className="text-sm">
            <span className="font-semibold text-neutral-50">EXPER</span>
            <span className="label-caps text-neutral-400"> · {channel}</span>
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-neutral-400">
            {tag && <span className="label-caps rounded-thumb bg-neutral-800 px-2 py-0.5">{tag}</span>}
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
              {time}
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => dismiss(storageKey)}
          aria-label="Dismiss notification"
          className="-mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-50 [&_svg]:size-5"
        >
          <CloseIcon />
        </button>
      </header>

      {children}

      <ButtonLink href={cta.href} size="lg" fullWidth>
        {cta.label}
        <ArrowRightIcon className="size-5" />
      </ButtonLink>
      {footer}
    </section>
  );
}
