import { SiteFooter } from "@/components/nav/SiteFooter";
import { TopNav } from "@/components/nav/TopNav";

// Detail screens (S05 Event Details). flow.md §1: no bottom tab bar here; the screen's
// own sticky CTA owns the bottom edge on mobile. md+ keeps the top nav so desktop users
// aren't stranded on a deep page.
export default function DetailLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <TopNav />
      {children}
      {/* Clears S05's fixed "Join experience" bar on mobile */}
      <SiteFooter clearance="cta" />
    </>
  );
}
