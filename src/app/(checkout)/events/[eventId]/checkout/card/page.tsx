import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { OrderEventCard } from "@/components/checkout/OrderEventCard";
import { OrderProblem } from "@/components/checkout/OrderProblem";
import { PayButton } from "@/components/checkout/PayButton";
import { LockIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/Avatar";
import { cardSurface } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";
import { UnavailableButton } from "@/components/ui/UnavailableButton";
import { resolveCheckout } from "@/lib/checkout";
import { checkoutRoutes } from "@/lib/checkout-routes";
import { cx } from "@/lib/cx";
import { formatNgn } from "@/lib/format";
import { orderTotals, type Quantities } from "@/lib/order";
import { readViewState } from "@/lib/view-state";
import { currentUser, getEvent, savedCard, type ExperienceEvent } from "@/mock/data";

export const metadata: Metadata = { title: "Review & pay" };

// S08 Review & Pay, card path (ex14; ex15 is its dropped duplicate, flow.md §2).
// Fixes: add-on stepper removed (Q9), fee line removed (fees included), attendee is the
// canonical Tope Banjo, venue canonical, tier = the order from S06.
export default async function ReviewPayPage({ params, searchParams }: PageProps<"/events/[eventId]/checkout/card">) {
  const [{ eventId }, query] = await Promise.all([params, searchParams]);
  const event = getEvent(eventId);
  if (!event) notFound();

  const state = readViewState(query);
  const simulateDecline = query.state === "declined"; // review switch for decision D3
  const step = resolveCheckout(event.id, query);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-48 md:px-8 lg:pb-16">
      <CheckoutHeader
        nav={{
          href: step.kind === "ok" ? checkoutRoutes.method(event.id, step.quantities, "card") : checkoutRoutes.access(event.id),
          label: "Back to payment method",
          kind: "back",
        }}
        title={<h1 className="text-lg font-semibold">Review &amp; pay</h1>}
        right={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-800/80 px-3 py-2 text-xs text-neutral-200">
            <LockIcon className="size-4 text-primary" />
            256-bit
          </span>
        }
      />

      {state === "loading" ? (
        <SkeletonGroup label="your order" className="grid gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Skeleton className="h-28" />
            <Skeleton className="h-24" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="hidden h-64 lg:block" />
        </SkeletonGroup>
      ) : state === "error" ? (
        <ErrorState what="your order" retryHref={checkoutRoutes.access(event.id)} />
      ) : step.kind === "not-on-sale" ? (
        <EmptyState
          message={`Tickets for ${event.title} aren't on sale yet.`}
          action={{ label: "Explore other events", href: "/explore" }}
        />
      ) : step.kind === "problem" ? (
        <OrderProblem reason={step.reason} accessHref={checkoutRoutes.access(event.id)} />
      ) : (
        <ReviewPayContent event={event} quantities={step.quantities} simulateDecline={simulateDecline} />
      )}
    </main>
  );
}

function ReviewPayContent({
  event,
  quantities,
  simulateDecline,
}: {
  event: ExperienceEvent;
  quantities: Quantities;
  simulateDecline: boolean;
}) {
  const totals = orderTotals(quantities);
  const methodHref = checkoutRoutes.method(event.id, quantities, "card");
  const usdcHref = checkoutRoutes.method(event.id, quantities, "usdc");

  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
      <div className="flex flex-col gap-4 lg:col-span-2">
        <OrderEventCard event={event} lines={totals.lines} withThumb />

        <section aria-labelledby="tier-heading" className={cx(cardSurface, "flex flex-col gap-4 p-4 md:p-5")}>
          <h2 id="tier-heading" className="label-caps text-primary">
            Access tier
          </h2>
          <ul className="flex flex-col gap-3">
            {totals.lines.map((line) => (
              <li key={line.tier.id} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-neutral-50">
                    {line.tier.name}
                    {line.qty > 1 && <span className="text-neutral-400 tabular-nums"> ×{line.qty}</span>}
                  </p>
                  <p className="text-sm text-neutral-400">{line.tier.tagline}</p>
                </div>
                <p className="shrink-0 font-semibold tabular-nums">{formatNgn(line.subtotalNgn)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="attendee-heading" className={cx(cardSurface, "flex flex-col gap-3 p-4 md:p-5")}>
          <div className="flex items-center justify-between gap-4">
            <SectionLabel>
              <span id="attendee-heading">Attendee details</span>
            </SectionLabel>
            <UnavailableButton label="Edit attendee details" className="text-sm font-medium text-primary">
              Edit
            </UnavailableButton>
          </div>
          <div className="flex items-center gap-3">
            <Avatar name={currentUser.name} tone="primary" decorative />
            <div>
              <p className="font-semibold text-neutral-50">{currentUser.name}</p>
              <p className="text-sm text-neutral-400">{currentUser.email}</p>
            </div>
          </div>
          <p className="border-t border-neutral-800 pt-3 text-sm text-neutral-400">
            Pass and personal digital memories will be tied to this Exper account.
          </p>
        </section>

        <section aria-labelledby="payment-heading" className={cx(cardSurface, "flex flex-col gap-3 p-4 md:p-5")}>
          <div className="flex items-center justify-between gap-4">
            <SectionLabel>
              <span id="payment-heading">Payment method</span>
            </SectionLabel>
            <Link href={methodHref} className="inline-flex min-h-11 items-center text-sm font-medium text-primary hover:text-neutral-50">
              Change
            </Link>
          </div>
          {/* Display text only: no card number, fields or payment SDK exist in V1 */}
          <div className="flex items-center gap-3 rounded-thumb border border-primary/60 bg-neutral-950 p-3">
            <span aria-hidden="true" className="label-caps grid h-9 w-12 place-items-center rounded-thumb bg-neutral-800 text-neutral-200">
              MC
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 font-semibold text-neutral-50">
                {savedCard.brand} •••• {savedCard.last4}
                <span className="label-caps rounded-full bg-neutral-800 px-2 py-0.5 text-neutral-400">Primary</span>
              </p>
              <p className="text-sm text-neutral-400">Secured via {savedCard.processor}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-800 pt-3 text-sm">
            <p className="flex items-center gap-2 text-neutral-400">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
              Also available:
              <span className="label-caps rounded-full bg-neutral-800 px-2 py-0.5 text-neutral-200">Web3 / USDC</span>
            </p>
            <Link href={usdcHref} className="inline-flex min-h-11 items-center font-medium text-primary hover:text-neutral-50">
              Switch to crypto
            </Link>
          </div>
        </section>

        {/* ex14 ledger. lg shows the same lines in the sticky summary, so hide it there */}
        <section aria-label="Price breakdown" className={cx(cardSurface, "flex flex-col gap-2 p-4 md:p-5 lg:hidden")}>
          {totals.lines.map((line) => (
            <p key={line.tier.id} className="flex justify-between gap-4 text-sm text-neutral-400">
              <span>
                {line.tier.name} ({line.qty}x)
              </span>
              <span className="tabular-nums text-neutral-200">{formatNgn(line.subtotalNgn)}</span>
            </p>
          ))}
        </section>

        <p className="flex items-start gap-2 text-sm text-neutral-400">
          <LockIcon className="mt-0.5 size-4 shrink-0 text-primary" />
          By confirming, your access pass will be immediately minted to your Exper ID.
        </p>
        <p className="text-xs text-neutral-400 lg:hidden">
          <PayTerms />
        </p>
      </div>

      <div className="lg:col-start-3 lg:row-start-1">
        <CheckoutSummary
          lines={totals.lines}
          totalNgn={totals.totalNgn}
          totalUsdc={totals.totalUsdc}
          passes={totals.passes}
          action={
            <PayButton
              method="card"
              amountLabel={formatNgn(totals.totalNgn)}
              successHref={checkoutRoutes.pass(event.id, quantities, "card")}
              altHref={usdcHref}
              simulateDecline={simulateDecline}
            />
          }
          note={<PayTerms />}
          noteDesktopOnly
        />
      </div>
    </div>
  );
}

// ex14's terms line: under the Pay button on lg; in the page flow on mobile, where the fixed
// bar must stay short. Terms and Refund Policy have no screens yet (flow.md §3).
function PayTerms() {
  return (
    <span className="text-center">
      By tapping Pay, you agree to EXPER&apos;s{" "}
      <UnavailableButton label="Experience Terms" className="min-h-0 underline underline-offset-2">
        Experience Terms
      </UnavailableButton>{" "}
      &amp;{" "}
      <UnavailableButton label="Refund Policy" className="min-h-0 underline underline-offset-2">
        Refund Policy
      </UnavailableButton>
      .
    </span>
  );
}
