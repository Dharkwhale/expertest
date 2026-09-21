import type { Metadata } from "next";
import { PlaceholderScreen } from "@/components/PlaceholderScreen";

export const metadata: Metadata = { title: "You" };

export default function YouPage() {
  return (
    <PlaceholderScreen
      stage="Remember"
      title="Your Constellation"
      screenId="S22 Your Constellation"
      milestone="M7"
    />
  );
}
