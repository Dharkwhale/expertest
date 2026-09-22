import { BottomTabBar } from "@/components/nav/BottomTabBar";
import { SiteFooter } from "@/components/nav/SiteFooter";
import { TopNav } from "@/components/nav/TopNav";

// App shell for every screen that shows the tab bar (flow.md §1: S03, S04, S13, S19,
// S21, S22). Full-screen routes (checkout, prompts, pocket mode) live outside this group.
export default function TabsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <TopNav />
      <main className="mx-auto w-full max-w-6xl px-4 pt-6 md:px-8 md:pt-10">{children}</main>
      {/* The footer now owns the space that clears the fixed bottom tab bar on mobile */}
      <SiteFooter clearance="tabbar" />
      <BottomTabBar />
    </>
  );
}
