import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

// Small uppercase section heading ("THE EXPERIENCE", "ESSENTIAL PROTOCOL" in ex10).
export function SectionLabel({
  children,
  as: Tag = "h2",
  className,
}: {
  children: ReactNode;
  as?: "h2" | "h3" | "p";
  className?: string;
}) {
  return <Tag className={cx("label-caps text-neutral-400", className)}>{children}</Tag>;
}
