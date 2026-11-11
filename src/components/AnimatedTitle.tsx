import { motion, type Variants } from 'framer-motion';
import {
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
} from 'react';
import { usePrefersReducedMotion } from '../lib/useMediaQuery';

const EASE = [0.16, 1, 0.3, 1] as const;

const word: Variants = {
  hidden: { y: '115%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.95, ease: EASE },
  },
};

const group = (delay: number): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: delay },
  },
});

function isPunctuationOnly(children: ReactNode): boolean {
  let text = '';
  let onlyText = true;
  Children.forEach(children, (child) => {
    if (typeof child === 'string') text += child;
    else if (typeof child === 'number') text += String(child);
    else onlyText = false;
  });
  return onlyText && /^[\p{P}\p{S}]+$/u.test(text.trim());
}

function maskWords(children: ReactNode, prefix: string): ReactNode {
  const out: ReactNode[] = [];
  let pending: { key: string; content: ReactNode[] } | null = null;

  const flush = () => {
    if (!pending) return;
    out.push(
      <span key={pending.key} className="word-mask">
        <motion.span variants={word} className="word-inner">
          {pending.content}
        </motion.span>
      </span>,
    );
    pending = null;
  };

  Children.forEach(children, (child, index) => {
    const key = `${prefix}-${index}`;

    if (typeof child === 'string' || typeof child === 'number') {
      const parts = String(child).split(/(\s+)/);
      parts.forEach((part, partIndex) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          flush();
          out.push(part);
          return;
        }
        if (!/[\p{L}\p{N}]/u.test(part)) {
          if (pending) pending.content.push(part);
          else out.push(part);
          return;
        }
        flush();
        pending = { key: `${key}-${partIndex}`, content: [part] };
      });
      return;
    }

    if (isValidElement<{ children?: ReactNode }>(child)) {
      if (isPunctuationOnly(child.props.children)) {
        const punct = cloneElement(child, { key: `${key}-punct` });
        if (pending) {
          pending.content.push(punct);
          return;
        }
        out.push(punct);
        return;
      }
      flush();
      if (child.props.children === undefined) {
        out.push(cloneElement(child, { key }));
        return;
      }
      out.push(
        cloneElement(child, {
          key,
          children: maskWords(child.props.children, key),
        }),
      );
      return;
    }

    flush();
    out.push(child);
  });

  flush();
  return out;
}

type TagName = 'h1' | 'h2' | 'h3' | 'p' | 'span';

const motionTags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
};

interface AnimatedTitleProps {
  children: ReactNode;
  className?: string;
  as?: TagName;
  delay?: number;
}

export function AnimatedTitle({
  children,
  className,
  as = 'h2',
  delay = 0,
}: AnimatedTitleProps) {
  const reduced = usePrefersReducedMotion();
  const MotionTag = motionTags[as];

  if (reduced) {
    const StaticTag = as;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  return (
    <MotionTag
      className={className}
      variants={group(delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
    >
      {maskWords(children, 'word')}
    </MotionTag>
  );
}
