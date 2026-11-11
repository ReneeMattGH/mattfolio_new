import { useRef, type CSSProperties } from 'react';
import { useScrollVelocityRate } from '../lib/useScrollVelocity';
import { cn } from '../lib/utils';

interface MarqueeProps {
  items: string[];
  duration?: number;
  className?: string;
  label?: string;
}

export function Marquee({ items, duration = 46, className, label }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  useScrollVelocityRate(trackRef);

  const style = { '--marquee-duration': `${duration}s` } as CSSProperties;

  return (
    <div className={cn('marquee relative overflow-hidden', className)} aria-label={label}>
      <div ref={trackRef} className="marquee-track" style={style}>
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className="flex shrink-0 items-center"
          >
            {items.map((item) => (
              <span key={`${copy}-${item}`} className="flex items-center">
                <span className="whitespace-nowrap font-mono text-[12px] uppercase tracking-[0.08em] text-faint">
                  {item}
                </span>
                <span className="mx-7 h-[3px] w-[3px] shrink-0 rounded-full bg-white/15" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
