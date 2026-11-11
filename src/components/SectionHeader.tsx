import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/useMediaQuery';
import { cn } from '../lib/utils';
import { AnimatedTitle } from './AnimatedTitle';
import { Reveal } from './Reveal';

interface SectionHeaderProps {
  index: string;
  label: string;
  title: ReactNode;
  description?: string;
  titleClassName?: string;
}

export function SectionHeader({
  index,
  label,
  title,
  description,
  titleClassName,
}: SectionHeaderProps) {
  const lineRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const line = lineRef.current;
    const ghost = ghostRef.current;
    if (!line) return;
    if (reduced) {
      gsap.set(line, { scaleX: 1 });
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: line, start: 'top 90%', once: true },
        },
      );

      if (ghost) {
        gsap.fromTo(
          ghost,
          { yPercent: 14 },
          {
            yPercent: -14,
            ease: 'none',
            scrollTrigger: {
              trigger: ghost,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          },
        );
      }
    }, line);

    return () => context.revert();
  }, [reduced]);

  return (
    <header className="relative mb-16 overflow-x-clip md:mb-24">
      <Reveal>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pb-4">
          <div className="flex items-center gap-3">
            <span className="kicker text-accent">[ {index} ]</span>
            <span aria-hidden="true" className="h-px w-7 bg-accent/50" />
            <span className="kicker text-muted">{label}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="kicker hidden text-faint sm:block">Chennai / Remote</span>
            <span aria-hidden="true" className="hidden h-px w-8 bg-line-strong sm:block" />
            <span className="kicker tabular text-faint">{index} / 07</span>
          </div>
        </div>
        <div ref={lineRef} className="mt-4 h-px w-full origin-left bg-line" />
      </Reveal>

      <div className="relative mt-8 md:mt-11">
        <span
          ref={ghostRef}
          aria-hidden="true"
          className="section-ghost absolute -right-2 -top-14 hidden md:block"
        >
          {index}
        </span>

        <div className="relative z-10 grid gap-8 md:grid-cols-12 md:items-end md:gap-10">
          <AnimatedTitle
            className={cn('h-section md:col-span-8', titleClassName)}
            delay={0.06}
          >
            {title}
          </AnimatedTitle>
          {description ? (
            <Reveal
              delay={0.24}
              className="md:col-span-4 md:justify-self-end md:border-l md:border-line md:pl-6"
            >
              <p className="kicker mb-3 text-faint">Context</p>
              <p className="max-w-[34ch] text-[14px] leading-[1.7] text-muted md:text-right">
                {description}
              </p>
            </Reveal>
          ) : null}
        </div>
      </div>
    </header>
  );
}
