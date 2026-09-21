"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";
import { IconButton } from "@/components/ui/IconButton";

// Bottom sheet on mobile → centred max-w-lg modal on md+ (CLAUDE.md §6.6).
// Native <dialog>: showModal() gives focus containment, Esc-to-close, an inert
// background, and returns focus to the trigger on close.
type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export function Modal({ open, onClose, title, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Lock page scroll behind the modal
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        // A click whose target is the <dialog> itself landed on the backdrop
        if (event.target === event.currentTarget) onClose();
      }}
      className={
        "fixed inset-x-0 top-auto bottom-0 m-0 max-h-[85dvh] w-full max-w-none overflow-y-auto " +
        "rounded-t-card bg-neutral-900 p-0 text-neutral-50 backdrop:bg-neutral-950/75 " +
        "md:inset-0 md:m-auto md:h-fit md:max-w-lg md:rounded-card"
      }
    >
      <div className="flex items-start justify-between gap-4 p-5 pb-3 md:p-6 md:pb-3">
        <h2 id={titleId} className="font-display text-title uppercase">
          {title}
        </h2>
        <IconButton label="Close" icon={<CloseIcon />} onClick={onClose} />
      </div>
      <div className="px-5 pb-6 md:px-6">{children}</div>
    </dialog>
  );
}
