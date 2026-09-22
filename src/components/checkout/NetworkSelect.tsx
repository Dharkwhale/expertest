"use client";

import { useId, useState } from "react";
import { ChevronDownIcon, NetworkIcon } from "@/components/icons";
import { USDC_NETWORKS, type UsdcNetwork } from "@/mock/data";

// ex11 network row. Q8 (2026-09-22): Base by default, no gas line, so "Fast • 15 gwei" → "Fast"
// (gwei is a gas unit). A native <select> over the allowlist: client state only, sent nowhere.
export function NetworkSelect() {
  const id = useId();
  const [network, setNetwork] = useState<UsdcNetwork>("Base");

  return (
    <div className="flex items-center gap-3 rounded-thumb border border-neutral-800 bg-neutral-950 p-3">
      <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary/15 text-secondary">
        <NetworkIcon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="font-semibold text-neutral-50">
          Network
        </label>
        <p className="text-sm text-neutral-400">Fast</p>
      </div>
      <div className="relative">
        <select
          id={id}
          value={network}
          onChange={(e) => setNetwork(USDC_NETWORKS.find((n) => n === e.target.value) ?? "Base")}
          className="min-h-11 cursor-pointer appearance-none rounded-thumb border border-neutral-800 bg-neutral-900 py-2 pr-9 pl-3 text-neutral-50 transition-colors hover:border-neutral-500"
        >
          {USDC_NETWORKS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-neutral-400" />
      </div>
    </div>
  );
}
