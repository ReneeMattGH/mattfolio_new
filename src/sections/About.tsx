import { ArrowUpRight } from 'lucide-react';
import { CountUp } from '../components/CountUp';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { SpotlightCard } from '../components/SpotlightCard';
import { profile } from '../data/profile';
import { cn } from '../lib/utils';

export function About() {
  return (
    <section id="about" className="section">
      <div className="shell">
        <SectionHeader
          index="01"
          label="About"
          title={
            <>
              A student shipping <span className="text-outline">production</span> systems.
            </>
          }
          description="Chennai Institute of Technology · 2024 — 2028"
        />

        <Reveal>
          <div className="grid grid-cols-2 border-y border-line md:grid-cols-4">
            {profile.stats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  'flex min-h-[150px] flex-col justify-between py-6 pr-4 md:min-h-[184px] md:py-8',
                  index % 2 === 1 && 'border-l border-line pl-5 md:pl-7',
                  index >= 2 && 'border-t border-line md:border-t-0',
                  index > 0 && 'md:border-l md:pl-7',
                  index === 2 && 'md:pl-7',
                )}
              >
                <span className="kicker tabular text-faint">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="mt-8">
                  <p className="text-[clamp(2.6rem,5.2vw,4.1rem)] font-semibold leading-[0.88] tracking-[-0.055em] text-ink">
                    <CountUp
                      value={stat.value}
                      decimals={stat.decimals}
                      suffix={stat.suffix}
                    />
                  </p>
                  <p className="kicker mt-5 max-w-[22ch] leading-[1.7] text-faint">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-4 grid gap-4 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <SpotlightCard className="flex h-full flex-col justify-between p-6 md:p-9">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="kicker text-accent">Profile</span>
                  <span className="kicker text-faint">01 / 01</span>
                </div>
                <p className="drop-cap mt-7 max-w-[54ch] text-[17px] leading-[1.75] text-ink/90 md:text-[19px]">
                  {profile.bio}
                </p>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5">
                <span className="kicker text-faint">{profile.location}</span>
                <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-accent/60" />
                <span className="kicker text-faint">Open source contributor</span>
              </div>
            </SpotlightCard>
          </Reveal>

          <div className="flex flex-col gap-4 md:col-span-5">
            <Reveal>
              <SpotlightCard className="p-6 md:p-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="kicker text-accent">Education</span>
                  <span className="kicker text-faint">02</span>
                </div>
                <ul className="mt-4">
                  {profile.education.map((entry) => (
                    <li
                      key={entry.programme}
                      className="row-hover border-t border-line py-4 pl-4 first:border-t-0 first:pt-2 last:pb-0"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-[16px] font-medium leading-snug text-ink md:text-[17px]">
                            {entry.programme}
                          </h3>
                          <p className="mt-1.5 text-[13px] leading-[1.6] text-muted">
                            {entry.institution}
                          </p>
                        </div>
                        <span className="kicker shrink-0 text-faint">{entry.period}</span>
                      </div>
                      <p className="mt-2 font-mono text-[12px] tabular text-accent/80">
                        {entry.result}
                      </p>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </Reveal>

            <Reveal delay={0.06} className="flex-1">
              <SpotlightCard className="flex h-full flex-col p-6 md:p-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="kicker text-accent">Currently</span>
                  <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                    <span className="status-dot h-1.5 w-1.5 rounded-full bg-accent" />
                    {profile.currently.status}
                  </span>
                </div>

                <h3 className="mt-8 text-[clamp(2.6rem,4.2vw,3.5rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-ink">
                  {profile.currently.title}
                  <span className="text-accent">.</span>
                </h3>
                <p className="mt-4 max-w-[34ch] text-[15px] leading-[1.65] text-muted">
                  {profile.currently.description}
                </p>

                <a
                  href={profile.currently.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-sweep kicker mt-auto w-fit pt-10 text-muted hover:text-ink"
                >
                  View repository
                  <ArrowUpRight size={13} />
                </a>
              </SpotlightCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
