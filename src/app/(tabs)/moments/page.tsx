import type { Metadata } from "next";
import { PlaceholderScreen } from "@/components/PlaceholderScreen";

export const metadata: Metadata = { title: "Moments" };

export default function MomentsPage() {
  return (
    <PlaceholderScreen stage="Remember" title="Moments" screenId="S21 Moments" milestone="M7" />
  );
}
