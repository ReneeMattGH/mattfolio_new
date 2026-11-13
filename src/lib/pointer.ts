export interface PointerState {
  x: number;
  y: number;
  nx: number;
  ny: number;
}

const state: PointerState = {
  x: typeof window === 'undefined' ? 0 : window.innerWidth / 2,
  y: typeof window === 'undefined' ? 0 : window.innerHeight / 2,
  nx: 0,
  ny: 0,
};

function onPointerMove(event: PointerEvent) {
  state.x = event.clientX;
  state.y = event.clientY;
  state.nx = (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
  state.ny = -((event.clientY / Math.max(1, window.innerHeight)) * 2 - 1);
}

function onPointerLeave() {
  state.x = -9999;
  state.y = -9999;
  state.nx = 0;
  state.ny = 0;
}

if (typeof window !== 'undefined') {
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onPointerLeave);
  window.addEventListener('blur', onPointerLeave);
}

export function getPointer(): Readonly<PointerState> {
  return state;
}
