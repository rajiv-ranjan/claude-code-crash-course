import type { Hook } from "@/lib/types";
import { formatStars, formatUpdated } from "@/lib/format";

export default function HookCard({ hook }: { hook: Hook }) {
  return (
    <a
      href={hook.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-3 rounded-xl border border-black/[.08] bg-white p-5 transition-colors hover:border-black/[.16] dark:border-white/[.12] dark:bg-white/[.03] dark:hover:border-white/[.24]"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-black dark:text-zinc-50">{hook.name}</h3>
        <span className="shrink-0 rounded-full bg-black/[.06] px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-white/[.08] dark:text-zinc-300">
          {hook.category}
        </span>
      </div>
      <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{hook.description}</p>
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-500">
        <span>{hook.author}</span>
        <span>{hook.language}</span>
        <span>★ {formatStars(hook.stars)}</span>
        <span>Updated {formatUpdated(hook.lastUpdated)}</span>
      </div>
    </a>
  );
}
