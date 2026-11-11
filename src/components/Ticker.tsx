import { useRef, type CSSProperties } from 'react';
import { useScrollVelocityRate } from '../lib/useScrollVelocity';
import { cn } from '../lib/utils';

interface TickerProps {
  items: string[];
  duration?: number;
  label?: string;
  className?: string;
}

export function Ticker({ items, duration = 70, label, className }: TickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  useScrollVelocityRate(trackRef);

  const style = { '--marquee-duration': `${duration}s` } as CSSProperties;

  return (
    <div
      className={cn('marquee relative overflow-hidden border-y border-line py-4 md:py-5', className)}
      aria-label={label}
    >
      <div ref={trackRef} className="marquee-track" style={style}>
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className="flex shrink-0 items-center"
          >
            {items.map((item) => (
              <span key={`${copy}-${item}`} className="flex items-center">
                <span className="whitespace-nowrap text-[clamp(1.35rem,3.2vw,2.4rem)] font-medium uppercase leading-none tracking-[-0.035em] text-outline">
                  {item}
                </span>
                <span
                  aria-hidden="true"
                  className="mx-6 h-1.5 w-1.5 shrink-0 rotate-45 border border-accent/60 md:mx-9"
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
