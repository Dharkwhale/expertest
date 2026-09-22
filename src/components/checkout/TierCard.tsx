import type { ReactNode } from "react";
import { cardSurface } from "@/components/ui/card";
import { cx } from "@/lib/cx";
import { formatNgn } from "@/lib/format";
import type { Tier } from "@/mock/data";

// ex9 tier card. The chosen card (qty > 0) gets the lime border. Off-palette colours in ex9
// map to tokens: green "Available now" → primary, amber "16 left" → primary outline,
// "Save 15%" → secondary (flow.md colours can't change, only map to the nearest token).
const badgeStyles: Record<Tier["id"], string> = {
  general: "bg-primary text-ink",
  "vip-soundscape": "border border-primary/60 text-primary",
  "squad-bundle": "border border-secondary/60 text-secondary",
};

export function TierCard({
  tier,
  selected,
  stepper,
}: {
  tier: Tier;
  selected: boolean;
  stepper: ReactNode;
}) {
  const floatingBadge = tier.id === "general";

  return (
    <li
      className={cx(
        cardSurface,
        "relative flex flex-col gap-3 p-4 transition-colors md:p-5",
        selected ? "border-primary" : "hover:border-neutral-500",
      )}
    >
      {tier.badge && floatingBadge && (
        <span className={cx("label-caps absolute -top-3 right-4 rounded-full px-3 py-1", badgeStyles[tier.id])}>
          {tier.badge}
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="flex flex-wrap items-center gap-2 text-lg font-semibold text-neutral-50">
            {tier.name}
            {tier.badge && !floatingBadge && (
              <span className={cx("label-caps rounded-full px-2 py-0.5", badgeStyles[tier.id])}>{tier.badge}</span>
            )}
          </h3>
          <p className="text-sm text-neutral-400">{tier.tagline}</p>
        </div>
        <p className="shrink-0 text-right">
          <span className={cx("block text-xl font-semibold tabular-nums", selected ? "text-primary" : "text-neutral-50")}>
            {formatNgn(tier.priceNgn)}
          </span>
          <span className="text-xs text-neutral-400">/ {tier.per}</span>
        </p>
      </div>

      <p className={cx("text-sm text-neutral-400", selected && "rounded-thumb bg-neutral-950 p-3 text-neutral-200")}>
        {tier.description}
      </p>

      <div className="flex items-center justify-between gap-3 border-t border-neutral-800 pt-3">
        <p className={cx("text-sm", selected ? "text-primary" : "text-neutral-400")}>
          {selected && <span aria-hidden="true">✓ </span>}
          {tier.perk}
        </p>
        {stepper}
      </div>
    </li>
  );
}
