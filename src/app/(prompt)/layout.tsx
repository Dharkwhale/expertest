// Full-screen live screens: S14 Pocket Mode and the prompts S15–S17 (flow.md §1: no tab bar,
// no top nav; each screen has its own back / ✕). CLAUDE.md §6.7: phone-first, so desktop
// gets the same centred max-w-md column. Screens paint their own background edge to edge.
export default function PromptLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-dvh bg-neutral-950">{children}</div>;
}
