import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/profile';
import { usePrefersReducedMotion } from '../lib/useMediaQuery';
import { cn } from '../lib/utils';

interface LoaderProps {
  onDone: () => void;
}

export function Loader({ onDone }: LoaderProps) {
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [hidden, setHidden] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    document.documentElement.classList.add('is-loading');
    const total = reduced ? 200 : 920;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const next = Math.min(1, (now - start) / total);
      setProgress(next);
      if (next < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setLeaving(true), 90);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  useEffect(() => {
    if (!leaving) return;
    document.documentElement.classList.remove('is-loading');
    doneRef.current();
    const timeout = window.setTimeout(() => setHidden(true), reduced ? 240 : 840);
    return () => window.clearTimeout(timeout);
  }, [leaving, reduced]);

  if (hidden) return null;

  const percent = String(Math.round(progress * 100)).padStart(3, '0');

  return (
    <div
      aria-hidden="true"
      data-leaving={leaving ? 'true' : 'false'}
      className={cn(
        'loader-curtain fixed inset-0 z-[100] overflow-hidden bg-bg px-5 pb-6 pt-6 md:px-8 md:pb-8 md:pt-7',
        leaving && 'pointer-events-none',
      )}
    >
      <div data-loader-inner className="flex h-full w-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <span className="kicker text-accent">[ 00 ]</span>
            <span className="kicker text-muted">Portfolio / 2026</span>
          </div>
          <span className="kicker text-faint">Chennai · Remote</span>
        </div>

        <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-center">
          <span className="kicker text-accent">[ Loading ]</span>
          <p className="mt-5 text-[clamp(2.5rem,7.4vw,5.4rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-ink">
            {profile.name}
            <span className="text-accent">.</span>
          </p>
          <div className="mt-8 h-px w-full max-w-[380px] bg-white/10">
            <div
              className="h-px origin-left bg-accent"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[1200px] items-end justify-between gap-6">
          <span className="mono-label max-w-[20ch] leading-[1.7]">
            Selected work, systems and signal.
          </span>
          <span className="font-mono text-[clamp(2.2rem,6vw,3.6rem)] leading-none tracking-[-0.05em] tabular text-ink">
            {percent}
          </span>
        </div>
      </div>
    </div>
  );
}
