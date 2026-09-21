import type { ComponentType, SVGProps } from "react";
import { BookmarkIcon, HomeIcon, LiveIcon, SearchIcon, UserIcon } from "@/components/icons";

// Canonical tab bar (flow.md §1): Home · Explore · Live · Moments · You.
// The same items drive the mobile bottom bar and the desktop top nav (CLAUDE.md §6.1).
export type NavItem = {
  href: "/home" | "/explore" | "/live" | "/moments" | "/you";
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/home", label: "Home", icon: HomeIcon },
  { href: "/explore", label: "Explore", icon: SearchIcon },
  { href: "/live", label: "Live", icon: LiveIcon },
  { href: "/moments", label: "Moments", icon: BookmarkIcon },
  { href: "/you", label: "You", icon: UserIcon },
];

/** A tab stays active on its nested routes (e.g. /live/squad keeps Live lit). */
export function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
