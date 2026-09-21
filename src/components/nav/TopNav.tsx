"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/Wordmark";
import { Avatar } from "@/components/ui/Avatar";
import { cx } from "@/lib/cx";
import { currentUser } from "@/mock/data";
import { NAV_ITEMS, isActive } from "./nav-items";

// md+ nav (CLAUDE.md §6.1): logo left, the same tab items as links, profile right. No sidebar.
export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 hidden border-b border-neutral-800 bg-neutral-950/85 backdrop-blur md:block">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 md:px-8 lg:gap-10">
        <Link href="/home" aria-label="Exper home" className="shrink-0">
          <Wordmark className="text-2xl" />
        </Link>

        <nav aria-label="Main" className="flex-1">
          <ul className="flex items-center gap-1 lg:gap-2">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "flex min-h-10 items-center gap-2 rounded-full px-3 font-medium transition-colors lg:px-4",
                      active
                        ? "bg-neutral-800 text-primary"
                        : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50",
                    )}
                  >
                    <Icon className="size-5" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Link href="/you" aria-label={`Your profile, ${currentUser.name}`} className="shrink-0 rounded-full">
          <Avatar name={currentUser.name} src={currentUser.avatar} ring decorative />
        </Link>
      </div>
    </header>
  );
}
