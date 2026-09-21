"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { QtyStepper } from "@/components/checkout/QtyStepper";
import { TierCard } from "@/components/checkout/TierCard";
import { ArrowRightIcon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { checkoutRoutes } from "@/lib/checkout-routes";
import { canAdd, orderTotals, type Quantities, type TierId } from "@/lib/order";
import { MAX_PASSES_PER_PERSON, tiers } from "@/mock/data";

// S06 interactive part: tier steppers + the running total. Each change is mirrored into
// the URL (router.replace) so a refresh or Back keeps the selection (decision D2).
export function AccessSelector({
  eventId,
  initial,
  intro,
  totalAside,
}: {
  eventId: string;
  initial: Quantities;
  /** Server-rendered event card shown above the tiers */
  intro: ReactNode;
  totalAside: string;
}) {
  const router = useRouter();
  const [quantities, setQuantities] = useState(initial);
  const totals = orderTotals(quantities);

  // Functional update: rapid clicks (a double-click) each build on the latest value
  // instead of all reading the same stale one (found by the M3 click probe).
  function change(tierId: TierId, delta: 1 | -1) {
    setQuantities((prev) => {
      if (delta === 1 && !canAdd(prev, tierId)) return prev;
      return { ...prev, [tierId]: Math.max(0, prev[tierId] + delta) };
    });
  }

  // Mirror the selection into the URL, skipping the first render (it already matches)
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    router.replace(checkoutRoutes.access(eventId, quantities), { scroll: false });
  }, [quantities, eventId, router]);

  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
      <div className="flex flex-col gap-6 lg:col-span-2">
        {intro}
        <section aria-labelledby="tiers-heading" className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <SectionLabel>
              <span id="tiers-heading">Choose your experience</span>
            </SectionLabel>
            {/* ex9 "Max 4 passes / persona" typo fixed */}
            <p className="text-xs text-neutral-400">Max {MAX_PASSES_PER_PERSON} passes / person</p>
          </div>
          <ul className="flex flex-col gap-4 pt-2">
            {tiers.map((tier) => (
              <TierCard
                key={tier.id}
                tier={tier}
                selected={quantities[tier.id] > 0}
                stepper={
                  <QtyStepper
                    itemName={tier.name}
                    value={quantities[tier.id]}
                    onDecrement={() => change(tier.id, -1)}
                    onIncrement={() => change(tier.id, 1)}
                    canIncrement={canAdd(quantities, tier.id)}
                    capReason={`Maximum ${MAX_PASSES_PER_PERSON} passes per person${tier.passes > 1 ? `; this bundle counts as ${tier.passes}` : ""}.`}
                  />
                }
              />
            ))}
          </ul>
        </section>
      </div>

      <div className="lg:col-start-3 lg:row-start-1">
        <CheckoutSummary
          lines={totals.lines}
          totalNgn={totals.totalNgn}
          totalUsdc={totals.totalUsdc}
          passes={totals.passes}
          accent={totalAside}
          action={
            totals.passes > 0 ? (
              <ButtonLink href={checkoutRoutes.method(eventId, quantities, "card")} size="lg" fullWidth>
                Proceed to payment
                <ArrowRightIcon className="size-5" />
              </ButtonLink>
            ) : (
              <Button size="lg" fullWidth disabled>
                Choose a pass to continue
              </Button>
            )
          }
        />
      </div>
    </div>
  );
}
