import { useEffect, type RefObject } from 'react';

/**
 * Nudges a CSS marquee's playback rate with scroll velocity so long tracks
 * accelerate and settle instead of running at a constant speed.
 */
export function useScrollVelocityRate<T extends HTMLElement>(
  ref: RefObject<T>,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return;
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let animations: Animation[] | null = null;
    let rate = 1;
    let lastY = window.scrollY;
    let frame = 0;
    let visible = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: '120px 0px' },
    );
    observer.observe(element);

    const tick = () => {
      const y = window.scrollY;
      const velocity = Math.abs(y - lastY);
      lastY = y;

      if (visible) {
        if (!animations || animations.length === 0) {
          animations = element.getAnimations();
        }
        const target = 1 + Math.min(1.1, velocity * 0.014);
        rate += (target - rate) * 0.07;
        for (const animation of animations) {
          animation.playbackRate = rate;
        }
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      animations?.forEach((animation) => {
        animation.playbackRate = 1;
      });
    };
  }, [enabled, ref]);
}
