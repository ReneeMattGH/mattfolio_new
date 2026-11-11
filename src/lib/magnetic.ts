import { getPointer, subscribePointer } from './pointer';

export interface MagneticOptions {
  strength?: number;
  tilt?: number;
  scale?: number;
  radius?: number;
}

interface Current {
  x: number;
  y: number;
  rx: number;
  ry: number;
  scale: number;
}

interface Entry {
  element: HTMLElement;
  options: () => MagneticOptions;
  current: Current;
  applied: boolean;
}

const entries = new Set<Entry>();
let frame = 0;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function allowed() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function rest(entry: Entry) {
  if (!entry.applied) return;
  entry.element.style.transform = '';
  entry.element.removeAttribute('data-magnetic-active');
  entry.applied = false;
}

function tick() {
  frame = 0;
  if (!entries.size || !allowed()) return;

  const pointer = getPointer();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  let moving = false;

  entries.forEach((entry) => {
    const rect = entry.element.getBoundingClientRect();
    const options = entry.options();
    const strength = options.strength ?? 12;
    const tilt = options.tilt ?? 7;
    const scale = options.scale ?? 1.02;
    const radius = options.radius ?? 42;
    const current = entry.current;

    let targetX = 0;
    let targetY = 0;
    let targetRX = 0;
    let targetRY = 0;
    let targetScale = 1;

    const inView =
      rect.bottom > -160 &&
      rect.top < viewportHeight + 160 &&
      rect.right > -160 &&
      rect.left < viewportWidth + 160;

    if (inView) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const nx = (pointer.x - centerX) / (rect.width / 2 + radius);
      const ny = (pointer.y - centerY) / (rect.height / 2 + radius);
      const distance = Math.hypot(nx, ny);

      if (distance < 1) {
        const falloff = 1 - distance;
        const weight = falloff * falloff * (3 - 2 * falloff);
        targetX = clamp((pointer.x - centerX) * 0.26, -strength, strength) * weight;
        targetY = clamp((pointer.y - centerY) * 0.26, -strength, strength) * weight;
        targetRX = -ny * tilt * weight;
        targetRY = nx * tilt * weight;
        targetScale = 1 + (scale - 1) * weight;

        entry.element.style.setProperty(
          '--mag-x',
          `${((pointer.x - rect.left) / Math.max(1, rect.width)) * 100}%`,
        );
        entry.element.style.setProperty(
          '--mag-y',
          `${((pointer.y - rect.top) / Math.max(1, rect.height)) * 100}%`,
        );
        entry.element.style.setProperty('--mag-icon-x', `${(nx * 2.4).toFixed(2)}px`);
        entry.element.style.setProperty('--mag-icon-y', `${(ny * 1.8).toFixed(2)}px`);
      }
    }

    const ease = 0.18;
    current.x += (targetX - current.x) * ease;
    current.y += (targetY - current.y) * ease;
    current.rx += (targetRX - current.rx) * ease;
    current.ry += (targetRY - current.ry) * ease;
    current.scale += (targetScale - current.scale) * ease;

    const settled =
      Math.abs(targetX - current.x) < 0.04 &&
      Math.abs(targetY - current.y) < 0.04 &&
      Math.abs(targetRX - current.rx) < 0.02 &&
      Math.abs(targetRY - current.ry) < 0.02 &&
      Math.abs(targetScale - current.scale) < 0.0005;

    const atRest =
      Math.abs(targetX) < 0.04 &&
      Math.abs(targetY) < 0.04 &&
      Math.abs(targetRX) < 0.02 &&
      Math.abs(targetRY) < 0.02 &&
      Math.abs(current.x) < 0.04 &&
      Math.abs(current.y) < 0.04 &&
      Math.abs(current.rx) < 0.02 &&
      Math.abs(current.ry) < 0.02 &&
      Math.abs(current.scale - 1) < 0.0005;

    if (atRest) {
      rest(entry);
      return;
    }

    if (!settled) moving = true;

    if (!entry.applied) {
      entry.element.setAttribute('data-magnetic-active', 'true');
      entry.applied = true;
    }

    entry.element.style.transform = `perspective(820px) translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0) rotateX(${current.rx.toFixed(2)}deg) rotateY(${current.ry.toFixed(2)}deg) scale(${current.scale.toFixed(4)})`;
  });

  if (moving) schedule();
}

function schedule() {
  if (frame) return;
  frame = requestAnimationFrame(tick);
}

if (typeof window !== 'undefined') {
  subscribePointer(() => {
    if (entries.size) schedule();
  });
  window.addEventListener('scroll', () => {
    if (entries.size) schedule();
  }, { passive: true });
  window.addEventListener('resize', () => {
    if (entries.size) schedule();
  });
}

export function registerMagnetic(
  element: HTMLElement,
  options: () => MagneticOptions,
) {
  if (!allowed()) return () => {};

  const entry: Entry = {
    element,
    options,
    current: { x: 0, y: 0, rx: 0, ry: 0, scale: 1 },
    applied: false,
  };

  entries.add(entry);
  schedule();

  return () => {
    entries.delete(entry);
    rest(entry);
    if (!entries.size && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}
