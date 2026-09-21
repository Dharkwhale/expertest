import { SectionLabel } from "@/components/ui/SectionLabel";

// Temporary body for tab routes until their milestone builds the real screen.
// Delete each use as its screen lands.
export function PlaceholderScreen({
  stage,
  title,
  screenId,
  milestone,
}: {
  stage: string;
  title: string;
  screenId: string;
  milestone: string;
}) {
  return (
    <section className="flex min-h-[50dvh] flex-col justify-center gap-3">
      <SectionLabel as="p">{stage}</SectionLabel>
      <h1 className="font-display text-display uppercase">{title}</h1>
      <p className="max-w-md text-neutral-400">
        {screenId} is built in {milestone}. This placeholder only proves the shell and navigation.
      </p>
    </section>
  );
}
