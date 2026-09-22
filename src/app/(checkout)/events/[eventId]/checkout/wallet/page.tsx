import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { OrderProblem } from "@/components/checkout/OrderProblem";
import { StepIndicator } from "@/components/checkout/StepIndicator";
import { WalletOption } from "@/components/checkout/WalletOption";
import { MoreIcon, ShieldIcon, WalletIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import { cardSurface } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";
import { UnavailableButton } from "@/components/ui/UnavailableButton";
import { resolveCheckout } from "@/lib/checkout";
import { checkoutRoutes } from "@/lib/checkout-routes";
import { cx } from "@/lib/cx";
import { formatNgn } from "@/lib/format";
import { orderTotals, type Quantities } from "@/lib/order";
import { readViewState } from "@/lib/view-state";
import { getEvent, wallets, type ExperienceEvent } from "@/mock/data";

export const metadata: Metadata = { title: "Connect wallet" };

// S09 Connect Wallet, USDC step 2 of 3 (ex17). Fixes: "General Access • Lagos Hall" → the
// ordered tier(s) + canonical venue; the total and the "single 16.50 USDC transfer" note are
// computed from the order. Choosing a wallet is navigation only (M4 plan §2).
export default async function ConnectWalletPage({ params, searchParams }: PageProps<"/events/[eventId]/checkout/wallet">) {
  const [{ eventId }, query] = await Promise.all([params, searchParams]);
  const event = getEvent(eventId);
  if (!event) notFound();

  const state = readViewState(query);
  const step = resolveCheckout(event.id, query);
  const back =
    step.kind === "ok" ? checkoutRoutes.method(event.id, step.quantities, "usdc") : checkoutRoutes.access(event.id);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-8">
      <CheckoutHeader
        nav={{ href: back, label: "Back to payment method", kind: "back" }}
        title={<StepIndicator step={2} of={3} />}
        close={{ href: checkoutRoutes.details(event.id), label: `Close checkout, back to ${event.title}` }}
      />

      {state === "loading" ? (
        <SkeletonGroup label="wallet options" className="grid gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Skeleton className="h-16 w-2/3" />
            {wallets.map((w) => (
              <Skeleton key={w.id} className="h-20" />
            ))}
          </div>
          <Skeleton className="h-56" />
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
        <ConnectWalletContent event={event} quantities={step.quantities} />
      )}
    </main>
  );
}

function ConnectWalletContent({ event, quantities }: { event: ExperienceEvent; quantities: Quantities }) {
  const totals = orderTotals(quantities);
  const usdc = totals.totalUsdc.toFixed(2);
  const tiersLabel = totals.lines.map((l) => `${l.tier.name}${l.qty > 1 ? ` ×${l.qty}` : ""}`).join(", ");

  // Mobile reads top to bottom as ex17. lg: intro, wallet list and note on the left (2/3);
  // the ticket and Connect button in a sticky card on the right (1/3), as M3's D1.
  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:gap-x-8">
      <div className="lg:col-span-2 lg:row-start-1">
        <h1 className="flex items-center gap-3 font-display text-display uppercase">
          Pay with USDC
          <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-secondary font-sans text-base font-semibold text-ink">
            $
          </span>
        </h1>
        <p className="mt-2 text-neutral-400">Connect your Web3 wallet to authorize payment.</p>
      </div>

      <aside
        aria-label="Your ticket"
        className="flex flex-col gap-4 lg:sticky lg:top-6 lg:col-start-3 lg:row-span-3 lg:row-start-1 lg:self-start"
      >
        <section aria-label="Experience ticket" className={cx(cardSurface, "flex items-start justify-between gap-4 p-4 md:p-5")}>
          <div className="min-w-0">
            <p className="label-caps flex items-center gap-1.5 text-neutral-400">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
              Experience ticket
            </p>
            <h2 className="mt-2 font-display text-xl uppercase">{event.title}</h2>
            <p className="text-sm text-neutral-400">
              {tiersLabel}
              {event.venue && ` · ${event.venue}`}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="label-caps text-neutral-400">Total due</p>
            <p className="mt-2 text-xl font-semibold text-primary tabular-nums">
              {usdc} <span className="text-sm text-neutral-50">USDC</span>
            </p>
            <p className="text-xs text-neutral-400 tabular-nums">≈ {formatNgn(totals.totalNgn)} NGN</p>
          </div>
        </section>

        {/* No wallet named: S10 shows ex11's generic "Personal Vault" */}
        <ButtonLink href={checkoutRoutes.crypto(event.id, quantities)} size="lg" fullWidth>
          <WalletIcon className="size-5" />
          Connect wallet
        </ButtonLink>
      </aside>

      <section aria-labelledby="wallets-heading" className="flex flex-col gap-3 lg:col-span-2 lg:row-start-2">
        <h2 id="wallets-heading" className="label-caps flex items-center gap-3 text-neutral-400">
          <span aria-hidden="true" className="h-px flex-1 bg-neutral-800" />
          Or select directly
          <span aria-hidden="true" className="h-px flex-1 bg-neutral-800" />
        </h2>
        <ul className="flex flex-col gap-3">
          {wallets.map((wallet) => (
            <li key={wallet.id}>
              <WalletOption wallet={wallet} href={checkoutRoutes.crypto(event.id, quantities, wallet.id)} />
            </li>
          ))}
        </ul>
        <UnavailableButton
          label="All other wallets"
          className="label-caps w-full justify-center rounded-card border border-dashed border-neutral-700 py-3 text-neutral-400"
        >
          <MoreIcon className="size-4" />
          All other wallets
        </UnavailableButton>
      </section>

      <p className={cx(cardSurface, "flex gap-3 p-4 text-sm text-neutral-400 lg:col-span-2 lg:row-start-3")}>
        <ShieldIcon className="mt-0.5 size-5 shrink-0 text-primary" />
        <span>
          <strong className="font-semibold text-neutral-50">Non-custodial &amp; Zero-permission.</strong> Your wallet is
          only invoked to sign and authorize this single {usdc} USDC transfer. EXPER never gains control over your
          assets.
        </span>
      </p>
    </div>
  );
}
