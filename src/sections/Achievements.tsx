import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { achievements } from '../data/achievements';
import { cn } from '../lib/utils';

export function Achievements() {
  const highlights = achievements.filter((achievement) => achievement.highlight);
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

        <ul className="mb-12 grid gap-4 md:grid-cols-3">
          {highlights.map((achievement, index) => (
            <Reveal key={achievement.event} delay={index * 0.05} className="h-full">
              <li className="data-console relative flex h-full flex-col justify-between overflow-hidden border-[rgba(143,180,255,0.28)] p-6 md:p-7">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[rgba(143,180,255,0.8)] via-[rgba(143,180,255,0.25)] to-transparent"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[rgba(143,180,255,0.09)] blur-3xl"
                />

                <div className="relative flex items-center justify-between gap-3">
                  <span className="kicker text-accent">0{index + 1}</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                    Headline result
                  </span>
                </div>

                <div className="relative mt-10">
                  <p className="text-[clamp(1.9rem,3vw,2.5rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-accent">
                    {achievement.result}
                  </p>
                  <p className="mt-3 text-[13.5px] leading-[1.5] text-ink">
                    {achievement.event}
                  </p>
                </div>

                <div className="relative mt-7 flex items-center gap-3 border-t border-[rgba(143,180,255,0.2)] pt-4">
                  <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
                    {achievement.year ?? 'Result recorded'}
                  </span>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal>
          <table className="w-full border-collapse text-left">
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
              </tr>
            </thead>
            <tbody>
              {ledger.map((achievement) => {
                const position = achievements.indexOf(achievement) + 1;
                const isWin = /winner|best/i.test(achievement.result);
                const chip = isWin
                  ? 'border-accent bg-accent font-medium text-accent-ink'
                  : 'border-[rgba(143,180,255,0.45)] bg-[rgba(143,180,255,0.1)] text-accent';
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
                      >
                        {achievement.result}
                      </span>
                    </td>
                    <td className="hidden py-5 text-right align-top sm:table-cell">
                      <span
                        className={cn(
                          'inline-flex rounded-chip border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.04em]',
                          chip,
                        )}
                      >
                        {achievement.result}
                      </span>
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
    </section>
  );
}
