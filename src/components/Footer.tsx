import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import { profile } from '../data/profile';
import { usePrefersReducedMotion } from '../lib/useMediaQuery';
import { AnimatedTitle } from './AnimatedTitle';

const columns = [
  {
    title: 'Navigate',
    items: [
      { label: 'About', href: '#about' },
      { label: 'Experience', href: '#experience' },
      { label: 'Projects', href: '#projects' },
    ],
  },
  {
    title: 'Connect',
    items: [
      { label: 'GitHub', href: profile.socials[0].href },
      { label: 'LinkedIn', href: profile.socials[1].href },
      { label: 'X', href: profile.socials[2].href },
    ],
  },
  {
    title: 'More',
    items: [
      { label: 'Achievements', href: '#achievements' },
      { label: 'Skills', href: '#skills' },
      { label: 'Contact', href: '#contact' },
    ],
  },
];

export function Footer() {
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: wordmarkRef,
    offset: ['start end', 'end 85%'],
  });
  const wordmarkY = useTransform(scrollYProgress, [0, 1], ['6%', '-4%']);
  const wordmarkScale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);

  return (
    <footer className="relative z-10 border-t border-line">
      <div className="shell pt-10 md:pt-12">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <span className="kicker text-accent">[ 08 ]</span>
            <span className="kicker text-muted">Footer</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="kicker text-faint">{profile.location}</span>
            <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-accent/70" />
            <span className="kicker text-faint">© 2026</span>
          </div>
        </div>

        <div className="grid gap-12 pt-12 md:grid-cols-12 md:gap-10 md:pt-14">
          <div className="md:col-span-5">
            <a
              href="#home"
              className="inline-flex items-baseline text-[clamp(1.9rem,3.4vw,2.7rem)] font-semibold leading-none tracking-[-0.045em] text-ink"
            >
              Matt
              <span className="text-accent">.</span>
            </a>
            <p className="mt-4 max-w-[34ch] text-[14px] leading-[1.65] text-muted">
              {profile.role}
            </p>
            <p className="mt-5 flex items-start gap-2 font-mono text-[10px] uppercase leading-[1.6] tracking-[0.12em] text-faint">
              <span
                aria-hidden="true"
                className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-mint status-dot"
              />
              {profile.status}
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="link-sweep mt-6 inline-flex max-w-full items-center gap-2 font-mono text-[11px] tracking-[0.02em] text-muted hover:text-ink"
            >
              <span className="truncate">{profile.email}</span>
              <ArrowUpRight size={12} aria-hidden="true" className="shrink-0" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 md:col-span-7 md:gap-x-10">
            {columns.map((column, columnIndex) => (
              <div key={column.title}>
                <div className="flex items-baseline gap-2 border-b border-line pb-3">
                  <span className="font-mono text-[9px] tabular text-faint">
                    {String(columnIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="kicker text-muted">{column.title}</span>
                </div>
                <ul className="mt-4 space-y-3">
                  {column.items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="group inline-flex items-center gap-1.5 text-[14px] text-muted transition-colors hover:text-ink"
                        {...(item.href.startsWith('http')
                          ? { target: '_blank', rel: 'noreferrer noopener' }
                          : {})}
                      >
                        <span className="h-px w-0 bg-accent transition-[width] duration-300 group-hover:w-3" />
                        {item.label}
                        <ArrowUpRight
                          size={11}
                          aria-hidden="true"
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line py-6 md:flex-row md:items-center md:justify-between">
          <p className="mono-label">© 2026 {profile.name}</p>
          <p className="mono-label">Built with Vite, React &amp; Three.js</p>
          <a
            href="#home"
            className="mono-label inline-flex items-center gap-2 transition-colors hover:text-ink"
          >
            Back to top
            <ArrowUp size={12} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div
        ref={wordmarkRef}
        aria-hidden="true"
        className="overflow-hidden px-4 pb-6 pt-8 md:pb-8"
      >
        <motion.div
          className="origin-bottom"
          style={reduced ? undefined : { y: wordmarkY, scale: wordmarkScale }}
        >
          <AnimatedTitle
            as="p"
            delay={0.1}
            className="whitespace-nowrap text-center text-[clamp(2.2rem,9.2vw,8.8rem)] font-semibold leading-[0.92] tracking-[-0.045em]"
          >
            <span className="outline-wordmark">George Kingsley</span>
            <br />
            <span className="text-ink">Renee Matthew</span>
          </AnimatedTitle>
        </motion.div>
      </div>
    </footer>
  );
}
