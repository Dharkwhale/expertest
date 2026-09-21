import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { formatNgn } from "@/lib/format";
import type { OrderLine } from "@/lib/order";

// The order total + the step's primary action (decision D1).
//  - mobile: fixed bottom bar (ex9 "Total (2 passes) ₦50,000 all fees incl." + CTA)
//  - lg: sticky card in the right column, which also lists the order lines
export function CheckoutSummary({
  lines,
  totalNgn,
  totalUsdc,
  passes,
  action,
  note,
  noteDesktopOnly,
  accent,
}: {
  lines: OrderLine[];
  totalNgn: number;
  totalUsdc: number;
  passes: number;
  action: ReactNode;
  /** Small trust line under the CTA (ex13 "Encrypted and secured by EXPER protocol") */
  note?: ReactNode;
  /** Long notes (S08 terms) would make the mobile fixed bar too tall: show them from lg only
      and let the page repeat them in the flow below lg */
  noteDesktopOnly?: boolean;
  /** ex9's handwritten aside ("almost full tonight!"), rendered in Space Grotesk italic (Q10) */
  accent?: string;
}) {
  return (
    <aside
      aria-label="Order total"
      className={cx(
        "fixed inset-x-0 bottom-0 z-40 flex flex-col gap-3 border-t border-neutral-800 bg-neutral-950/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur",
        "md:px-8 lg:sticky lg:top-6 lg:z-auto lg:rounded-card lg:border lg:bg-neutral-900 lg:p-5 lg:backdrop-blur-none",
      )}
    >
      {lines.length > 0 && (
        <ul className="hidden flex-col gap-2 border-b border-neutral-800 pb-3 text-sm lg:flex">
          {lines.map((line) => (
            <li key={line.tier.id} className="flex justify-between gap-3">
              <span className="text-neutral-400">
                {line.tier.name} <span className="tabular-nums">×{line.qty}</span>
              </span>
              <span className="tabular-nums text-neutral-200">{formatNgn(line.subtotalNgn)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="label-caps text-neutral-400">
            Total ({passes} {passes === 1 ? "pass" : "passes"})
          </p>
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-display text-2xl tabular-nums md:text-3xl">{formatNgn(totalNgn)}</span>
            <span className="text-xs text-neutral-400">all fees incl.</span>
          </p>
          <p className="text-xs text-neutral-400 tabular-nums">≈ {totalUsdc.toFixed(2)} USDC</p>
        </div>
        {accent && <p className="max-w-32 text-right text-sm text-primary italic">{accent}</p>}
      </div>

      {action}
      {note && (
        <p
          className={cx(
            "items-center justify-center gap-1.5 text-xs text-neutral-400",
            noteDesktopOnly ? "hidden lg:flex" : "flex",
          )}
        >
          {note}
        </p>
      )}
    </aside>
  );
}
