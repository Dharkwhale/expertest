"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { cx } from "@/lib/cx";
import { buttonClasses } from "@/components/ui/Button";

// The pay step of both paths (decision D3). Mock only: no payment SDK, no card data, no wallet.
// idle → processing (~1.2s, disabled, announced) → the pass, or → declined when the review
// switch ?state=declined is on. Double-submits are impossible while processing.
//  - card (ex14): "Confirm pass · Pay ₦X"; declined offers USDC
//  - usdc (ex11): "Confirm payment"; waiting on the wallet; rejected offers card
const PROCESSING_MS = 1200;

const copy = {
  card: {
    processing: "Processing…",
    busyLabel: "Processing payment",
    declinedTitle: "Card declined.",
    declinedBody: "Your bank didn't approve this payment. Try again, or",
    altLabel: "pay with USDC",
    declinedAnnounce: "Payment declined",
  },
  usdc: {
    processing: "Confirm in your wallet…",
    busyLabel: "Waiting for your wallet to confirm",
    declinedTitle: "Transaction rejected.",
    declinedBody: "Your wallet didn't approve this transfer. Try again, or",
    altLabel: "pay by card",
    declinedAnnounce: "Transaction rejected",
  },
} as const;

export function PayButton({
  method,
  amountLabel,
  successHref,
  altHref,
  simulateDecline,
}: {
  method: "card" | "usdc";
  amountLabel: string;
  successHref: string;
  /** The other payment method, offered when this one is declined */
  altHref: string;
  simulateDecline: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "processing" | "declined">("idle");
  const timer = useRef<number | undefined>(undefined);
  const text = copy[method];

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function pay() {
    if (status === "processing") return;
    setStatus("processing");
    router.prefetch(successHref);
    timer.current = window.setTimeout(() => {
      if (simulateDecline) setStatus("declined");
      else router.push(successHref);
    }, PROCESSING_MS);
  }

  const processing = status === "processing";
  const idleLabel = method === "card" ? `Confirm pass, pay ${amountLabel}` : `Confirm payment of ${amountLabel}`;

  return (
    <div className="flex flex-col gap-3">
      {status === "declined" && (
        <div role="alert" className="rounded-thumb border border-primary/40 bg-neutral-950 p-3 text-sm">
          <p className="font-semibold text-neutral-50">{text.declinedTitle}</p>
          <p className="text-neutral-400">
            {text.declinedBody}{" "}
            <Link href={altHref} className="font-medium text-primary underline underline-offset-2 hover:text-neutral-50">
              {text.altLabel}
            </Link>
            .
          </p>
        </div>
      )}
      <button
        type="button"
        onClick={pay}
        disabled={processing}
        aria-busy={processing || undefined}
        aria-label={processing ? text.busyLabel : idleLabel}
        className={cx(buttonClasses({ size: "lg", fullWidth: true }), method === "card" && "justify-between")}
      >
        {processing ? (
          <span className="w-full text-center">{text.processing}</span>
        ) : method === "card" ? (
          <>
            <span>Confirm pass</span>
            <span className="inline-flex items-center gap-2 tabular-nums">
              Pay {amountLabel}
              <ArrowRightIcon className="size-5" />
            </span>
          </>
        ) : (
          <>
            Confirm payment
            <ArrowRightIcon className="size-5" />
          </>
        )}
      </button>
      {/* Announce progress without moving focus */}
      <p aria-live="polite" className="sr-only">
        {processing ? text.busyLabel : status === "declined" ? text.declinedAnnounce : ""}
      </p>
    </div>
  );
}
