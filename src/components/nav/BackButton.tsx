"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@/components/icons";
import { IconButton } from "@/components/ui/IconButton";
import { canGoBackInApp } from "./NavigationTracker";

// "back → previous" (flow.md S05). A deep link has no in-app history to return to,
// so it falls back to a sensible parent instead of leaving the site.
export function BackButton({ fallbackHref, className }: { fallbackHref: string; className?: string }) {
  const router = useRouter();

  return (
    <IconButton
      label="Back"
      icon={<ChevronLeftIcon />}
      className={className}
      onClick={() => {
        if (canGoBackInApp()) router.back();
        else router.push(fallbackHref);
      }}
    />
  );
}
