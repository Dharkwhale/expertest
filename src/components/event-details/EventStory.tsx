import type { ReactNode } from "react";
import { BoltIcon, MemoryIcon, SpeakerIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/Avatar";
import { cardSurface } from "@/components/ui/card";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { UnavailableButton } from "@/components/ui/UnavailableButton";
import { cx } from "@/lib/cx";
import type { EventDetails, Tone } from "@/mock/data";

const toneText: Record<Tone, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
};

const toneDot: Record<Tone, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
};

const featureIcons: Record<EventDetails["features"][number]["icon"], ReactNode> = {
  speaker: <SpeakerIcon className="size-5" />,
  bolt: <BoltIcon className="size-5" />,
  memory: <MemoryIcon className="size-5" />,
};

// ex10's long-form content: The experience, Curators & lineup, Essential protocol.
export function EventStory({ description, details }: { description?: string; details: EventDetails }) {
  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="experience-heading" className="flex flex-col gap-4">
        <SectionLabel>
          <span id="experience-heading">The experience</span>
        </SectionLabel>
        {description && <p className="max-w-prose text-neutral-200">{description}</p>}
        <ul className="grid gap-3 md:grid-cols-3">
          {details.features.map((feature) => (
            <li key={feature.title} className={cx(cardSurface, "flex gap-3 p-4")}>
              <span
                aria-hidden="true"
                className={cx("grid size-10 shrink-0 place-items-center rounded-thumb bg-neutral-800", toneText[feature.tone])}
              >
                {featureIcons[feature.icon]}
              </span>
              <div>
                <h3 className="label-caps text-neutral-50">{feature.title}</h3>
                <p className="mt-1 text-sm text-neutral-400">{feature.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="lineup-heading" className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <SectionLabel>
            <span id="lineup-heading">Curators &amp; lineup</span>
          </SectionLabel>
          <p className="label-caps text-secondary">{details.acts.length} live acts</p>
        </div>

        <div className={cx(cardSurface, "flex items-center gap-3 p-4")}>
          <Avatar name={details.host.handle.replace("@", "").replace("_", " ")} tone={details.host.tone} ring decorative />
          <div className="min-w-0 flex-1">
            <h3 className="flex flex-wrap items-center gap-2 font-medium text-neutral-50">
              {details.host.handle} &amp; {details.host.partner}
              <span className="label-caps rounded-full bg-primary px-2 py-0.5 text-ink">Host</span>
            </h3>
            <p className="text-sm text-neutral-400">{details.host.role}</p>
          </div>
          <UnavailableButton
            label={`Follow ${details.host.handle}`}
            className="rounded-full border border-neutral-500 px-4 text-sm font-medium text-neutral-50"
          >
            Follow
          </UnavailableButton>
        </div>

        <ol className="flex flex-col gap-2">
          {details.acts.map((act, index) => (
            <li key={act.handle} className={cx(cardSurface, "flex items-center gap-3 px-4 py-3")}>
              <span aria-hidden="true" className={cx("size-2 shrink-0 rounded-full", toneDot[act.tone ?? "primary"])} />
              <p className="min-w-0 flex-1">
                <span className="font-medium text-neutral-50">{act.handle}</span>{" "}
                <span className="text-sm text-neutral-400">— {act.role}</span>
              </p>
              {act.time && (
                <time className={cx("text-sm tabular-nums", index === 0 ? "text-secondary" : "text-neutral-400")}>
                  {act.time}
                </time>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="protocol-heading" className="flex flex-col gap-4">
        <SectionLabel>
          <span id="protocol-heading">Essential protocol</span>
        </SectionLabel>
        <ol className={cx(cardSurface, "flex flex-col gap-4 p-5")}>
          {details.protocol.map((item, index) => (
            <li key={item.title} className="flex gap-3">
              <span aria-hidden="true" className="font-medium text-primary tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-neutral-400">
                <strong className="font-semibold text-neutral-50">{item.title}:</strong> {item.body}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
