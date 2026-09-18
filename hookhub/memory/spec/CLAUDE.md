# HookHub — Product Spec

## Overview
HookHub is a browsing site for discovering open-source Claude Code hooks. Users can explore
a curated list of hook repositories/implementations without needing an account.

## MVP Scope
**In scope:**
- Display-only browsing of a hooks list (no auth, no submissions, no backend)
- Two view modes for the hooks list: **Grid** and **List**, with a toggle to switch between them
- Each hook entry shows: name, short description, category, GitHub link, author, primary language, stars, last updated
- Hook data pulled from GitHub (via GitHub Search API) rather than hand-maintained

**Out of scope (MVP):**
- User accounts, hook submission forms, ratings/reviews, comments
- Hook installation/testing features

## Data Source
Hooks are pulled from **GitHub via the GitHub Search API**, not manually hardcoded. The app
queries GitHub for repositories matching Claude Code hook criteria (e.g. topic
`claude-code-hooks` and/or a keyword search such as "claude code hooks"), and maps the
results into the `Hook` data model below.

- **Fetch timing:** build-time fetch (via Next.js data fetching / ISR revalidation), not a
  live request on every page load. This keeps the site fast and avoids hitting GitHub API
  rate limits per-visitor. A revalidation interval (e.g. daily) refreshes the list
  periodically without a full redeploy.
- **Categorization:** since GitHub search results have no built-in "category," the mapping
  from repo → `category` is a lightweight heuristic/manual override step (e.g. a small
  lookup table keyed by repo name, or keyword matching on the repo description) rather than
  data GitHub provides directly.
- **Auth:** requests use a GitHub personal access token (server-side only, via env var) to
  get a higher API rate limit; never exposed to the client.

## Data Model
```typescript
interface Hook {
  id: string;                // derived from GitHub repo full_name (owner/repo)
  name: string;               // GitHub repo name
  description: string;        // GitHub repo description, short/truncated
  category: string;           // e.g. "Workflow Automation", "Security", "Utility" (heuristic/manual mapping, not from GitHub)
  githubUrl: string;           // GitHub repo html_url
  author: string;              // GitHub repo owner login
  language: string;            // GitHub repo primary language
  stars: number;               // GitHub repo stargazers_count
  lastUpdated: string;          // GitHub repo pushed_at / updated_at
}
```

## UI/UX Requirements

### Page Layout
- Header: "HookHub" title + short tagline explaining what Claude Code hooks are
- View toggle control (Grid / List), positioned above the hooks collection
- Hooks collection area that renders using whichever view is currently selected

### Grid View
- Card-based layout, responsive columns (e.g. 3-4 desktop, 2 tablet, 1 mobile)
- Each card: hook name, category badge, truncated description, author, language, stars, GitHub link

### List View
- Single-column, denser rows — one hook per row
- Each row: hook name, category, one-line description, author, language, stars, GitHub link
- More scannable/compact than grid; suited to quickly scanning many hooks at once

### Shared behavior
- Both views read from the same underlying hooks dataset — switching views is a pure
  presentation change, not a data reload
- Responsive: usable on mobile and desktop
- No search/filtering required for this initial spec (may be added later)

## Tech Notes
- Built inside the existing `hookhub/` Next.js (App Router) + TypeScript + Tailwind CSS v4 app
- Fetch from the GitHub Search API in a server-side data function (e.g. `hookhub/lib/hooks.ts`
  or a route handler), called at build time / on ISR revalidation — not from the client
- GitHub API responses are mapped into the `Hook` shape and passed to the page as props
  (e.g. via `fetch` with Next.js `revalidate`, or `generateStaticParams`/static rendering)
- GitHub token stored in an env var (e.g. `GITHUB_TOKEN`), read only on the server
- View toggle state can be local component state (e.g. `useState<'grid' | 'list'>`) — no
  routing or persistence requirements specified

## Future Considerations (not in this spec's scope)
- Search and category/language filtering
- Community hook submissions
- Hook detail pages
