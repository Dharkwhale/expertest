import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { cardInteractive, cardSurface, stretchedLink } from "@/components/ui/card";
import { cx } from "@/lib/cx";
import type { Tone, Wallet } from "@/mock/data";

// ex17 wallet row. Choosing one is navigation to S10 only: nothing talks to a real wallet.
// The brand logo is a monogram tile in a palette token (no copied logos).
const tileTones: Record<Tone, string> = {
  primary: "border-primary/40 bg-primary/10 text-primary",
  secondary: "border-secondary/40 bg-secondary/10 text-secondary",
  tertiary: "border-tertiary/40 bg-neutral-950 text-tertiary",
};

export function WalletOption({ wallet, href }: { wallet: Wallet; href: string }) {
  return (
    <div className={cx(cardSurface, cardInteractive, "flex items-center gap-4 p-4")}>
      <span
        aria-hidden="true"
        className={cx("grid size-11 shrink-0 place-items-center rounded-thumb border font-semibold", tileTones[wallet.tone])}
      >
        {wallet.name.charAt(0)}
      </span>
      <div className="min-w-0 flex-1">
        <Link href={href} data-card-link className={cx(stretchedLink, "font-semibold text-neutral-50")}>
          {wallet.name}
        </Link>
        <p className="text-sm text-neutral-400">{wallet.detail}</p>
      </div>
      {"badge" in wallet && (
        <span className="label-caps shrink-0 rounded-full bg-primary px-2.5 py-1 text-ink">{wallet.badge}</span>
      )}
      <ChevronRightIcon className="size-5 shrink-0 text-neutral-400" />
    </div>
  );
}
