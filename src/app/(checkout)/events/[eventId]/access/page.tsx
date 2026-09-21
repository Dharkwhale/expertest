import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccessSelector } from "@/components/checkout/AccessSelector";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { OrderProblem } from "@/components/checkout/OrderProblem";
import { PinIcon, ShareIcon } from "@/components/icons";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { IconButton } from "@/components/ui/IconButton";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";
import { checkoutRoutes } from "@/lib/checkout-routes";
import { DEFAULT_QUANTITIES, parseOrder, passCount } from "@/lib/order";
import { readViewState } from "@/lib/view-state";
import { accessPage, getEvent, lowestTier, type ExperienceEvent } from "@/mock/data";

export const metadata: Metadata = { title: "Select access" };

// S06 Select Access (ex9). "Stage 05" label dropped (flow.md §4); default 1× General Access.
export default async function SelectAccessPage({ params, searchParams }: PageProps<"/events/[eventId]/access">) {
  const [{ eventId }, query] = await Promise.all([params, searchParams]);
  const event = getEvent(eventId);
  if (!event) notFound();

  const state = readViewState(query);
  const parsed = parseOrder(query);
  const onSale = lowestTier(event.id) !== undefined;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-60 md:px-8 lg:pb-16">
      <CheckoutHeader
        nav={{ href: checkoutRoutes.details(event.id), label: `Back to ${event.title}`, kind: "back" }}
        title={<h1 className="text-lg font-semibold">Select access</h1>}
        right={<IconButton label="Share" icon={<ShareIcon />} unavailable />}
      />

      {state === "loading" ? (
        <SkeletonGroup label="ticket options" className="grid gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Skeleton className="h-36" />
            <Skeleton className="h-52" />
            <Skeleton className="h-44" />
          </div>
          <Skeleton className="hidden h-56 lg:block" />
        </SkeletonGroup>
      ) : state === "error" ? (
        <ErrorState what="ticket options" retryHref={checkoutRoutes.access(event.id)} />
      ) : state === "empty" || !onSale ? (
        // Decision D4 / GAP-007: events without tiers in any design
        <EmptyState
          message={`Tickets for ${event.title} aren't on sale yet.`}
          action={{ label: "Explore other events", href: "/explore" }}
        />
      ) : !parsed.ok ? (
        <OrderProblem reason={parsed.reason} accessHref={checkoutRoutes.access(event.id)} />
      ) : (
        <AccessSelector
          eventId={event.id}
          initial={passCount(parsed.quantities) > 0 ? parsed.quantities : DEFAULT_QUANTITIES}
          totalAside={accessPage.totalAside}
          intro={<AccessEventCard event={event} />}
        />
      )}
    </main>
  );
}

// ex9's event strip. Venue "Main Hall & Sound Pavilions" → canonical (flow.md §5).
function AccessEventCard({ event }: { event: ExperienceEvent }) {
  return (
    <section
      aria-label="Event"
      className="relative flex flex-col gap-3 overflow-hidden rounded-card border border-neutral-800 bg-linear-to-br from-tertiary/40 via-neutral-900 to-primary/15 p-4 md:p-5"
    >
      <div className="flex flex-wrap items-center gap-3 pr-24">
        <span className="label-caps inline-flex items-center gap-1.5 rounded-full border border-secondary/50 bg-neutral-950/60 px-3 py-1 text-secondary">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-secondary" />
          Exper live
        </span>
        <span className="text-sm text-neutral-200">
          {event.isLive ? "Tonight" : event.dateLabel} · {event.timeLabel}
        </span>
      </div>
      <p aria-hidden="true" className="absolute top-4 right-4 max-w-24 text-right text-sm leading-tight text-primary italic">
        {accessPage.cardAside}
      </p>
      <h2 className="font-display text-title uppercase">{event.title}</h2>
      <p className="flex items-center gap-1.5 text-sm text-neutral-200">
        <PinIcon className="size-4 shrink-0" />
        {[event.venue, event.city].filter(Boolean).join(" · ")}
      </p>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 border-t border-neutral-50/10 pt-3">
        {accessPage.highlights.map((item) => (
          <li key={item} className="label-caps flex items-center gap-1.5 text-neutral-200">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
