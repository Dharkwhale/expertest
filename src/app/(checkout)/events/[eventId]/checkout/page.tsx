import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { OrderEventCard } from "@/components/checkout/OrderEventCard";
import { OrderProblem } from "@/components/checkout/OrderProblem";
import { PaymentMethodStep } from "@/components/checkout/PaymentMethodStep";
import { LockIcon } from "@/components/icons";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";
import { resolveCheckout } from "@/lib/checkout";
import { checkoutRoutes } from "@/lib/checkout-routes";
import { orderTotals } from "@/lib/order";
import { readViewState } from "@/lib/view-state";
import { getEvent } from "@/mock/data";

export const metadata: Metadata = { title: "Checkout" };

// S07 Payment Method (ex13).
export default async function PaymentMethodPage({ params, searchParams }: PageProps<"/events/[eventId]/checkout">) {
  const [{ eventId }, query] = await Promise.all([params, searchParams]);
  const event = getEvent(eventId);
  if (!event) notFound();

  const state = readViewState(query);
  const step = resolveCheckout(event.id, query);
  const back =
    step.kind === "ok" ? checkoutRoutes.access(event.id, step.quantities) : checkoutRoutes.access(event.id);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-60 md:px-8 lg:pb-16">
      <CheckoutHeader
        nav={{ href: back, label: "Back to select access", kind: "back" }}
        title={<h1 className="label-caps text-sm text-neutral-200">Checkout</h1>}
        // ex13's lock: a reassurance mark, not a control
        right={
          <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-neutral-800/80 text-neutral-200 [&_svg]:size-5">
            <LockIcon />
          </span>
        }
      />

      {state === "loading" ? (
        <SkeletonGroup label="your order" className="grid gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Skeleton className="h-28" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
          <Skeleton className="hidden h-56 lg:block" />
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
        <PaymentMethodStep
          eventId={event.id}
          quantities={step.quantities}
          initialMethod={step.method ?? "card"}
          intro={
            <OrderEventCard
              event={event}
              lines={orderTotals(step.quantities).lines}
              totalNgn={orderTotals(step.quantities).totalNgn}
            />
          }
        />
      )}
    </main>
  );
}
