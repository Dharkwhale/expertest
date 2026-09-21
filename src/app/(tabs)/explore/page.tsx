import type { Metadata } from "next";
import { ExploreFeed } from "@/components/explore/ExploreFeed";
import { SearchIcon, SlidersIcon } from "@/components/icons";
import { IconButton } from "@/components/ui/IconButton";
import { readViewState } from "@/lib/view-state";
import { attendeePreview, explore, getEvent, getEvents } from "@/mock/data";

export const metadata: Metadata = { title: "Explore" };

// S04 Explore (ex7; ex4 is its duplicate, flow.md §2).
// Search and filter have no screens yet (flow.md §3): shown, disabled.
export default async function ExplorePage({ searchParams }: PageProps<"/explore">) {
  const state = readViewState(await searchParams);

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <header className="flex items-center justify-between gap-4">
        <h1 className="font-display text-display uppercase">Explore</h1>
        <div className="flex gap-2">
          <IconButton label="Search" icon={<SearchIcon />} unavailable />
          <IconButton label="Filters" icon={<SlidersIcon />} unavailable />
        </div>
      </header>

      <ExploreFeed
        featured={getEvent(explore.featuredId)}
        curated={getEvents(explore.curatedIds)}
        forYou={getEvents(explore.forYouIds)}
        cities={explore.cities}
        attendeeFaces={attendeePreview}
        state={state}
      />
    </div>
  );
}
