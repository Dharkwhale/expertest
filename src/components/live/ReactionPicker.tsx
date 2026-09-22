import Link from "next/link";
import { BoltIcon, FlameIcon, MoonIcon, WaveIcon } from "@/components/icons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cx } from "@/lib/cx";

// ex5 "Quick one": four icon tiles. Q7 (2026-09-22): tapping any of them opens the
// full-screen S17 "How did that feel?" (ex25). ex25's feelings differ from these four icons,
// so nothing is carried over. Each tile's name is its accessible label. Icon tones: ex5's
// orange flame is off-palette → neutral-50.
const icons = { wave: WaveIcon, bolt: BoltIcon, moon: MoonIcon, flame: FlameIcon };
const tones = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
  neutral: "text-neutral-50",
};

type Reaction = { id: string; label: string; icon: keyof typeof icons; tone: keyof typeof tones };

export function ReactionPicker({
  question,
  reactions,
  responses,
  href,
}: {
  question: string;
  reactions: readonly Reaction[];
  responses: number;
  href: string;
}) {
  return (
    <section aria-labelledby="quick-one-question" className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <SectionLabel as="p">Quick one</SectionLabel>
        <h2 id="quick-one-question" className="text-lg text-neutral-50">
          {question}
        </h2>
      </div>
      <ul className="grid grid-cols-4 gap-3">
        {reactions.map(({ id, label, icon, tone }) => {
          const Icon = icons[icon];
          return (
            <li key={id}>
              <Link
                href={href}
                aria-label={label}
                className="grid aspect-square place-items-center rounded-card border border-neutral-800 bg-neutral-900 transition-colors hover:border-neutral-500 hover:bg-neutral-800 active:scale-98"
              >
                <Icon className={cx("size-7", tones[tone])} />
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="text-sm text-neutral-400">{responses} people have responded</p>
    </section>
  );
}
