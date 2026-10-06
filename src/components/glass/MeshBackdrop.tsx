// Glass trial round 3: the bottom layer. Three soft radial blobs in the accent colours,
// drifting very slowly (the global prefers-reduced-motion rule stills them). Sits behind
// everything: the memory screen uses it alone, the event screen keeps the blurred hero above it.
export function MeshBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-neutral-950">
      <span className="glass-blob top-[-10%] left-[-15%] size-[70vmin] bg-tertiary/35" />
      <span className="glass-blob top-[25%] right-[-20%] size-[60vmin] bg-secondary/30 [animation-delay:-16s]" />
      <span className="glass-blob bottom-[-15%] left-[20%] size-[55vmin] bg-primary/12 [animation-delay:-32s]" />
    </div>
  );
}
