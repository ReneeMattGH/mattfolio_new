import { AnimatePresence, motion } from 'framer-motion';
import { Award, Medal, Trophy, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { startScroll, stopScroll } from '../lib/scroll';
import { palette } from '../lib/tones';
import type { Achievement } from '../types/content';

interface AchievementModalProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const focusableSelector =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function toneFor(result: string) {
  if (/winner|best/i.test(result))
    return { label: 'Winner', Icon: Trophy, hue: palette.gold };
  if (/runner/i.test(result)) return { label: 'Runner-up', Icon: Medal, hue: palette.blue };
  return { label: 'Finalist', Icon: Award, hue: palette.mint };
}

export function AchievementModal({ achievement, onClose }: AchievementModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!achievement) return;

    const previous = document.activeElement as HTMLElement | null;
    stopScroll();
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => closeRef.current?.focus(), 30);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      startScroll();
      window.clearTimeout(timer);
      previous?.focus();
    };
  }, [achievement, onClose]);

  if (typeof document === 'undefined') return null;

  const tone = achievement ? toneFor(achievement.result) : null;

  return createPortal(
    <AnimatePresence>
      {achievement && tone ? (
        <motion.div
          className="fixed inset-0 z-[95] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="achievement-title"
            initial={{ opacity: 0, y: 24, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.995 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ borderColor: `${tone.hue}47` }}
            className="relative z-10 w-full max-w-[620px] overflow-hidden rounded-t-[16px] border bg-surface sm:rounded-card"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                backgroundImage: `linear-gradient(90deg, ${tone.hue}, ${tone.hue}40 55%, transparent)`,
              }}
            />

            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 md:px-8">
              <span className="mono-label truncate">
                Achievement · {achievement.year ?? 'Hackathon'}
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close achievement"
                className="control inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-field text-muted"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-start gap-5">
                <span
                  className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border"
                  style={{
                    borderColor: `${tone.hue}59`,
                    backgroundColor: `${tone.hue}12`,
                    color: tone.hue,
                  }}
                >
                  <tone.Icon size={26} strokeWidth={1.4} aria-hidden="true" />
                  <span
                    aria-hidden="true"
                    className="absolute -inset-1.5 rounded-full border border-dashed"
                    style={{ borderColor: `${tone.hue}33` }}
                  />
                </span>

                <div className="min-w-0">
                  <span className="kicker" style={{ color: tone.hue }}>
                    {tone.label}
                  </span>
                  <h2
                    id="achievement-title"
                    style={{ color: tone.hue }}
                    className="mt-2 text-[clamp(1.9rem,4.5vw,2.9rem)] font-semibold leading-[0.98] tracking-[-0.045em]"
                  >
                    {achievement.result}
                  </h2>
                  <p className="mt-2 text-[16px] leading-snug text-ink">{achievement.event}</p>
                </div>
              </div>

              <p className="mt-6 text-[15px] leading-[1.7] text-muted">{achievement.context}</p>

              <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-5">
                <span className="mono-label">
                  {achievement.year ? `Recorded ${achievement.year}` : 'Hackathon record'}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="mono-label transition-colors hover:text-ink"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
