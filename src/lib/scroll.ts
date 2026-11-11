import type Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

const NAV_OFFSET = 96;

export function setLenis(instance: Lenis | null): void {
  lenisInstance = instance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function stopScroll(): void {
  lenisInstance?.stop();
  document.documentElement.classList.add('lenis-stopped');
}

export function startScroll(): void {
  lenisInstance?.start();
  document.documentElement.classList.remove('lenis-stopped');
}

export function scrollToTarget(target: string | HTMLElement): void {
  const element =
    typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!element) return;

  if (lenisInstance) {
    // Lenis already applies html { scroll-padding-top }, so an extra offset double-counts it.
    lenisInstance.scrollTo(element, {
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });
    return;
  }

  const top = element.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
}

export function handleAnchorClick(event: MouseEvent): void {
  const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
  if (!anchor) return;
  const hash = anchor.getAttribute('href');
  if (!hash || hash === '#') return;
  const element = document.querySelector<HTMLElement>(hash);
  if (!element) return;

  event.preventDefault();
  scrollToTarget(element);
  if (window.history.pushState) {
    window.history.pushState(null, '', hash);
  }
}
