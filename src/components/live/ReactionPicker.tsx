"use client";

import { useState } from "react";
import { BoltIcon, FlameIcon, MoonIcon, WaveIcon } from "@/components/icons";
import { cx } from "@/lib/cx";

// ex5 "Quick one": four icon tiles. A native radio group (arrow keys, "radio, 2 of 4") drawn
// as tiles, like RadioCard. Picking one marks it locally; opening the full-screen ex25
// (S17) waits on Q7 (M5). Icon tones: ex5's orange flame is off-palette → neutral-50.
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
}: {
  question: string;
  reactions: readonly Reaction[];
  responses: number;
}) {
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 flex flex-col gap-1">
        <span className="label-caps text-neutral-400">Quick one</span>
        <span className="text-lg text-neutral-50">{question}</span>
      </legend>
      <div className="grid grid-cols-4 gap-3">
        {reactions.map(({ id, label, icon, tone }) => {
          const Icon = icons[icon];
          const checked = picked === id;
          return (
            <label
              key={id}
              className={cx(
                "grid aspect-square cursor-pointer place-items-center rounded-card border transition-colors active:scale-98",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
                checked ? "border-primary bg-neutral-800" : "border-neutral-800 bg-neutral-900 hover:border-neutral-500 hover:bg-neutral-800",
              )}
            >
              <input
                type="radio"
                name="quick-one"
                value={id}
                checked={checked}
                onChange={() => setPicked(id)}
                className="sr-only"
              />
              <Icon className={cx("size-7", tones[tone])} />
              <span className="sr-only">{label}</span>
            </label>
          );
        })}
      </div>
      <p className="text-sm text-neutral-400">{responses} people have responded</p>
    </fieldset>
  );
}
