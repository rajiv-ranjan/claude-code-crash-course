"use client";

import { useState } from "react";
import type { Hook } from "@/lib/types";
import HookCard from "./HookCard";
import HookRow from "./HookRow";

type View = "grid" | "list";

export default function HooksBrowser({ hooks }: { hooks: Hook[] }) {
  const [view, setView] = useState<View>("grid");

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {hooks.length} hook{hooks.length === 1 ? "" : "s"}
        </p>
        <div className="flex rounded-full border border-black/[.08] p-1 dark:border-white/[.12]">
          <ViewButton label="Grid" active={view === "grid"} onClick={() => setView("grid")} />
          <ViewButton label="List" active={view === "list"} onClick={() => setView("list")} />
        </div>
      </div>

      {hooks.length === 0 ? (
        <p className="py-16 text-center text-sm text-zinc-500 dark:text-zinc-500">
          No hooks found. Try again later.
        </p>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hooks.map((hook) => (
            <HookCard key={hook.id} hook={hook} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          {hooks.map((hook) => (
            <HookRow key={hook.id} hook={hook} />
          ))}
        </div>
      )}
    </div>
  );
}

function ViewButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-foreground text-background"
          : "text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
      }`}
    >
      {label}
    </button>
  );
}
