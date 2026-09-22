"use client";

import { useSyncExternalStore } from "react";
import { ArrowRightIcon, CheckCircleIcon, CloseIcon, UserIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import { UnavailableButton } from "@/components/ui/UnavailableButton";

// S12 pre-event notification (ex23) as an in-app card at the top of Home (Q4 a, D5 a).
// Only the notification card is kept; the lock-screen chrome (clock, swipe, camera) is not.
// Dismissing hides it for this browser session: a per-viewer convenience, so storage
// failures just mean it shows again.
const DISMISSED_KEY = "exper.liveNotice.dismissed";

const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
function readDismissed(): boolean {
  try {
    return window.sessionStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    return false; // storage blocked: keep showing it
  }
}
function dismiss() {
  try {
    window.sessionStorage.setItem(DISMISSED_KEY, "1");
  } catch {
    // storage blocked: the card comes back on the next reload
  }
  hiddenThisPage = true;
  listeners.forEach((listener) => listener());
}
// Covers blocked storage: once dismissed, stay hidden for this page's lifetime
let hiddenThisPage = false;

export function NotificationCard({
  channel,
  passCode,
  title,
  body,
  roomTag,
  room,
  people,
  inRoom,
  href,
}: {
  channel: string;
  passCode: string;
  title: string;
  body: string;
  roomTag: string;
  room: string;
  people: string;
  inRoom: string;
  href: string;
}) {
  // Server render (no storage) shows the card; the client hides it if dismissed this session
  const dismissed = useSyncExternalStore(subscribe, () => hiddenThisPage || readDismissed(), () => false);

  if (dismissed) return null;

  return (
    <section
      aria-labelledby="live-notice-title"
      className="flex flex-col gap-4 rounded-card border border-neutral-800 bg-neutral-900 p-4 md:p-5 lg:max-w-2xl"
    >
      <header className="flex items-center gap-3 border-b border-neutral-800 pb-3">
        <span aria-hidden="true" className="label-caps grid size-9 shrink-0 place-items-center rounded-thumb border border-primary/60 bg-neutral-950 text-primary">
          Exp
        </span>
        <p className="min-w-0 flex-1 truncate text-sm">
          <span className="font-semibold text-neutral-50">EXPER</span>
          <span className="label-caps text-neutral-400"> · {channel}</span>
        </p>
        <span className="label-caps hidden rounded-thumb bg-neutral-800 px-2 py-1 text-neutral-400 sm:inline">{passCode}</span>
        <span className="flex items-center gap-1.5 text-sm text-neutral-400">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
          now
        </span>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss notification"
          className="-mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-50 [&_svg]:size-5"
        >
          <CloseIcon />
        </button>
      </header>

      <div>
        <h2 id="live-notice-title" className="text-lg font-semibold text-neutral-50">
          {title}
        </h2>
        <p className="text-neutral-200">{body}</p>
      </div>

      <div className="flex flex-col gap-2 rounded-thumb bg-neutral-950 p-3">
        <p className="flex flex-wrap items-center gap-2 text-sm text-neutral-50">
          <span className="label-caps rounded-thumb border border-primary/60 bg-primary/10 px-2 py-0.5 text-primary">{roomTag}</span>
          {room}
        </p>
        <p className="flex items-center gap-2 text-sm text-neutral-400">
          <UserIcon className="size-4" />
          {people} · {inRoom} in room
        </p>
      </div>

      <ButtonLink href={href} size="lg" fullWidth>
        Open Exper
        <ArrowRightIcon className="size-5" />
      </ButtonLink>

      <div className="flex flex-wrap items-center justify-between gap-x-4 text-sm text-neutral-400">
        <p className="flex items-center gap-2">
          <CheckCircleIcon className="size-4 text-primary" />
          Pass active on device
        </p>
        <UnavailableButton label="View venue coordinates" className="hover:text-neutral-400">
          View venue coordinates →
        </UnavailableButton>
      </div>
    </section>
  );
}
