"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { CameraIcon } from "@/components/icons";
import { SectionLabel } from "@/components/ui/SectionLabel";

// ex8's capture button + "Recent responses" (answered 2026-09-22: stay on the prompt and
// show your photo first). Mock only: the file never leaves the browser. It's shown from a
// local blob: URL, revoked when replaced or when the screen unmounts. Non-images are refused.
export function CapturePrompt({
  recent,
  shared,
  aside,
  promptName,
}: {
  recent: readonly string[];
  /** "486 people have shared"; omitted when a prompt has no count in the designs */
  shared?: number;
  aside?: string;
  /** For the capture button's accessible name, e.g. "a moment of light" */
  promptName: string;
}) {
  const inputId = useId();
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const urlRef = useRef<string | null>(null);

  useEffect(() => () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
  }, []);

  function onPick(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow picking the same file again
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(true);
      return;
    }
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = URL.createObjectURL(file);
    setError(false);
    setPhoto(urlRef.current);
  }

  const count = shared !== undefined ? shared + (photo ? 1 : 0) : undefined;
  const showResponses = recent.length > 0 || photo;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-center gap-3">
        {/* A native file input (camera on phones via `capture`), drawn as ex8's ring button */}
        <input
          id={inputId}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onPick}
          className="peer sr-only"
        />
        <label
          htmlFor={inputId}
          className="grid size-20 cursor-pointer place-items-center rounded-full border-2 border-neutral-200 p-1.5 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-primary hover:border-neutral-50 active:scale-98"
        >
          <span className="grid size-full place-items-center rounded-full bg-neutral-800 text-neutral-50">
            <CameraIcon className="size-7" />
          </span>
          <span className="sr-only">{photo ? `Replace your photo of ${promptName}` : `Capture ${promptName}`}</span>
        </label>
        <p aria-live="polite" className="text-sm text-neutral-400">
          {error ? "That file isn't a photo. Try again." : photo ? "Added to recent responses." : ""}
        </p>
      </div>

      {showResponses && (
        <section aria-labelledby={`${inputId}-recent`} className="relative flex flex-col gap-3">
          <SectionLabel>
            <span id={`${inputId}-recent`}>Recent responses</span>
          </SectionLabel>
          <ul className="grid grid-cols-4 gap-3">
            {photo && (
              <li className="relative aspect-square overflow-hidden rounded-thumb border-2 border-primary">
                {/* A local blob: URL can't go through next/image's optimiser */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="Your photo" className="size-full object-cover" />
              </li>
            )}
            {recent.slice(0, photo ? 3 : 4).map((src) => (
              <li key={src} className="relative aspect-square overflow-hidden rounded-thumb bg-neutral-800">
                <Image src={src} alt="" fill sizes="96px" className="object-cover" />
              </li>
            ))}
          </ul>
          <div className="flex items-end justify-between gap-4">
            {count !== undefined && <p className="text-sm text-neutral-400">{count} people have shared</p>}
            {aside && <p className="ml-auto max-w-32 text-right text-primary italic">{aside}</p>}
          </div>
        </section>
      )}
    </div>
  );
}
