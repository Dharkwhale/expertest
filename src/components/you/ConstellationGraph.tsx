import { cx } from "@/lib/cx";
import type { Tone } from "@/mock/data";

// ex18's constellation: "YOU" in lime at the centre, six interest nodes around it, faint lines
// between them. Static SVG (no motion in the design). The nodes are listed for assistive tech
// below the drawing, so the SVG itself is decorative.
const fills: Record<Tone, string> = {
  primary: "fill-primary",
  secondary: "fill-secondary",
  tertiary: "fill-tertiary",
};
const strokes: Record<Tone, string> = {
  primary: "stroke-primary",
  secondary: "stroke-secondary",
  tertiary: "stroke-tertiary",
};

type Node = { id: string; label: string; x: number; y: number; tone: Tone };

const YOU = { x: 40, y: 50 };

export function ConstellationGraph({
  nodes,
  edges,
  className,
}: {
  nodes: readonly Node[];
  edges: readonly (readonly [string, string])[];
  className?: string;
}) {
  const at = (id: string) => nodes.find((n) => n.id === id);

  return (
    <figure className={cx("flex flex-col", className)}>
      <svg viewBox="0 0 100 100" aria-hidden="true" className="w-full overflow-visible">
        <g className="stroke-primary" strokeWidth="0.3" opacity="0.5">
          {nodes.map((n) => (
            <line key={`you-${n.id}`} x1={YOU.x} y1={YOU.y} x2={n.x} y2={n.y} />
          ))}
          {edges.map(([a, b]) => {
            const from = at(a);
            const to = at(b);
            return from && to ? <line key={`${a}-${b}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} /> : null;
          })}
        </g>
        {nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="5.5" className={cx("fill-neutral-950", strokes[n.tone])} strokeWidth="0.6" />
            <circle cx={n.x} cy={n.y} r="4.2" className={fills[n.tone]} />
            <text x={n.x} y={n.y + 10} textAnchor="middle" fontSize={4} className="fill-neutral-200">
              {n.label}
            </text>
          </g>
        ))}
        <circle cx={YOU.x} cy={YOU.y} r="10" className="fill-primary" />
        <text x={YOU.x} y={YOU.y + 1.6} textAnchor="middle" fontSize={4.5} className="fill-ink font-semibold">
          YOU
        </text>
      </svg>
      <figcaption className="sr-only">
        Connected to you: {nodes.map((n) => n.label).join(", ")}.
      </figcaption>
    </figure>
  );
}
