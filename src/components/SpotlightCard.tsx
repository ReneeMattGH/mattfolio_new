import type { MouseEvent, ReactNode } from 'react';
import { cn } from '../lib/utils';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    element.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    element.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  return (
    <div onMouseMove={onMouseMove} className={cn('card spotlight-card', className)}>
      {children}
    </div>
  );
}
