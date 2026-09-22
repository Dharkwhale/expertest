import Link from "next/link";
import { NAV_ITEMS } from "@/components/nav/nav-items";
import { UnavailableButton } from "@/components/ui/UnavailableButton";
import { Wordmark } from "@/components/Wordmark";
import { cx } from "@/lib/cx";
import { brand, lander } from "@/mock/data";

// "Poster sign-off" footer (user request + pick, 2026-09-22). No design has a footer, so all
// copy is reused from existing screens (see `brand` in mock/data.ts). Phones get a compact
// version: the App column is dropped because the bottom tab bar already carries those links.
// Not rendered in checkout (a focused flow).
//
// `clearance` keeps the last line clear of whatever is fixed to the bottom edge on mobile.
const clearances = {
  tabbar: "pb-28 md:pb-10", // bottom tab bar, hidden from md
  cta: "pb-32 lg:pb-10", // S05 fixed "Join experience" bar, which becomes a sticky card at lg
  none: "pb-10",
};

const manifestoWords = brand.manifesto.split(" ");
const manifestoLast = manifestoWords.pop();
const manifestoLead = manifestoWords.join(" ");

export function SiteFooter({ clearance = "none" }: { clearance?: keyof typeof clearances }) {
  return (
    <footer className={cx("mt-16 border-t border-neutral-800 md:mt-24", clearances[clearance])}>
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-10 md:gap-14 md:px-8 md:pt-16">
        {/* ex19's line; its last word takes the lime accent, as the Lander does with "experience." */}
        <p className="max-w-3xl text-title leading-tight font-medium text-neutral-50">
          {manifestoLead} <span className="text-primary">{manifestoLast}</span>
        </p>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
          <nav aria-label="Footer" className="hidden md:block">
            <h2 className="label-caps text-neutral-400">App</h2>
            <ul className="mt-3 flex flex-col">
              {NAV_ITEMS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex min-h-11 items-center text-neutral-200 transition-colors hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="footer-worlds">
            {/* ex6's label for the same list */}
            <h2 id="footer-worlds" className="label-caps text-neutral-400">
              Connected constellation
            </h2>
            <ul className="mt-3 flex flex-col gap-2 text-neutral-200 md:mt-5">
              {lander.cities.map((city) => (
                <li key={city}>{city}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="footer-legal">
            <h2 id="footer-legal" className="label-caps text-neutral-400">
              Legal
            </h2>
            {/* ex14 names both; neither has a screen yet (flow.md §3) */}
            <ul className="mt-3 flex flex-col">
              <li>
                <UnavailableButton label="Experience Terms" className="text-left text-neutral-200">
                  Experience Terms
                </UnavailableButton>
              </li>
              <li>
                <UnavailableButton label="Refund Policy" className="text-left text-neutral-200">
                  Refund Policy
                </UnavailableButton>
              </li>
            </ul>
          </section>
        </div>

        {/* The sign-off: decorative, the © line below names the brand for assistive tech */}
        <p aria-hidden="true" className="flex items-start leading-none select-none">
          <Wordmark className="text-wordmark tracking-normal text-neutral-50" />
          {/* dot sized in em so it scales with the wordmark (ex6 logo) */}
          <span className="mt-[0.06em] ml-[0.04em] size-[0.12em] shrink-0 rounded-full bg-primary text-wordmark" />
        </p>

        <div className="flex flex-col gap-2 border-t border-neutral-800 pt-6 text-sm text-neutral-400 md:flex-row md:items-center md:justify-between">
          <p>{brand.copyright}</p>
          <p>{brand.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
