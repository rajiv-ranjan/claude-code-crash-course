import type { Hook } from "@/lib/types";
import { formatStars, formatUpdated } from "@/lib/format";

export default function HookRow({ hook }: { hook: Hook }) {
  return (
    <a
      href={hook.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-2 border-b border-black/[.08] py-4 transition-colors hover:bg-black/[.02] sm:flex-row sm:items-center sm:justify-between sm:gap-4 dark:border-white/[.12] dark:hover:bg-white/[.03]"
    >
      <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
        <span className="font-semibold text-black dark:text-zinc-50">{hook.name}</span>
        <span className="truncate text-sm text-zinc-600 dark:text-zinc-400">{hook.description}</span>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-500">
        <span className="rounded-full bg-black/[.06] px-2.5 py-0.5 font-medium text-zinc-700 dark:bg-white/[.08] dark:text-zinc-300">
          {hook.category}
        </span>
        <span>{hook.author}</span>
        <span>{hook.language}</span>
        <span>★ {formatStars(hook.stars)}</span>
        <span>Updated {formatUpdated(hook.lastUpdated)}</span>
      </div>
    </a>
  );
}
