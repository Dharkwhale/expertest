import { CheckCircleIcon, UserIcon } from "@/components/icons";
import { NotificationCard } from "@/components/live/NotificationCard";
import { UnavailableButton } from "@/components/ui/UnavailableButton";
import { formatCompact } from "@/lib/format";
import { liveNotice, liveNow, passTemplate } from "@/mock/data";

// S12 pre-event notification (ex23) at the top of Home (Q4 a, D5 a). "Starts in 30 minutes"
// → "is happening now" (the event is live); "View venue coordinates" has no map screen.
export function PreEventNotice({ room }: { room: string }) {
  return (
    <NotificationCard
      storageKey="exper.liveNotice.dismissed"
      titleId="live-notice-title"
      channel={liveNotice.channel}
      tag={passTemplate.credential}
      time="now"
      cta={{ label: "Open Exper", href: "/live" }}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-x-4 text-sm text-neutral-400">
          <p className="flex items-center gap-2">
            <CheckCircleIcon className="size-4 text-primary" />
            Pass active on device
          </p>
          <UnavailableButton label="View venue coordinates" className="hover:text-neutral-400">
            View venue coordinates →
          </UnavailableButton>
        </div>
      }
    >
      <div>
        <h2 id="live-notice-title" className="text-lg font-semibold text-neutral-50">
          {liveNotice.title}
        </h2>
        <p className="text-neutral-200">{liveNotice.body}</p>
      </div>
      <div className="flex flex-col gap-2 rounded-thumb bg-neutral-950 p-3">
        <p className="flex flex-wrap items-center gap-2 text-sm text-neutral-50">
          <span className="label-caps rounded-thumb border border-primary/60 bg-primary/10 px-2 py-0.5 text-primary">{liveNotice.roomTag}</span>
          {room}
        </p>
        <p className="flex items-center gap-2 text-sm text-neutral-400">
          <UserIcon className="size-4" />
          {liveNotice.people} · {formatCompact(liveNow.inRoom)} in room
        </p>
      </div>
    </NotificationCard>
  );
}
