import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { usePrefersReducedMotion } from '../lib/useMediaQuery';

const EASE = [0.16, 1, 0.3, 1] as const;

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  blur?: boolean;
  once?: boolean;
}

export function Reveal({
  children,
  delay = 0,
  className,
  y = 24,
  blur = false,
  once = true,
}: RevealProps) {
  const reduced = usePrefersReducedMotion();

  const hidden = blur
    ? { opacity: 0, y, filter: 'blur(10px)' }
    : { opacity: 0, y, scale: 0.992 };
  const shown = blur
    ? { opacity: 1, y: 0, filter: 'blur(0px)' }
    : { opacity: 1, y: 0, scale: 1 };

  return (
    <motion.div
      className={className}
      initial={reduced ? false : hidden}
      whileInView={shown}
      viewport={{ once, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
