"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";
import { NAV_ITEMS, isActive } from "./nav-items";

// Mobile/tablet-portrait nav (ex3, ex16). Hidden from md up, where TopNav takes over.
export function BottomTabBar() {
  const pathname = usePathname();

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
