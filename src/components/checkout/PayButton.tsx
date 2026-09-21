"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { cx } from "@/lib/cx";
import { buttonClasses } from "@/components/ui/Button";

// ex14 "Confirm pass · Pay ₦X" (decision D3). Mock only: no payment SDK, no card data.
// idle → processing (~1.2s, disabled, announced) → the pass, or → declined when the
// review switch ?state=declined is on. Double-submits are impossible while processing.
const PROCESSING_MS = 1200;

export function PayButton({
  amountLabel,
  successHref,
  usdcHref,
  simulateDecline,
}: {
  amountLabel: string;
  successHref: string;
  usdcHref: string;
  simulateDecline: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "processing" | "declined">("idle");
  const timer = useRef<number | undefined>(undefined);

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

  return (
    <div className="flex flex-col gap-3">
      {status === "declined" && (
        <div role="alert" className="rounded-thumb border border-primary/40 bg-neutral-950 p-3 text-sm">
          <p className="font-semibold text-neutral-50">Card declined.</p>
          <p className="text-neutral-400">
            Your bank didn&apos;t approve this payment. Try again, or{" "}
            <Link href={usdcHref} className="font-medium text-primary underline underline-offset-2 hover:text-neutral-50">
              pay with USDC
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
        aria-label={processing ? "Processing payment" : `Confirm pass, pay ${amountLabel}`}
        className={cx(buttonClasses({ size: "lg", fullWidth: true }), "justify-between")}
      >
        {processing ? (
          <span className="w-full text-center">Processing…</span>
        ) : (
          <>
            <span>Confirm pass</span>
            <span className="inline-flex items-center gap-2 tabular-nums">
              Pay {amountLabel}
              <ArrowRightIcon className="size-5" />
            </span>
          </>
        )}
      </button>
      {/* Announce progress without moving focus */}
      <p aria-live="polite" className="sr-only">
        {processing ? "Processing payment" : status === "declined" ? "Payment declined" : ""}
      </p>
    </div>
  );
}
