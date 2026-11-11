import { useLayoutEffect, useRef } from 'react';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { roles } from '../data/experience';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/useMediaQuery';

export function Experience() {
  const listRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const list = listRef.current;
    const fill = fillRef.current;
    if (!list || !fill) return;

    if (reduced) {
      gsap.set(fill, { scaleY: 1 });
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: list,
            start: 'top 72%',
            end: 'bottom 68%',
            scrub: 0.5,
          },
        },
      );
    }, list);

    return () => context.revert();
  }, [reduced]);

  return (
    <section id="experience" className="section">
      <div className="shell">
        <SectionHeader
          index="02"
          label="Experience"
          title={
            <>
              Building <span className="text-outline">payment rails</span> and{' '}
              <span className="whitespace-nowrap">on-chain</span> products.
            </>
          }
          description="Backend, blockchain and operational work across three roles."
        />

        <div ref={listRef} className="relative pl-7 md:pl-12">
          <div aria-hidden="true" className="absolute bottom-3 left-0 top-3 w-px bg-line" />
          <div
            ref={fillRef}
            aria-hidden="true"
            className="absolute bottom-3 left-0 top-3 w-px origin-top bg-accent/70"
            style={{ transform: 'scaleY(0)' }}
          />

          {roles.map((role, index) => (
            <Reveal key={role.company} delay={index * 0.05}>
              <article className="group relative border-b border-line py-10 transition-colors duration-300 first:border-t first:border-line md:py-14">
                <span
                  aria-hidden="true"
                  className="absolute -left-7 top-12 h-[7px] w-[7px] -translate-x-1/2 rotate-45 border border-accent/70 bg-bg transition-colors duration-300 group-hover:bg-accent md:-left-12 md:top-16"
                />

                <div className="grid gap-7 md:grid-cols-12 md:gap-10">
                  <div className="md:col-span-3">
                    <div className="flex items-baseline gap-3">
                      <span className="kicker text-accent">0{index + 1}</span>
                      <span className="kicker tabular text-muted">
                        {role.start} — {role.end}
                      </span>
                    </div>
                    <p className="mt-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-faint">
                      {role.location}
                      {role.current ? (
                        <span
                          aria-hidden="true"
                          className="status-dot inline-block h-1.5 w-1.5 rounded-full bg-accent"
                        />
                      ) : null}
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-faint/60">
                      {role.current ? 'Current role' : 'Completed'}
                    </p>
                  </div>

                  <div className="md:col-span-9">
                    <div className="md:flex md:items-start md:justify-between md:gap-10">
                      <div>
                        <h3 className="text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-ink">
                          {role.company}
                        </h3>
                        <p className="kicker mt-3 text-accent">{role.title}</p>
                      </div>

                      <ul className="mt-5 flex max-w-full flex-wrap gap-x-4 gap-y-1.5 md:mt-1.5 md:max-w-[250px] md:justify-end">
                        {role.tags.map((tag) => (
                          <li
                            key={tag}
                            className="font-mono text-[10px] uppercase tracking-[0.1em] text-faint"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <ul className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                      {role.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex gap-3 text-[14.5px] leading-[1.65] text-muted"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[0.72em] h-px w-4 shrink-0 bg-accent/50"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
