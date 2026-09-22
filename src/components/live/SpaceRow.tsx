import Image from "next/image";
import Link from "next/link";
import { cardInteractive, cardSurface, stretchedLink } from "@/components/ui/card";
import { cx } from "@/lib/cx";

// ex5 "What's happening" row: thumb, title, status, "● Live". A link when the space has a
// screen (Main Hall → S15, Squad → S19); a plain row when no design gives it one.
// ex5's green Live dot is off-palette → primary (as M3 mapped ex9's greens).
export function SpaceRow({
  title,
  status,
  image,
  href,
}: {
  title: string;
  status: string;
  image: string;
  href?: string;
}) {
  return (
    <div className={cx(cardSurface, href && cardInteractive, "isolate flex items-center gap-4 p-3")}>
      <div className="relative size-14 shrink-0 overflow-hidden rounded-thumb bg-neutral-800">
        <Image src={image} alt="" fill sizes="56px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        {href ? (
          <Link href={href} data-card-link className={cx(stretchedLink, "font-semibold text-neutral-50")}>
            {title}
          </Link>
        ) : (
          <p className="font-semibold text-neutral-50">{title}</p>
        )}
        <p className="text-sm text-neutral-400">{status}</p>
      </div>
      <span className="flex shrink-0 items-center gap-1.5 text-sm text-primary">
        <span aria-hidden="true" className="size-2 rounded-full bg-primary" />
        Live
      </span>
    </div>
  );
}
