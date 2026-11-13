import { ArrowUpRight, Award, Medal, Trophy } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import { AchievementModal } from '../components/AchievementModal';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { Ticker } from '../components/Ticker';
import { achievements } from '../data/achievements';
import { palette } from '../lib/tones';
import { cn } from '../lib/utils';
import type { Achievement } from '../types/content';

function iconFor(result: string) {
  if (/winner|best/i.test(result)) return Trophy;
  if (/runner/i.test(result)) return Medal;
  return Award;
}

function toneFor(result: string) {
  if (/winner|best/i.test(result)) return palette.gold;
  if (/runner/i.test(result)) return palette.blue;
  return palette.mint;
}

export function Achievements() {
  const [selected, setSelected] = useState<Achievement | null>(null);
  const highlights = achievements.filter((achievement) => achievement.highlight);
  const featured = highlights[0];
  const cards = highlights.slice(1);
  const ledger = achievements.filter((achievement) => !achievement.highlight);

  return (
    <section id="achievements" className="section">
      <div className="shell">
        <SectionHeader
          index="04"
          label="Achievements"
          title={
            <>
              Proof, not <span className="text-outline">trophies<span className="title-punct">.</span></span>
            </>
          }
          description="Global and national hackathon results."
        />

        <Reveal>
          <Ticker
            items={highlights.map((achievement) => `${achievement.event} — ${achievement.result}`)}
            duration={68}
            label="Headline hackathon results"
            className="mb-10"
          />
        </Reveal>

        {featured ? (
          <Reveal>
            <button
              type="button"
              onClick={() => setSelected(featured)}
              aria-label={`View the ${featured.event} achievement`}
              style={{ '--tone': palette.gold } as CSSProperties}
              className="result-card group relative block w-full overflow-hidden rounded-card border bg-surface text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-[rgba(242,199,143,0.95)] via-[rgba(242,199,143,0.35)] to-transparent"
              />

              <div className="grid md:grid-cols-12">
                <div className="relative flex flex-col justify-between p-6 md:col-span-7 md:p-10">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-[rgba(242,199,143,0.08)] blur-3xl"
                  />
                  <div className="relative flex items-center gap-3">
                    <span className="kicker" style={{ color: palette.gold }}>
                      Latest win
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-px w-8 bg-[rgba(242,199,143,0.5)]"
                    />
                    <span className="kicker text-muted">ETHGlobal Mumbai</span>
                  </div>

                  <div className="relative mt-9">
                    <p
                      className="text-[clamp(2.8rem,6vw,4.9rem)] font-semibold leading-[0.9] tracking-[-0.055em]"
                      style={{ color: palette.gold }}
                    >
                      {featured.result}
                    </p>
                    <p className="mt-4 text-[clamp(1.05rem,1.6vw,1.35rem)] font-medium tracking-[-0.02em] text-ink">
                      {featured.event}
                    </p>
                    <p className="mt-3 max-w-[46ch] text-[14.5px] leading-[1.65] text-muted">
                      {featured.context}
                    </p>
                  </div>

                  <div className="relative mt-9 flex flex-wrap items-center gap-5">
                    <span className="inline-flex items-center gap-2 rounded-chip border border-[rgba(242,199,143,0.45)] bg-[rgba(242,199,143,0.1)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-gold">
                      <Trophy size={12} aria-hidden="true" />
                      Winner
                    </span>
                    <span className="mono-label inline-flex items-center gap-1.5 text-muted transition-colors group-hover:text-ink">
                      View achievement
                      <ArrowUpRight
                        size={12}
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </div>

                <div className="relative min-h-[280px] overflow-hidden border-t border-[rgba(242,199,143,0.18)] bg-bg md:col-span-5 md:min-h-[360px] md:border-l md:border-t-0">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(360px_circle_at_50%_46%,rgba(242,199,143,0.16),transparent_72%)]"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex items-center justify-center text-[clamp(8rem,15vw,12rem)] font-semibold leading-none tracking-[-0.07em] text-transparent opacity-70"
                    style={{ WebkitTextStroke: '1px rgba(242,199,143,0.3)' }}
                  >
                    01
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(242,199,143,0.16)]"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[rgba(242,199,143,0.4)] motion-safe:animate-[spin_28s_linear_infinite]"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(242,199,143,0.4)] bg-[rgba(242,199,143,0.1)] text-gold shadow-[0_0_60px_-10px_rgba(242,199,143,0.5)] transition-transform duration-500 ease-smooth group-hover:scale-105"
                  >
                    <Trophy size={34} strokeWidth={1.2} />
                  </span>
                  <span className="absolute left-5 top-5 mono-label">ETHGlobal</span>
                  <span className="absolute bottom-5 left-5 mono-label text-gold">
                    Mumbai · Arkiv
                  </span>
                </div>
              </div>
            </button>
          </Reveal>
        ) : null}

        <ul className="mt-4 grid gap-4 md:grid-cols-3">
          {cards.map((achievement, index) => {
            const Icon = iconFor(achievement.result);
            const tone = toneFor(achievement.result);
            return (
              <Reveal key={achievement.event} delay={index * 0.05} className="h-full">
                <li className="h-full">
                  <button
                    type="button"
                    onClick={() => setSelected(achievement)}
                    aria-label={`View the ${achievement.event} achievement`}
                    style={{ '--tone': tone } as CSSProperties}
                    className="result-card data-console group relative flex h-full w-full flex-col justify-between overflow-hidden border p-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:p-7"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-px"
                      style={{
                        background: `linear-gradient(90deg, ${tone}, transparent 65%)`,
                      }}
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full blur-3xl"
                      style={{ backgroundColor: `${tone}17` }}
                    />

                    <div className="relative flex items-center justify-between gap-3">
                      <span className="kicker" style={{ color: tone }}>
                        0{index + 2}
                      </span>
                      <span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                        <Icon size={12} aria-hidden="true" style={{ color: tone }} />
                        Headline result
                      </span>
                    </div>

                    <div className="relative mt-10">
                      <p
                        className="text-[clamp(1.9rem,3vw,2.5rem)] font-semibold leading-[0.98] tracking-[-0.045em]"
                        style={{ color: tone }}
                      >
                        {achievement.result}
                      </p>
                      <p className="mt-3 text-[13.5px] leading-[1.5] text-ink">
                        {achievement.event}
                      </p>
                    </div>

                    <div
                      className="relative mt-7 flex items-center justify-between gap-3 border-t pt-4"
                      style={{ borderColor: `${tone}33` }}
                    >
                      <span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
                        <span
                          aria-hidden="true"
                          className="h-1 w-1 rounded-full"
                          style={{ backgroundColor: tone }}
                        />
                        {achievement.year ?? 'Result recorded'}
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.1em] text-faint transition-colors group-hover:text-ink">
                        Preview
                        <ArrowUpRight
                          size={11}
                          aria-hidden="true"
                          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </button>
                </li>
              </Reveal>
            );
          })}
        </ul>

        <Reveal>
          <table className="mt-12 w-full border-collapse text-left">
            <caption className="sr-only">
              Additional hackathon achievements, with index, year, event and result
            </caption>
            <thead>
              <tr className="border-b border-line">
                <th
                  scope="col"
                  className="w-12 pb-3 font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-faint"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="hidden w-[84px] pb-3 font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-faint sm:table-cell"
                >
                  Year
                </th>
                <th
                  scope="col"
                  className="pb-3 font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-faint"
                >
                  Event
                </th>
                <th
                  scope="col"
                  className="hidden pb-3 text-right font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-faint sm:table-cell"
                >
                  Result
                </th>
                <th className="hidden w-12 pb-3 sm:table-cell">
                  <span className="sr-only">Preview</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((achievement) => {
                const position = achievements.indexOf(achievement) + 1;
                const isWin = /winner|best/i.test(achievement.result);
                const tone = toneFor(achievement.result);
                const chip = isWin ? 'tone-fill font-medium' : 'tone-soft';
                return (
                  <tr
                    key={achievement.event}
                    className="group border-b border-line transition-colors duration-300 hover:bg-[rgba(143,180,255,0.04)] focus-within:bg-[rgba(143,180,255,0.04)]"
                  >
                    <td className="py-5 align-top font-mono text-[10px] tabular text-faint">
                      {String(position).padStart(2, '0')}
                    </td>
                    <td className="hidden py-5 align-top font-mono text-[11px] tabular text-faint sm:table-cell">
                      {achievement.year ?? '—'}
                    </td>
                    <td className="py-5 pr-4 align-top">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[15px] font-medium leading-snug text-ink sm:text-[17px]">
                            {achievement.event}
                          </p>
                          <p className="mt-1 hidden max-w-[62ch] text-[12px] leading-[1.6] text-faint opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 sm:block">
                            {achievement.context}
                          </p>
                          <span
                            className={cn(
                              'mt-2 inline-flex rounded-chip border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.04em] sm:hidden',
                              chip,
                            )}
                            style={{ '--tone': tone } as CSSProperties}
                          >
                            {achievement.result}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelected(achievement)}
                          aria-label={`View the ${achievement.event} achievement`}
                          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-faint transition-colors duration-300 hover:text-ink sm:hidden"
                          style={{ borderColor: `${tone}4d` }}
                        >
                          <ArrowUpRight size={13} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                    <td className="hidden py-5 text-right align-top sm:table-cell">
                      <span
                        className={cn(
                          'inline-flex rounded-chip border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.04em]',
                          chip,
                        )}
                        style={{ '--tone': tone } as CSSProperties}
                      >
                        {achievement.result}
                      </span>
                    </td>
                    <td className="hidden py-5 pl-2 text-right align-top sm:table-cell">
                      <button
                        type="button"
                        onClick={() => setSelected(achievement)}
                        aria-label={`View the ${achievement.event} achievement`}
                        className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-line text-faint transition-colors duration-300 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        style={{ borderColor: `${tone}4d` }}
                      >
                        <ArrowUpRight size={13} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="mono-label">
              Years are shown only where confirmed · {achievements.length} results
            </p>
            <p className="mono-label tabular text-faint">
              {String(highlights.length).padStart(2, '0')} headline /{' '}
              {String(ledger.length).padStart(2, '0')} additional
            </p>
          </div>
        </Reveal>
      </div>

      <AchievementModal achievement={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
