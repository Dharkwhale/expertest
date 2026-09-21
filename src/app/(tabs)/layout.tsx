import { BottomTabBar } from "@/components/nav/BottomTabBar";
import { TopNav } from "@/components/nav/TopNav";

// App shell for every screen that shows the tab bar (flow.md §1: S03, S04, S13, S19,
// S21, S22). Full-screen routes (checkout, prompts, pocket mode) live outside this group.
export default function TabsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <TopNav />
      {/* pb clears the fixed bottom bar on mobile */}
      <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-28 md:px-8 md:pt-10 md:pb-16">
        {children}
      </main>
      <BottomTabBar />
    </>
  );
}
