# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose and structure

This is **not a single application** — it's the teaching repository for the "Claude Code Crash Course." Each `project/*` git branch is a self-contained lesson on a specific Claude Code feature, and commits within a branch are ordered chronologically so a learner can step through them one at a time (`git log --oneline --reverse`).

Because of this, the working tree's contents depend entirely on which `project/*` branch is checked out. Before doing any non-trivial work, check `git branch --show-current` and `git log --oneline -10` to understand which lesson/stage you're in — don't assume the repo root always looks like what's on `main`.

The `hookhub/` directory is a Next.js app used as the running example for hook-related lessons (`project/hookhub*` branches, e.g. `project/hookhub-rr`).

## Commands (hookhub app)

All commands run from the `hookhub/` directory:

```bash
npm run dev     # start dev server (Next.js, Turbopack) at http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint (eslint-config-next core-web-vitals + typescript rules)
```

There is no test runner configured in `hookhub/` currently.

## Architecture notes

- `hookhub/` is a stock Next.js **App Router** project (`next@16`, `react@19`) bootstrapped with `create-next-app` — routing and layout live under `hookhub/app/`, with `app/layout.tsx` as the root layout and `app/page.tsx` as the home route.
- Path alias `@/*` resolves to the `hookhub/` root (see `hookhub/tsconfig.json`).
- Styling uses Tailwind CSS v4 via `@tailwindcss/postcss` (see `hookhub/postcss.config.mjs`), not a `tailwind.config.js`.
- `hookhub/lib/hooks.ts` fetches hook repo data from the GitHub Search API with a 24h revalidation window, maps it to the `Hook` type in `hookhub/lib/types.ts`, and it's rendered by `HooksBrowser` → `HookRow`/`HookCard` in `hookhub/components/`. It runs two parallel searches (topic `claude-code-hooks` and a keyword search), dedupes by `full_name`, sorts by stars, and assigns `category` via keyword-matching heuristics (GitHub has no native category field) — see `categorize()`/`CATEGORY_KEYWORDS`.
- `hookhub/memory/spec/CLAUDE.md` is the HookHub product spec (MVP scope, data model, UI requirements) — check it before changing hookhub behavior to see whether a change is in- or out-of-scope for the lesson.
- **`hookhub/AGENTS.md` is auto-generated/re-added by `next dev`** (see `node_modules/next/dist/server/lib/generate-agent-files.js`). Do not manually delete its Next.js agent-rules block — it will simply reappear, and it should be committed rather than fought. It instructs agents to read `node_modules/next/dist/docs/` before writing Next.js code, since this Next.js version has breaking API/convention changes from what training data may assume.
- `hookhub/CLAUDE.md` just references `@AGENTS.md`, so agent instructions for that subproject live in `AGENTS.md`, not duplicated there.

## Working across branches

- When asked to work on a specific lesson topic, confirm/checkout the matching `project/*` branch first (see the branch table in the root `README.md`).
- Keep commits on a `project/*` branch atomic and in teaching order if adding to a lesson — each commit is meant to demonstrate one incremental step.
