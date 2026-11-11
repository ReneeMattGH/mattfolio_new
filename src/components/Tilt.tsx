import type { ReactNode } from 'react';
import { useMagnetic } from '../lib/useMagnetic';
import { cn } from '../lib/utils';

interface TiltProps {
  children: ReactNode;
  className?: string;
  max?: number;
}

export function Tilt({ children, className, max = 3.2 }: TiltProps) {
  const ref = useMagnetic<HTMLDivElement>({
    strength: 0,
    tilt: max,
    radius: 34,
    scale: 1.004,
  });

  return (
    <div ref={ref} className={cn('magnetic-surface tilt-surface relative', className)}>
      {children}
      <span aria-hidden="true" className="tilt-glare" />
    </div>
  );
}
