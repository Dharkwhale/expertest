// ex17 "● STEP 2 OF 3" pill. ex11 labels the same pill "Checkout protocol"; the step count
// is used on both so the USDC path reads consistently (CLAUDE.md §1, most-consistent-wins).
export function StepIndicator({ step, of }: { step: number; of: number }) {
  return (
    <p className="label-caps inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-primary">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
      Step {step} of {of}
    </p>
  );
}
