import type { Metadata, Viewport } from "next";
import { Anton, Space_Grotesk } from "next/font/google";
import { NavigationTracker } from "@/components/nav/NavigationTracker";
import "./globals.css";

// Two faces only (Q10): Anton for headlines, Space Grotesk for body and labels.
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-anton",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: { default: "Exper", template: "%s · Exper" },
  description: "Discover. Participate. Generate. Remember.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08080c", // mirrors --color-neutral-950; metadata can't read CSS variables
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${anton.variable} ${spaceGrotesk.variable}`}>
      <body>
        <NavigationTracker />
        {children}
      </body>
    </html>
  );
}
