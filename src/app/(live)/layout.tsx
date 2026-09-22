import { BottomTabBar } from "@/components/nav/BottomTabBar";
import { TopNav } from "@/components/nav/TopNav";

// Live screens that keep the tab bar (S13 now; S19 Squad Hub in M6). Same shell as (tabs),
// minus the site footer: live is immersive, like checkout (M4 decision D9, 2026-09-22).
// §6.7: phone-first, a centred max-w-md column on desktop.
export default function LiveLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <TopNav />
      {/* pb clears the fixed bottom tab bar on mobile (the footer does this in (tabs)) */}
      <main className="mx-auto w-full max-w-md px-4 pt-4 pb-28 md:pt-10 md:pb-16">{children}</main>
      <BottomTabBar />
    </>
  );
}
