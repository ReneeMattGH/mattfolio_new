import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../lib/useMediaQuery';

interface CountUpProps {
  value: number;
  decimals?: number;
  suffix?: string;
}

export function CountUp({ value, decimals = 0, suffix = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const duration = 1400;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, value]);

  return (
    <span ref={ref} className="tabular">
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
