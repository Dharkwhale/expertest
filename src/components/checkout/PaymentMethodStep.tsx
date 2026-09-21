"use client";

import { useState, type ReactNode } from "react";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { RadioCard } from "@/components/checkout/RadioCard";
import { ArrowRightIcon, ShieldIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { checkoutRoutes } from "@/lib/checkout-routes";
import { orderTotals, type PaymentMethod, type Quantities } from "@/lib/order";

// S07 interactive part (ex13): choose Card / Bank or USDC, then Continue down that path.
// Card is the default (M3 is the card path); ex13 pre-selects USDC.
export function PaymentMethodStep({
  eventId,
  quantities,
  initialMethod,
  intro,
}: {
  eventId: string;
  quantities: Quantities;
  initialMethod: PaymentMethod;
  intro: ReactNode;
}) {
  const [method, setMethod] = useState<PaymentMethod>(initialMethod);
  const totals = orderTotals(quantities);
  const next = method === "card" ? checkoutRoutes.card(eventId, quantities) : checkoutRoutes.wallet(eventId, quantities);

  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
      <div className="flex flex-col gap-6 lg:col-span-2">
        {intro}
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3">
            <SectionLabel as="p">Payment method</SectionLabel>
          </legend>
          <RadioCard
            name="method"
            value="card"
            checked={method === "card"}
            onChange={() => setMethod("card")}
            title="Card / Bank"
            description="Pay in local currency"
            aside={
              <span aria-hidden="true" className="flex gap-1.5">
                {["Visa", "MC"].map((brand) => (
                  <span key={brand} className="label-caps rounded-full bg-neutral-800 px-2 py-1 text-neutral-400">
                    {brand}
                  </span>
                ))}
              </span>
            }
          />
          <RadioCard
            name="method"
            value="usdc"
            checked={method === "usdc"}
            onChange={() => setMethod("usdc")}
            title="USDC"
            description="Pay with crypto wallet"
            badge={<span className="label-caps rounded-full bg-primary/15 px-2 py-0.5 text-primary">Zero gas</span>}
            aside={
              <span
                aria-hidden="true"
                className="grid size-10 place-items-center rounded-full border border-secondary/40 bg-secondary/15 font-semibold text-secondary"
              >
                $
              </span>
            }
          />
        </fieldset>
      </div>

      <div className="lg:col-start-3 lg:row-start-1">
        <CheckoutSummary
          lines={totals.lines}
          totalNgn={totals.totalNgn}
          totalUsdc={totals.totalUsdc}
          passes={totals.passes}
          action={
            <ButtonLink href={next} size="lg" fullWidth>
              Continue
              <ArrowRightIcon className="size-5" />
            </ButtonLink>
          }
          note={
            <>
              <ShieldIcon className="size-4" />
              Encrypted and secured by EXPER protocol
            </>
          }
        />
      </div>
    </div>
  );
}
