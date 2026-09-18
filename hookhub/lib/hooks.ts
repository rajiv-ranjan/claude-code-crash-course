import type { Hook } from "./types";

const GITHUB_SEARCH_URL = "https://api.github.com/search/repositories";
const REVALIDATE_SECONDS = 60 * 60 * 24; // daily, per spec's "Fetch timing"

interface GitHubRepo {
  full_name: string;
  name: string;
  description: string | null;
  html_url: string;
  owner: { login: string };
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
}

interface GitHubSearchResponse {
  items: GitHubRepo[];
}

// Heuristic repo -> category mapping (GitHub search results carry no category of their own).
const CATEGORY_KEYWORDS: Array<{ category: string; keywords: string[] }> = [
  { category: "Monitoring & Observability", keywords: ["observability", "monitor", "logging", "trace"] },
  { category: "Security & Validation", keywords: ["security", "validat", "audit", "guard"] },
  { category: "Workflow Automation", keywords: ["workflow", "automation", "orchestrat"] },
  { category: "Testing & Quality", keywords: ["test", "lint", "quality"] },
  { category: "External Integration", keywords: ["slack", "webhook", "integration", "notify", "notification"] },
  { category: "Learning & Examples", keywords: ["example", "tutorial", "mastery", "learn"] },
  { category: "Team Collaboration", keywords: ["team", "collab"] },
];

function categorize(repo: GitHubRepo): string {
  const haystack = `${repo.name} ${repo.description ?? ""}`.toLowerCase();
  for (const { category, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some((keyword) => haystack.includes(keyword))) {
      return category;
    }
  }
  return "Utilities & Helpers";
}

function toHook(repo: GitHubRepo): Hook {
  return {
    id: repo.full_name,
    name: repo.name,
    description: repo.description ?? "No description provided.",
    category: categorize(repo),
    githubUrl: repo.html_url,
    author: repo.owner.login,
    language: repo.language ?? "Unknown",
    stars: repo.stargazers_count,
    lastUpdated: repo.pushed_at,
  };
}

async function searchRepos(query: string): Promise<GitHubRepo[]> {
  const url = `${GITHUB_SEARCH_URL}?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=30`;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(url, {
    headers,
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`GitHub search failed (${res.status}): ${await res.text()}`);
  }

  const data: GitHubSearchResponse = await res.json();
  return data.items;
}

export async function getHooks(): Promise<Hook[]> {
  const [byTopic, byKeyword] = await Promise.all([
    searchRepos("topic:claude-code-hooks"),
    searchRepos('"claude code hooks" in:name,description'),
  ]);

  const byId = new Map<string, GitHubRepo>();
  for (const repo of [...byTopic, ...byKeyword]) {
    byId.set(repo.full_name, repo);
  }

  return Array.from(byId.values())
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .map(toHook);
}
