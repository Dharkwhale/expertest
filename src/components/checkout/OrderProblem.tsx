import { ButtonLink } from "@/components/ui/Button";

const messages = {
  invalid: {
    title: "This order link isn't valid.",
    body: "It may have been edited or copied incompletely. Choose your passes again.",
  },
  "too-many": {
    title: "That's more than 4 passes.",
    body: "Each person can hold up to 4 passes (a Squad Bundle counts as 4). Adjust your selection.",
  },
  empty: {
    title: "No passes selected yet.",
    body: "Pick at least one pass to continue.",
  },
} as const;

// Shown instead of a checkout step when the order in the URL can't be used (plan §2):
// says what's wrong and sends the user back to Select Access. Nothing is silently fixed.
export function OrderProblem({ reason, accessHref }: { reason: keyof typeof messages; accessHref: string }) {
  const { title, body } = messages[reason];
  return (
    <div role="alert" className="mx-auto flex max-w-md flex-col items-start gap-3 rounded-card border border-neutral-800 bg-neutral-900 p-5">
      <p className="font-medium text-neutral-50">{title}</p>
      <p className="text-neutral-400">{body}</p>
      <ButtonLink href={accessHref} variant="secondary">
        Back to select access
      </ButtonLink>
    </div>
  );
}
