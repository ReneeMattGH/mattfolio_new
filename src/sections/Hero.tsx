import { motion } from 'framer-motion';
import { ArrowRight, Download, SquareTerminal } from 'lucide-react';
import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { Magnetic } from '../components/Magnetic';
import { StatusStamp } from '../components/StatusStamp';
import { Ticker } from '../components/Ticker';
import { profile } from '../data/profile';
import { gsap } from '../lib/gsap';
import { palette } from '../lib/tones';
import { useIsTouch, usePrefersReducedMotion } from '../lib/useMediaQuery';
import { shortcutLabel } from '../lib/utils';

const HeroScene = lazy(() => import('../three/HeroScene'));

const proofTones = [palette.blue, palette.mint, palette.gold, palette.iris];

const capabilities = [
  'Smart contracts',
  'Payment rails',
  'Real-time AI',
  'On-chain systems',
  'Full-stack products',
];

class SceneBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function formatIstTime(): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());
}

function IstClock() {
  const [time, setTime] = useState(formatIstTime);

  useEffect(() => {
    const interval = window.setInterval(() => setTime(formatIstTime()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <p className="mono-label tabular" aria-label="Current time in India">
      Chennai · {time} IST
    </p>
  );
}

function SceneFallback() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute right-[8%] top-1/2 h-[340px] w-[340px] -translate-y-1/2 sm:h-[440px] sm:w-[440px]">
        <div className="absolute left-[12%] top-[38%] h-[88px] w-[124px] rotate-[-10deg] rounded-lg border border-white/12 bg-white/[0.035]" />
        <div className="absolute left-[38%] top-[26%] h-[112px] w-[140px] rotate-[4deg] rounded-lg border border-white/14 bg-white/[0.045]">
          <span className="absolute -left-px top-4 h-12 w-px bg-accent/70" />
        </div>
        <div className="absolute left-[64%] top-[42%] h-[86px] w-[118px] rotate-[12deg] rounded-lg border border-white/12 bg-white/[0.035]" />
        <div className="absolute left-[30%] top-[58%] h-px w-[44%] rotate-[8deg] bg-white/15" />
      </div>
    </div>
  );
}

interface HeroProps {
  start: boolean;
  onOpenTerminal: () => void;
}

export function Hero({ start, onOpenTerminal }: HeroProps) {
  const root = useRef<HTMLElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const touch = useIsTouch();
  const [sceneReady, setSceneReady] = useState(false);

  const highQuality =
    !touch && (typeof navigator === 'undefined' || (navigator.hardwareConcurrency ?? 8) > 4);

  useEffect(() => {
    if (!start) return;
    const section = root.current;
    if (!section) return;

    const context = gsap.context(() => {
      if (reduced) {
        gsap.set('.hero-line-inner', { yPercent: 0, filter: 'none' });
        gsap.set('[data-hero-fade]', { opacity: 1, y: 0 });
        return;
      }

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .fromTo(
          '.hero-line-inner',
          { yPercent: 118, filter: 'blur(14px)' },
          {
            yPercent: 0,
            filter: 'blur(0px)',
            duration: 1.15,
            stagger: 0.09,
            clearProps: 'filter',
          },
        )
        .fromTo(
          '[data-hero-fade]',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.05 },
          '-=0.7',
        );

      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        })
        .to('[data-hero-content]', { yPercent: -9, opacity: 0.24 }, 0)
        .to('[data-hero-scene]', { yPercent: 14, scale: 1.07, opacity: 0.32 }, 0);
    }, section);

    return () => context.revert();
  }, [start, reduced]);

  useEffect(() => {
    if (touch || reduced) return;
    const section = root.current;
    const light = lightRef.current;
    if (!section || !light) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const paint = () => {
      frame = 0;
      light.style.setProperty('--hero-x', `${pointerX}px`);
      light.style.setProperty('--hero-y', `${pointerY}px`);
      light.style.opacity = '1';
    };

    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      light.style.opacity = '0';
    };

    section.addEventListener('pointermove', onMove);
    section.addEventListener('pointerleave', onLeave);
    return () => {
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [touch, reduced]);

  useEffect(() => {
    if (reduced) return;
    const idleCallback = () => setSceneReady(true);

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(idleCallback, { timeout: 800 });
      return () => window.cancelIdleCallback(id);
    }

    const timeout = window.setTimeout(idleCallback, 320);
    return () => window.clearTimeout(timeout);
  }, [reduced]);

  return (
    <>
      <section
        ref={root}
        id="home"
        className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10 hero-glow" />
        <div
          ref={lightRef}
          aria-hidden="true"
          className="hero-light pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 ease-smooth"
        />

        <div
          aria-hidden="true"
          className="scene-mask pointer-events-none absolute inset-0 z-0 opacity-60 sm:opacity-70 md:left-auto md:w-[64%] md:opacity-100"
        >
          <div data-hero-scene className="absolute inset-0">
            <SceneFallback />
            {sceneReady ? (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              >
                <Suspense fallback={null}>
                  <SceneBoundary fallback={<SceneFallback />}>
                    <HeroScene highQuality={highQuality} />
                  </SceneBoundary>
                </Suspense>
              </motion.div>
            ) : null}
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-bg via-bg/85 to-bg/30 md:via-bg/55 md:to-transparent"
        />

        <div
          data-hero-content
          className="shell relative z-10 flex flex-1 flex-col justify-center pb-14 pt-[calc(var(--nav-h)+44px)] md:pb-16"
        >
          <div
            data-hero-fade
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-line pb-4"
          >
            <div className="flex items-center gap-3">
              <span className="kicker text-accent">[ 00 ]</span>
              <span className="kicker text-muted">Portfolio / 2026</span>
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              <span className="kicker text-faint">Blockchain · Full-stack · AI</span>
              <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-accent/70" />
              <span className="kicker text-faint">Chennai, IN</span>
            </div>
          </div>

          <div className="relative mt-10 max-w-[1140px] md:mt-14">
            <div data-hero-fade className="flex items-center gap-3">
              <span className="status-dot h-1.5 w-1.5 rounded-full bg-mint" />
              <p className="kicker text-muted">{profile.status}</p>
            </div>

            <h1 className="h-display mt-6 md:mt-8">
              <span className="hero-line">
                <span className="hero-line-inner">{profile.firstName}</span>
              </span>
              <span className="hero-line">
                <span className="hero-line-inner">
                  Renee <span className="text-outline">Matthew</span>
                </span>
              </span>
            </h1>

            <div
              data-hero-fade
              className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2.5"
            >
              <span className="kicker text-muted">Known as Matt</span>
              <span aria-hidden="true" className="h-px w-9 bg-line-strong" />
              <span className="kicker text-faint">{profile.location}</span>
              <span aria-hidden="true" className="hidden h-px w-9 bg-line-strong sm:block" />
              <span className="kicker hidden text-faint sm:block">Open source contributor</span>
            </div>

            <div
              data-hero-fade
              className="mt-9 grid max-w-[980px] gap-4 border-l border-accent/40 pl-5 sm:grid-cols-[70px,1fr] sm:gap-6 md:mt-11"
            >
              <span className="kicker text-accent sm:pt-1.5">Focus</span>
              <p className="max-w-[54ch] text-[18px] leading-[1.6] text-ink/85 md:text-[21px]">
                {profile.role}
              </p>
            </div>

            <div data-hero-fade className="mt-9 flex flex-wrap items-center gap-3 md:mt-10">
              <Magnetic strength={19} tilt={11} radius={58}>
                <a href="#projects" className="btn btn-primary !px-6">
                  See selected work
                  <ArrowRight size={15} className="btn-arrow" />
                </a>
              </Magnetic>
              <Magnetic strength={15} tilt={9} radius={52}>
                <a href={profile.resumeUrl} download className="btn btn-outline">
                  Download resume
                  <Download size={14} className="opacity-70" />
                </a>
              </Magnetic>
              <button
                type="button"
                onClick={onOpenTerminal}
                className="group ml-1 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-faint transition-colors hover:text-ink"
              >
                <SquareTerminal
                  size={13}
                  className="transition-colors group-hover:text-accent"
                  aria-hidden="true"
                />
                Terminal
                <span className="rounded-[4px] border border-line px-1.5 py-0.5 text-[9px] text-faint">
                  {shortcutLabel}
                </span>
              </button>
            </div>

            <div className="absolute -right-10 bottom-0 hidden xl:block">
              <StatusStamp />
            </div>
          </div>

          <ul
            data-hero-fade
            className="mt-12 grid max-w-[1140px] grid-cols-2 border-t border-line md:mt-16 lg:grid-cols-4"
          >
            {profile.proof.map((item, index) => (
              <li
                key={item}
                className="flex items-start gap-3 border-b border-line py-4 pr-4 lg:border-b-0 lg:border-l lg:border-line lg:px-5 lg:py-5 lg:first:border-l-0 lg:first:pl-0"
              >
                <span
                  className="kicker tabular"
                  style={{ color: proofTones[index] ?? palette.blue }}
                >
                  0{index + 1}
                </span>
                <span className="font-mono text-[11px] uppercase leading-[1.55] tracking-[0.04em] text-ink sm:text-[12px]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div data-hero-content className="shell relative z-10 flex items-center justify-between gap-6 pb-7">
          <a
            href="#about"
            data-hero-fade
            className="group inline-flex items-center gap-4"
            aria-label="Scroll to about"
          >
            <span className="scroll-hint-line" />
            <span className="kicker text-faint transition-colors group-hover:text-muted">
              Scroll to explore
            </span>
          </a>
          <div data-hero-fade>
            <IstClock />
          </div>
        </div>
      </section>

      <Ticker
        items={capabilities}
        duration={72}
        label="Areas of focus"
        className="relative z-10 bg-bg"
      />
    </>
  );
}
