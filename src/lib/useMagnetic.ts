import { useEffect, useRef } from 'react';
import { registerMagnetic, type MagneticOptions } from './magnetic';

export function useMagnetic<T extends HTMLElement>(options?: MagneticOptions) {
  const ref = useRef<T>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return registerMagnetic(element, () => optionsRef.current ?? {});
  }, []);

  return ref;
}
