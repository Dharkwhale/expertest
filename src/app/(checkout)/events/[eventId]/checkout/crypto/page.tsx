import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { NetworkSelect } from "@/components/checkout/NetworkSelect";
import { OrderProblem } from "@/components/checkout/OrderProblem";
import { PayButton } from "@/components/checkout/PayButton";
import { StepIndicator } from "@/components/checkout/StepIndicator";
import { LockIcon, ShieldIcon } from "@/components/icons";
import { cardSurface } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { IconButton } from "@/components/ui/IconButton";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";
import { resolveCheckout } from "@/lib/checkout";
import { checkoutRoutes } from "@/lib/checkout-routes";
import { cx } from "@/lib/cx";
import { formatNgn } from "@/lib/format";
import { orderTotals, type Quantities } from "@/lib/order";
import { readViewState } from "@/lib/view-state";
import { parseWallet } from "@/lib/wallet";
import { getEvent, mockWallet, type ExperienceEvent, type Wallet } from "@/mock/data";

export const metadata: Metadata = { title: "Confirm payment" };

// S10 Confirm Payment, USDC step 3 of 3 (ex11). Fixes: tier = the order ("1X NOMAD ACCESS"
// was wrong); subtitle = Neon Solstice's own (ex11 had Sound/Scape's); gas line and
// "+ 0.0006 ETH" removed and the network defaults to Base (Q8); "ID: #EXP-9920" dropped
// (it clashes with the pass credential minted on S11); the pill reads "Step 3 of 3" as ex17.
export default async function ConfirmUsdcPage({ params, searchParams }: PageProps<"/events/[eventId]/checkout/crypto">) {
  const [{ eventId }, query] = await Promise.all([params, searchParams]);
  const event = getEvent(eventId);
  if (!event) notFound();

  const state = readViewState(query);
  const simulateDecline = query.state === "declined"; // review switch for decision D3
  const step = resolveCheckout(event.id, query);
  const wallet = parseWallet(query);
  const cancelHref =
    step.kind === "ok" ? checkoutRoutes.method(event.id, step.quantities, "usdc") : checkoutRoutes.access(event.id);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-8">
      <CheckoutHeader
        nav={{ href: cancelHref, label: "Cancel and go back to payment method", kind: "close" }}
        title={<StepIndicator step={3} of={3} />}
        right={<IconButton label="Security details" icon={<LockIcon />} unavailable />}
      />

      {state === "loading" ? (
        <SkeletonGroup label="your payment" className="grid gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Skeleton className="h-24 w-2/3" />
            <Skeleton className="h-40" />
            <Skeleton className="h-44" />
          </div>
          <Skeleton className="h-56" />
        </SkeletonGroup>
      ) : state === "error" ? (
        <ErrorState what="your payment" retryHref={checkoutRoutes.access(event.id)} />
      ) : step.kind === "not-on-sale" ? (
        <EmptyState
          message={`Tickets for ${event.title} aren't on sale yet.`}
          action={{ label: "Explore other events", href: "/explore" }}
        />
      ) : step.kind === "problem" || !wallet.ok ? (
        <OrderProblem reason={step.kind === "problem" ? step.reason : "invalid"} accessHref={checkoutRoutes.access(event.id)} />
      ) : (
        <ConfirmUsdcContent
          event={event}
          quantities={step.quantities}
          wallet={wallet.wallet}
          cancelHref={cancelHref}
          simulateDecline={simulateDecline}
        />
      )}
    </main>
  );
}

function ConfirmUsdcContent({
  event,
  quantities,
  wallet,
  cancelHref,
  simulateDecline,
}: {
  event: ExperienceEvent;
  quantities: Quantities;
  wallet: Wallet | undefined;
  cancelHref: string;
  simulateDecline: boolean;
}) {
  const totals = orderTotals(quantities);
  const usdc = `${totals.totalUsdc.toFixed(2)} USDC`;
  // Each part stays whole, so "8:00 PM" never splits at 375px
  const when = [event.city, `Tonight, ${event.dateLabel.replace(/^\w+ /, "")}`, event.timeLabel].filter(Boolean);

  // Mobile reads top to bottom as ex11. lg: order + payment channel on the left (2/3); the
  // ledger, Confirm and Cancel in a sticky card on the right (1/3), as M3's D1.
  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:gap-x-8">
      <div className="flex flex-col gap-4 lg:col-span-2">
        <div>
          <p className="label-caps flex flex-wrap justify-between gap-2 text-neutral-400">
            Exper // Pass authorization
            <span className="text-primary">01/01 Verified</span>
          </p>
          <h1 className="mt-2 font-display text-display uppercase">Confirm payment</h1>
        </div>

        <section aria-label="Your order" className={cx(cardSurface, "flex flex-col gap-4 p-4 md:p-5")}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <ul className="flex flex-wrap gap-2">
                {totals.lines.map((line) => (
                  <li key={line.tier.id} className="label-caps rounded-thumb border border-primary/60 bg-primary/10 px-2 py-1 text-primary">
                    {line.qty}× {line.tier.name}
                  </li>
                ))}
              </ul>
              <h2 className="mt-3 font-display text-xl uppercase md:text-2xl">{event.title}</h2>
              <p className="text-sm text-neutral-400">
                {when.map((part, i) => (
                  <span key={part} className="whitespace-nowrap">
                    {i > 0 && " · "}
                    {part}
                  </span>
                ))}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xl font-semibold tabular-nums md:text-2xl">{formatNgn(totals.totalNgn)}</p>
              <p className="text-sm text-primary tabular-nums">≈ {usdc}</p>
            </div>
          </div>
          <p className="flex items-start gap-2 border-t border-neutral-800 pt-3 text-sm text-neutral-400">
            <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
            {event.subtitle}
          </p>
        </section>

        <section aria-labelledby="channel-heading" className={cx(cardSurface, "flex flex-col gap-3 p-4 md:p-5")}>
          <SectionLabel>
            <span id="channel-heading">Payment channel</span>
          </SectionLabel>
          {/* Fixed mock address: nothing here is read from or sent to a real wallet */}
          <div className="flex items-center gap-3 rounded-thumb border border-neutral-800 bg-neutral-950 p-3">
            <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-tertiary text-xs font-semibold text-neutral-50">
              0x
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 font-semibold text-neutral-50">
                {mockWallet.address}
                <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
              </p>
              <p className="text-sm text-neutral-400">{wallet?.name ?? mockWallet.defaultLabel} · Connected</p>
            </div>
            <span className="rounded-thumb border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-sm text-neutral-200">Web3</span>
          </div>
          <NetworkSelect />
        </section>
      </div>

      <aside aria-label="Total due" className="flex flex-col gap-4 lg:sticky lg:top-6 lg:col-start-3 lg:row-start-1 lg:self-start">
        <section className={cx(cardSurface, "flex flex-col gap-3 p-4 md:p-5")}>
          <ul className="flex flex-col gap-2 text-sm">
            {totals.lines.map((line) => (
              <li key={line.tier.id} className="flex justify-between gap-3 text-neutral-400">
                <span>
                  {line.tier.name} pass{line.qty > 1 && <span className="tabular-nums"> ×{line.qty}</span>}
                </span>
                <span className="tabular-nums text-neutral-200">{formatNgn(line.subtotalNgn)}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-end justify-between gap-3 border-t border-neutral-800 pt-3">
            <div>
              <p className="font-semibold text-neutral-50 uppercase">Total due</p>
              <p className="text-xs text-neutral-400">Includes all protocol fees</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold tabular-nums">{formatNgn(totals.totalNgn)}</p>
              <p className="text-sm text-primary tabular-nums">{usdc}</p>
            </div>
          </div>
        </section>

        <p className="flex items-center justify-center gap-1.5 text-xs text-neutral-400">
          <ShieldIcon className="size-4 text-primary" />
          Encrypted via EXPER protocol &amp; ERC-721 smart contract
        </p>
        <PayButton
          method="usdc"
          amountLabel={usdc}
          successHref={checkoutRoutes.pass(event.id, quantities, "usdc")}
          altHref={checkoutRoutes.method(event.id, quantities, "card")}
          simulateDecline={simulateDecline}
        />
        <Link href={cancelHref} className="inline-flex min-h-11 items-center justify-center text-sm text-neutral-400 hover:text-neutral-50">
          Cancel transaction
        </Link>
      </aside>
    </div>
  );
}
