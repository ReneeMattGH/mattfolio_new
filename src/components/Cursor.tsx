import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '../lib/useMediaQuery';
import { cn } from '../lib/utils';

const INTERACTIVE = 'a, button, [data-cursor], input, textarea, select, [role="button"]';

export function Cursor() {
  const finePointer = useMediaQuery('(pointer: fine)');
  const [hovered, setHovered] = useState(false);
  const [label, setLabel] = useState('');
  const [visible, setVisible] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!finePointer) return;
    document.documentElement.classList.add('custom-cursor');

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let frame = 0;

    const onMove = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      setVisible(true);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }
    };

    const loop = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      frame = requestAnimationFrame(loop);
    };

    const onOver = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(INTERACTIVE);
      if (!target) return;
      setHovered(true);
      setLabel(target.getAttribute('data-cursor-label') ?? '');
    };

    const onOut = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(INTERACTIVE);
      if (!target) return;
      const related = event.relatedTarget as HTMLElement | null;
      if (related && target.contains(related)) return;
      setHovered(false);
      setLabel('');
    };

    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.documentElement.addEventListener('mouseleave', onLeave);
    frame = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove('custom-cursor');
    };
  }, [finePointer]);

  if (!finePointer) return null;

  return (
    <div aria-hidden="true">
      <div
        ref={dotRef}
        className={cn(
          'pointer-events-none fixed left-0 top-0 z-[95] mix-blend-difference transition-opacity duration-200',
          visible ? 'opacity-100' : 'opacity-0',
        )}
      >
        <span className="block h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      </div>

      <div
        ref={ringRef}
        className={cn(
          'pointer-events-none fixed left-0 top-0 z-[95] mix-blend-difference transition-opacity duration-200',
          visible ? 'opacity-100' : 'opacity-0',
        )}
      >
        <div
          className={cn(
            'relative flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/45 transition-[width,height,background-color] duration-300 ease-smooth',
            hovered ? 'h-12 w-12 bg-white/[0.06]' : 'h-8 w-8',
          )}
        >
          {label ? (
            <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] text-white">
              {label}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
