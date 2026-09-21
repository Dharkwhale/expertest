import type { Metadata } from "next";
import { PlaceholderScreen } from "@/components/PlaceholderScreen";

export const metadata: Metadata = { title: "Live" };

export default function LivePage() {
  return (
    <PlaceholderScreen
      stage="Attend"
      title="Live"
      screenId="S13 Live Experience"
      milestone="M4"
    />
  );
}
