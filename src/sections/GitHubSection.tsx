import { ArrowUpRight, Github, RefreshCw, Star } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { githubFallback } from '../data/github';
import { profile } from '../data/profile';
import type { GitHubEvent } from '../lib/useGitHub';
import { useGitHub } from '../lib/useGitHub';
import { cn, formatNumber, formatRelativeTime } from '../lib/utils';

const GITHUB_USERNAME = 'ReneeMattGH';
const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`;
const WEEKS = 13;

const pinnedRepos = [
  {
    name: 'BlockVault',
    display: 'BlockVault',
    fallback: 'Wallet-gated password and personal-data vault.',
  },
  {
    name: 'Win-Trade---Trading-Bot',
    display: 'Win-Trade Trading Bot',
    fallback: 'Automated trading bot using an ATR strategy with EMA alerts.',
  },
  {
    name: 'NFT_minter',
    display: 'NFT Minter',
    fallback: 'NFT minting experiment.',
  },
  {
    name: 'Crypto-token.sol',
    display: 'Crypto-token.sol',
    fallback: 'Solidity token contract.',
  },
];

function eventLabel(event: GitHubEvent): string {
  const repo = event.repo.name.split('/').pop() ?? event.repo.name;
  switch (event.type) {
    case 'PushEvent':
      return `Pushed to ${repo}`;
    case 'CreateEvent':
      return `Created ${repo}`;
    case 'PullRequestEvent':
      return `Pull request in ${repo}`;
    case 'WatchEvent':
      return `Starred ${repo}`;
    case 'ForkEvent':
      return `Forked ${repo}`;
    case 'IssuesEvent':
      return `Issue activity in ${repo}`;
    case 'ReleaseEvent':
      return `Released ${repo}`;
    default:
      return `${event.type.replace('Event', '')} · ${repo}`;
  }
}

interface DayCell {
  key: string;
  count: number;
  future: boolean;
  label: string;
}

function buildHeatmap(events: GitHubEvent[]): DayCell[] {
  const counts = new Map<string, number>();

  for (const event of events) {
    const key = event.created_at.slice(0, 10);
    const increment =
      event.type === 'PushEvent' ? Math.max(1, event.payload?.commits?.length ?? 1) : 1;
    counts.set(key, (counts.get(key) ?? 0) + increment);
  }

  const now = new Date();
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - ((WEEKS - 1) * 7 + today.getUTCDay()));

  const cells: DayCell[] = [];
  for (let index = 0; index < WEEKS * 7; index += 1) {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    const key = date.toISOString().slice(0, 10);
    cells.push({
      key,
      count: counts.get(key) ?? 0,
      future: date.getTime() > today.getTime(),
      label: `${date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })} · ${counts.get(key) ?? 0} events`,
    });
  }

  return cells;
}

function cellColor(count: number, future: boolean): string {
  if (future) return 'rgba(255,255,255,0.02)';
  if (count === 0) return 'rgba(255,255,255,0.05)';
  if (count === 1) return 'rgba(143,180,255,0.25)';
  if (count === 2) return 'rgba(143,180,255,0.42)';
  if (count <= 4) return 'rgba(143,180,255,0.62)';
  return 'var(--accent)';
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="kicker text-faint">{label}</dt>
      <dd className="mt-2 text-[clamp(1.7rem,3vw,2.3rem)] font-semibold leading-none tracking-[-0.045em] text-ink tabular">
        {value}
      </dd>
    </div>
  );
}

export function GitHubSection() {
  const { status, data, refetch } = useGitHub(GITHUB_USERNAME);
  const repos = data?.repos ?? [];
  const events = data?.events ?? [];
  const cells = buildHeatmap(events);
  const totalEvents = cells.reduce((sum, cell) => sum + cell.count, 0);
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const repoMap = new Map(repos.map((repo) => [repo.name, repo]));
  const pending = status === 'loading';
  const unavailable = status === 'error';

  return (
    <section id="github" className="section">
      <div className="shell">
        <SectionHeader
          index="06"
          label="GitHub"
          title={
            <>
              Built in the <span className="text-outline">open<span className="title-punct">.</span></span>
            </>
          }
          description="Public repositories, pinned work and recent activity."
        />

        {unavailable ? (
          <Reveal>
            <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[10px] border border-line bg-surface px-4 py-3 font-mono text-[11px] tracking-[0.02em] text-muted">
              <span>Live GitHub data is unavailable right now.</span>
              <button
                type="button"
                onClick={refetch}
                className="inline-flex items-center gap-1.5 text-ink transition-colors hover:text-accent"
              >
                <RefreshCw size={11} aria-hidden="true" />
                Retry
              </button>
              <span aria-hidden="true" className="text-faint">
                /
              </span>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="link-underline text-ink"
              >
                View the profile on GitHub
              </a>
            </div>
          </Reveal>
        ) : null}

        <Reveal>
          <div className="data-console overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-4 md:px-7">
              <div className="flex items-center gap-2.5">
                <Github size={15} strokeWidth={1.5} className="text-accent" aria-hidden="true" />
                <span className="kicker text-muted">@{GITHUB_USERNAME}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    unavailable ? 'bg-faint' : 'status-dot bg-accent',
                  )}
                />
                <span className="kicker text-faint">
                  {unavailable ? 'Cached snapshot' : pending ? 'Syncing feed' : 'Live feed'}
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-12">
              <div className="border-b border-line px-5 py-6 md:px-7 md:py-8 lg:col-span-5 lg:border-b-0 lg:border-r">
                <p className="max-w-[36ch] text-[15px] leading-[1.65] text-muted">
                  Multi-time hackathon builder, shipping smart contracts and full-stack products.
                </p>

                <dl className="mt-8 grid grid-cols-3 gap-4">
                  <Stat
                    label="Repositories"
                    value={
                      pending
                        ? '—'
                        : formatNumber(
                            data?.profile.public_repos ?? githubFallback.repositories,
                          )
                    }
                  />
                  <Stat
                    label="Followers"
                    value={
                      pending
                        ? '—'
                        : formatNumber(data?.profile.followers ?? githubFallback.followers)
                    }
                  />
                  <Stat
                    label="Stars"
                    value={pending || unavailable ? '—' : formatNumber(totalStars)}
                  />
                </dl>

                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-sweep mt-8 font-mono text-[10px] uppercase tracking-[0.1em] text-muted hover:text-ink"
                >
                  Open profile
                  <ArrowUpRight size={12} aria-hidden="true" />
                </a>
              </div>

              <div className="flex flex-col px-5 py-6 md:px-7 md:py-8 lg:col-span-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="kicker text-faint">Public activity</span>
                  <span className="kicker tabular text-faint">Last {WEEKS} weeks</span>
                </div>

                {unavailable ? (
                  <div className="mt-6 flex flex-1 flex-col justify-between gap-6">
                    <div className="rounded-[8px] border border-line bg-white/[0.015] p-5">
                      <p className="kicker text-faint">Feed paused</p>
                      <p className="mt-2 max-w-[46ch] text-[13px] leading-[1.65] text-muted">
                        GitHub&apos;s public API is rate-limited right now. The counts on the left
                        are a cached snapshot, and live activity resumes when the limit resets.
                      </p>
                      <button
                        type="button"
                        onClick={refetch}
                        className="group mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-ink transition-colors hover:text-accent"
                      >
                        <RefreshCw
                          size={11}
                          className="transition-transform duration-300 group-hover:rotate-90"
                          aria-hidden="true"
                        />
                        Try again
                      </button>
                    </div>
                    <p className="kicker text-faint">Public events · heatmap unavailable</p>
                  </div>
                ) : (
                  <>
                    <div className="mt-7 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
                      <div
                        className="grid w-max gap-[3px] [grid-auto-columns:12px] [grid-auto-flow:column] [grid-template-rows:repeat(7,12px)]"
                        role="img"
                        aria-label={`Public GitHub activity over the last ${WEEKS} weeks: ${totalEvents} events`}
                      >
                        {cells.map((cell) => (
                          <span
                            key={cell.key}
                            title={cell.label}
                            className="h-3 w-3 rounded-[2px]"
                            style={{ backgroundColor: cellColor(cell.count, cell.future) }}
                          />
                        ))}
                      </div>

                      <div className="shrink-0 sm:text-right">
                        <p className="text-[clamp(1.8rem,3vw,2.3rem)] font-semibold leading-none tracking-[-0.04em] text-ink tabular">
                          {pending ? '—' : totalEvents}
                        </p>
                        <p className="kicker mt-2 text-faint">Public events</p>
                        <div className="mt-4 flex items-center gap-1.5 sm:justify-end">
                          <span className="kicker text-faint">Less</span>
                          {[0, 1, 2, 3, 5].map((count) => (
                            <span
                              key={count}
                              className="h-[9px] w-[9px] rounded-[2px]"
                              style={{ backgroundColor: cellColor(count, false) }}
                            />
                          ))}
                          <span className="kicker text-faint">More</span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-auto pt-7 font-mono text-[9px] uppercase leading-[1.5] tracking-[0.12em] text-faint/70">
                      From GitHub&apos;s public events feed · private contributions not included
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="grid border-t border-line lg:grid-cols-2">
              <div className="border-b border-line px-5 py-6 md:px-7 md:py-8 lg:border-b-0 lg:border-r">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="kicker text-faint">Pinned repositories</span>
                  <a
                    href={`${GITHUB_URL}?tab=repositories`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-sweep inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-faint transition-colors hover:text-ink"
                  >
                    All repositories
                    <ArrowUpRight size={11} aria-hidden="true" />
                  </a>
                </div>

                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {pinnedRepos.map((item) => {
                    const repo = repoMap.get(item.name);
                    return (
                      <a
                        key={item.name}
                        href={repo?.html_url ?? `${GITHUB_URL}/${item.name}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group row-hover flex flex-col rounded-[6px] border border-line bg-white/[0.015] p-4 transition-colors duration-300 hover:border-line-strong"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate font-mono text-[11px] text-ink">
                            {item.display}
                          </span>
                          <ArrowUpRight
                            size={12}
                            aria-hidden="true"
                            className="shrink-0 text-faint transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                          />
                        </div>
                        <p className="mt-2 line-clamp-2 text-[12px] leading-[1.55] text-muted">
                          {repo?.description || item.fallback}
                        </p>
                        <div className="mt-auto flex min-h-[18px] items-center gap-3 pt-4 font-mono text-[9px] uppercase tracking-[0.05em] text-faint">
                          {repo?.language ? (
                            <span className="inline-flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
                              {repo.language}
                            </span>
                          ) : null}
                          {repo ? (
                            <span className="inline-flex items-center gap-1">
                              <Star size={9} aria-hidden="true" />
                              {repo.stargazers_count}
                            </span>
                          ) : null}
                          {!pending && !repo ? <span>Public repository</span> : null}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col px-5 py-6 md:px-7 md:py-8">
                <div className="flex items-center justify-between gap-4">
                  <span className="kicker text-faint">Recent activity</span>
                  <span className="kicker text-faint">Public feed</span>
                </div>

                {pending ? (
                  <div className="mt-5 space-y-4">
                    {[0, 1, 2].map((row) => (
                      <div key={row} className="flex flex-col gap-2">
                        <span className="h-1.5 w-2/3 rounded-full bg-white/[0.08]" />
                        <span className="h-1 w-1/3 rounded-full bg-white/[0.05]" />
                      </div>
                    ))}
                  </div>
                ) : events.length > 0 ? (
                  <ul className="mt-4 divide-y divide-line">
                    {events.slice(0, 5).map((event) => (
                      <li key={event.id}>
                        <a
                          href={`https://github.com/${event.repo.name}`}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="group flex items-start justify-between gap-4 py-3"
                        >
                          <span className="flex min-w-0 gap-2.5">
                            <span
                              aria-hidden="true"
                              className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent"
                            />
                            <span className="min-w-0">
                              <span className="block truncate text-[13px] text-muted transition-colors group-hover:text-ink">
                                {eventLabel(event)}
                              </span>
                              <span className="mt-1 block truncate font-mono text-[10px] tracking-[0.04em] text-faint">
                                {event.repo.name}
                              </span>
                            </span>
                          </span>
                          <time
                            dateTime={event.created_at}
                            title={new Date(event.created_at).toDateString()}
                            className="shrink-0 font-mono text-[10px] tracking-[0.04em] text-faint"
                          >
                            {formatRelativeTime(event.created_at)}
                          </time>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : unavailable ? (
                  <p className="mt-5 text-[13px] leading-[1.65] text-muted">
                    The public events feed is unavailable right now.
                  </p>
                ) : (
                  <p className="mt-5 text-[13px] leading-[1.65] text-muted">
                    No public activity in the last 90 days.
                  </p>
                )}

                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-sweep mt-auto pt-6 font-mono text-[10px] uppercase tracking-[0.1em] text-muted hover:text-ink"
                >
                  See everything on GitHub
                  <ArrowUpRight size={11} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        <p className="mono-label mt-4">
          {profile.casualName} ·{' '}
          {unavailable
            ? 'cached snapshot · live data unavailable'
            : 'live data from GitHub · cached for 10 minutes'}
        </p>
      </div>
    </section>
  );
}
