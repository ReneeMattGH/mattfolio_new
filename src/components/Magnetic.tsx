import type { ReactNode } from 'react';
import { useMagnetic } from '../lib/useMagnetic';
import { cn } from '../lib/utils';

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  tilt?: number;
  radius?: number;
  scale?: number;
}

export function Magnetic({
  children,
  className,
  strength = 15,
  tilt = 8,
  radius = 48,
  scale = 1.025,
}: MagneticProps) {
  const ref = useMagnetic<HTMLSpanElement>({ strength, tilt, radius, scale });

  return (
    <span ref={ref} className={cn('magnetic-surface inline-flex', className)}>
      {children}
    </span>
  );
}
