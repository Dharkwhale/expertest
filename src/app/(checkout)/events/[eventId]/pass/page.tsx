import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { OrderProblem } from "@/components/checkout/OrderProblem";
import { PassCard, type PassIds } from "@/components/checkout/PassCard";
import { ArrowRightIcon, InfoIcon, MoreIcon, ShareIcon, WalletIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { IconButton } from "@/components/ui/IconButton";
import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";
import { UnavailableButton } from "@/components/ui/UnavailableButton";
import { resolveCheckout } from "@/lib/checkout";
import { checkoutRoutes } from "@/lib/checkout-routes";
import { orderTotals, type Quantities } from "@/lib/order";
import { readViewState } from "@/lib/view-state";
import { currentUser, getEvent, passTemplate, type ExperienceEvent } from "@/mock/data";

export const metadata: Metadata = { title: "You're in" };

// Deterministic mock ids: pass #42 → EXP-9042-SOL, the next tier line #43 → EXP-9043-SOL
function passIds(index: number): PassIds {
  const number = passTemplate.number + index;
  return {
    number,
    credential: `EXP-${9000 + number}-SOL`,
    serial: passTemplate.serial,
    earlySync: passTemplate.earlySync,
  };
}

// S11 Purchase Confirmation / Pass (ex20). Mock limit (GAP-009): any valid order URL renders
// a pass, because there is no payment record in V1.
export default async function PassPage({ params, searchParams }: PageProps<"/events/[eventId]/pass">) {
  const [{ eventId }, query] = await Promise.all([params, searchParams]);
  const event = getEvent(eventId);
  if (!event) notFound();

  const state = readViewState(query);
  const step = resolveCheckout(event.id, query);
  // A pass only exists after paying: the method must be present, not just the tiers
  const paid = step.kind === "ok" && step.method !== undefined;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-8">
      <CheckoutHeader
        nav={{ href: "/home", label: "Close and go home", kind: "close" }}
        title={
          // Only claim "minted" when there is a pass to show
          paid && state === "ready" ? (
            <p className="label-caps inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-neutral-200">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
              Pass minted · Immutable
            </p>
          ) : (
            <p className="text-lg font-semibold">Your pass</p>
          )
        }
        right={<IconButton label="More options" icon={<MoreIcon />} unavailable />}
      />

      {state === "loading" ? (
        <SkeletonGroup label="your pass" className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Skeleton className="h-16 w-2/3" />
            <Skeleton className="h-96" />
          </div>
          <Skeleton className="h-64" />
        </SkeletonGroup>
      ) : state === "error" ? (
        <ErrorState what="your pass" retryHref={checkoutRoutes.details(event.id)} />
      ) : step.kind === "not-on-sale" ? (
        <EmptyState
          message={`Tickets for ${event.title} aren't on sale yet.`}
          action={{ label: "Explore other events", href: "/explore" }}
        />
      ) : !paid ? (
        <OrderProblem reason={step.kind === "problem" ? step.reason : "invalid"} accessHref={checkoutRoutes.access(event.id)} />
      ) : (
        <PassContent event={event} quantities={step.quantities} />
      )}
    </main>
  );
}

function PassContent({ event, quantities }: { event: ExperienceEvent; quantities: Quantities }) {
  const { lines } = orderTotals(quantities);
  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
      <div className="flex flex-col gap-5 lg:col-span-2">
        <div>
          <h1 className="font-display text-display uppercase italic">You&apos;re in.</h1>
          <p className="mt-2 max-w-xl text-neutral-200">
            Your access token for <strong className="font-semibold text-neutral-50">{event.title}</strong> is
            verified and linked to <span className="text-primary">{currentUser.handle}</span>. Cross the
            boundary tonight.
          </p>
        </div>
        <ul className="flex flex-col gap-5">
          {lines.map((line, index) => (
            <li key={line.tier.id}>
              <PassCard event={event} line={line} holder={currentUser} ids={passIds(index)} />
            </li>
          ))}
        </ul>
      </div>

      <aside aria-label="What's next" className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
        <div className="grid grid-cols-2 gap-3">
          <UnavailableButton
            label="Add to wallet"
            className="justify-center gap-2 rounded-card border border-neutral-800 bg-neutral-900 px-3 py-3 text-sm font-medium text-neutral-50"
          >
            <WalletIcon className="size-5" />
            Add to Wallet
          </UnavailableButton>
          <UnavailableButton
            label="Squad invite"
            className="justify-center gap-2 rounded-card border border-neutral-800 bg-neutral-900 px-3 py-3 text-sm font-medium text-neutral-50"
          >
            <ShareIcon className="size-5" />
            Squad Invite
          </UnavailableButton>
        </div>

        <div className="flex gap-3 rounded-card border border-neutral-800 bg-neutral-900 p-4">
          <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-thumb border border-primary/40 text-primary">
            <InfoIcon className="size-5" />
          </span>
          <p className="text-sm text-neutral-400">
            <strong className="font-semibold text-neutral-50">Entry protocol:</strong> {passTemplate.entryProtocol}
          </p>
        </div>

        {/* flow.md S11: "Enter Hub" → S13 Live (M4 builds it; the tab placeholder exists) */}
        <ButtonLink href="/live" size="lg" fullWidth>
          Enter {event.title} Hub
          <ArrowRightIcon className="size-5" />
        </ButtonLink>
        <Link
          href="/moments"
          className="inline-flex min-h-11 items-center justify-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-50"
        >
          View in Moments &amp; Tickets
          <ArrowRightIcon className="size-4" />
        </Link>
      </aside>
    </div>
  );
}
