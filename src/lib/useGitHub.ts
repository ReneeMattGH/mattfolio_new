import { useCallback, useEffect, useState } from 'react';

export interface GitHubProfile {
  login: string;
  name: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
}

export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string; url: string };
  payload?: { commits?: unknown[]; ref_type?: string };
}

export interface GitHubData {
  profile: GitHubProfile;
  repos: GitHubRepo[];
  events: GitHubEvent[];
  fetchedAt: number;
}

type Status = 'loading' | 'ready' | 'error';

interface GitHubState {
  status: Status;
  data: GitHubData | null;
  refetch: () => void;
}

const CACHE_TTL = 10 * 60 * 1000;

function cacheKey(username: string): string {
  return `github:${username}`;
}

function readCache(username: string): GitHubData | null {
  try {
    const raw = window.sessionStorage.getItem(cacheKey(username));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GitHubData;
    if (!parsed?.profile || Date.now() - parsed.fetchedAt > CACHE_TTL) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(username: string, data: GitHubData): void {
  try {
    window.sessionStorage.setItem(cacheKey(username), JSON.stringify(data));
  } catch {
    // Storage can be unavailable in private browsing; live data still renders.
  }
}

export function useGitHub(username: string): GitHubState {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<Omit<GitHubState, 'refetch'>>(() => {
    const cached = typeof window === 'undefined' ? null : readCache(username);
    return cached ? { status: 'ready', data: cached } : { status: 'loading', data: null };
  });

  const refetch = useCallback(() => {
    setState({ status: 'loading', data: null });
    setAttempt((current) => current + 1);
  }, []);

  useEffect(() => {
    const cached = readCache(username);
    if (cached) {
      setState({ status: 'ready', data: cached });
      return;
    }

    const controller = new AbortController();
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    const load = async () => {
      try {
        const [profileResponse, reposResponse, eventsResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`, {
            headers,
            signal: controller.signal,
          }),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
            headers,
            signal: controller.signal,
          }),
          fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, {
            headers,
            signal: controller.signal,
          }),
        ]);

        if (!profileResponse.ok) throw new Error('GitHub profile unavailable');

        const profile = (await profileResponse.json()) as GitHubProfile;
        const repos = reposResponse.ok
          ? ((await reposResponse.json()) as GitHubRepo[])
          : [];
        const events = eventsResponse.ok
          ? ((await eventsResponse.json()) as GitHubEvent[])
          : [];

        const data: GitHubData = {
          profile,
          repos: Array.isArray(repos) ? repos.filter((repo) => !repo.fork) : [],
          events: Array.isArray(events) ? events : [],
          fetchedAt: Date.now(),
        };

        writeCache(username, data);
        setState({ status: 'ready', data });
      } catch (error) {
        if (controller.signal.aborted) return;
        setState({ status: 'error', data: null });
      }
    };

    load();

    return () => controller.abort();
  }, [username, attempt]);

  return { ...state, refetch };
}
