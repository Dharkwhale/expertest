import { PinIcon } from "@/components/icons";
import { NotificationCard } from "@/components/live/NotificationCard";
import { Avatar } from "@/components/ui/Avatar";
import { squad, squadNotice } from "@/mock/data";

// S18 squad notification (ex22) at the top of /live (Q4 a, answered 2026-09-22). "SOL-SQUAD"
// → the canonical squad; the faces are ex26's four named members; "Join them" → S19. ex22's
// mono lime "4 of 8 are here." → Anton in primary (Q10).
export function SquadNotice() {
  const others = squad.memberCount - squad.members.length;
  return (
    <NotificationCard
      storageKey="exper.squadNotice.dismissed"
      titleId="squad-notice-title"
      channel={squadNotice.channel}
      tag={squad.name}
      time="just now"
      cta={{ label: "Join them", href: "/live/squad" }}
      footer={<p className="label-caps text-center text-neutral-400">{squadNotice.footer}</p>}
    >
      <div>
        <h2 id="squad-notice-title" className="text-lg font-semibold text-neutral-50">
          {squadNotice.title}
        </h2>
        <p className="font-display text-title text-primary uppercase">
          {squadNotice.here} of {squad.memberCount} are here.
        </p>
      </div>
      <div className="flex flex-col gap-3 rounded-thumb bg-neutral-950 p-3">
        <div className="flex items-center justify-between gap-3 border-b border-neutral-800 pb-3">
          <ul aria-label={`${squadNotice.here} squad members here`} className="flex -space-x-2">
            {squad.members.map((member) => (
              <li key={member.id}>
                <Avatar name={member.name} src={member.avatar} tone={member.tone ?? "primary"} size="md" className="ring-2 ring-neutral-950" />
              </li>
            ))}
            {others > 0 && (
              <li aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-neutral-800 text-xs text-neutral-200 ring-2 ring-neutral-950">
                +{others}
              </li>
            )}
          </ul>
          <p className="text-right">
            <span className="label-caps block text-neutral-400">Density</span>
            <span className="text-sm font-semibold text-neutral-50 uppercase">{squadNotice.density}</span>
          </p>
        </div>
        <p className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="flex items-center gap-1.5 text-neutral-50">
            <PinIcon className="size-4 text-primary" />
            {squadNotice.location}
          </span>
          <span className="text-primary">{squadNotice.distance}</span>
        </p>
        <p className="text-sm text-neutral-400 italic">&ldquo;{squadNotice.quote}&rdquo;</p>
      </div>
    </NotificationCard>
  );
}
