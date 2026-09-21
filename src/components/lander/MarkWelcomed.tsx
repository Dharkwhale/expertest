"use client";

import { useEffect } from "react";
import { WELCOMED_KEY } from "@/lib/first-visit";

// Once the Lander has been seen, the Splash goes straight to /home (Q3, 2026-09-21).
export function MarkWelcomed() {
  useEffect(() => {
    try {
      window.localStorage.setItem(WELCOMED_KEY, "1");
    } catch {
      // Storage blocked (private mode, disabled site data): the Lander just shows again.
    }
  }, []);
  return null;
}
