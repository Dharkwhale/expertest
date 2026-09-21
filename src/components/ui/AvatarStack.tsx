import Image from "next/image";
import { cx } from "@/lib/cx";

// ex3 "1,240 people going" faces. Decorative: always pair it with visible text that
// states the count, which is what assistive tech reads.
export function AvatarStack({
  images,
  max = 4,
  className,
}: {
  images: string[];
  max?: number;
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={cx("flex -space-x-2", className)}>
      {images.slice(0, max).map((src) => (
        <span
          key={src}
          className="relative size-7 overflow-hidden rounded-full ring-2 ring-neutral-950"
        >
          <Image
            src={src}
            alt=""
            width={28}
            height={28}
            sizes="28px"
            className="size-full object-cover"
          />
        </span>
      ))}
    </span>
  );
}
