import Image from "next/image";
import { cx } from "@/lib/cx";
import type { Tone } from "@/mock/data";

// Photo avatar (ex3 header) or coloured orb with initials (ex18 constellation).
const sizes = {
  sm: { box: "size-7 text-label", px: 28 },
  md: { box: "size-10 text-xs", px: 40 },
  lg: { box: "size-14 text-sm", px: 56 },
} as const;

const tones: Record<Tone, string> = {
  primary: "bg-primary text-ink",
  secondary: "bg-secondary text-ink",
  tertiary: "bg-tertiary text-neutral-50",
};

type AvatarProps = {
  name: string;
  src?: string;
  size?: keyof typeof sizes;
  tone?: Tone;
  /** Lime ring used on the signed-in user's avatar (ex3) */
  ring?: boolean;
  /** Set when neighbouring text already names the person */
  decorative?: boolean;
  className?: string;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Avatar({
  name,
  src,
  size = "md",
  tone = "tertiary",
  ring,
  decorative,
  className,
}: AvatarProps) {
  const { box, px } = sizes[size];
  const frame = cx(
    "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold",
    ring && "ring-2 ring-primary ring-offset-2 ring-offset-neutral-950",
    box,
    className,
  );

  if (src) {
    return (
      <span className={frame}>
        <Image
          src={src}
          alt={decorative ? "" : name}
          width={px}
          height={px}
          sizes={`${px}px`}
          className="size-full object-cover"
        />
      </span>
    );
  }

  return (
    <span
      className={cx(frame, tones[tone])}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative || undefined}
    >
      {initials(name)}
    </span>
  );
}
