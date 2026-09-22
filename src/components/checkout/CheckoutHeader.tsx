import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeftIcon, CloseIcon } from "@/components/icons";

type NavLink = { href: string; label: string; kind: "back" | "close" };

function NavButton({ href, label, kind }: NavLink) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex size-11 items-center justify-center rounded-full bg-neutral-800/80 text-neutral-50 transition-colors hover:bg-neutral-700 active:scale-98 [&_svg]:size-5"
    >
      {kind === "back" ? <ChevronLeftIcon /> : <CloseIcon />}
    </Link>
  );
}

// Checkout screen header (ex9, ex13, ex14, ex20, ex17, ex11): one nav control left, centred
// title, an optional item right. ex17 has back *and* ✕, so `close` draws a second nav control
// on the right. The checkout has no app nav, so this is the only way back. Back is an explicit
// link to the previous step (with the order in the URL), not history.back(), so it's
// predictable even when a step was opened directly.
export function CheckoutHeader({
  title,
  nav,
  close,
  right,
}: {
  title: ReactNode;
  nav: NavLink;
  close?: { href: string; label: string };
  right?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[2.75rem_1fr_auto] items-center gap-3 py-3 md:py-5">
      <NavButton {...nav} />
      <div className="min-w-0 text-center">{title}</div>
      <div className="flex min-w-11 justify-end">{close ? <NavButton {...close} kind="close" /> : right}</div>
    </header>
  );
}
