import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { projects } from '../data/projects';
import { startScroll, stopScroll } from '../lib/scroll';
import type { Project } from '../types/content';
import { Magnetic } from './Magnetic';
import { ProjectPreview } from './ProjectPreview';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const focusableSelector =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;

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
  }, [project, onClose]);

  if (typeof document === 'undefined') return null;

  const index = project ? projects.findIndex((item) => item.id === project.id) + 1 : 0;

  return createPortal(
    <AnimatePresence>
      {project ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
            initial={{ opacity: 0, y: 24, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.995 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-h-[92svh] w-full max-w-[920px] flex-col overflow-hidden rounded-t-[16px] border border-line bg-surface sm:rounded-card"
          >
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-5 py-4 md:px-8">
              <span className="mono-label truncate">
                Case study · {project.categories[0]}
                {project.year ? ` · ${project.year}` : ''}
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close case study"
                className="control inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-field text-muted"
              >
                <X size={16} />
              </button>
            </div>

            <div
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
              data-lenis-prevent
            >
              <div className="p-5 md:p-8">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <span className="mono-label tabular">
                      {String(index).padStart(2, '0')} / {project.categories.join(' · ')}
                    </span>
                    <h2
                      id="case-study-title"
                      className="mt-3 text-[clamp(1.8rem,4vw,2.9rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink"
                    >
                      {project.title}
                    </h2>
                  </div>
                  {project.badge ? (
                    <span className="hidden shrink-0 items-center gap-1.5 rounded-chip border border-accent/25 bg-accent/[0.06] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.06em] text-accent sm:inline-flex">
                      <span className="h-1 w-1 rounded-full bg-accent" />
                      {project.badge}
                    </span>
                  ) : null}
                </div>

                <p className="mt-4 max-w-[62ch] text-[16px] leading-[1.7] text-muted">
                  {project.summary}
                </p>

                <div className="mt-7 overflow-hidden rounded-[10px] border border-line">
                  <div className="aspect-[16/9]">
                    <ProjectPreview project={project} />
                  </div>
                </div>

                <div className="mt-8 grid gap-0 md:grid-cols-2 md:gap-x-10">
                  <ModalSection title="Problem" className="md:col-span-2">
                    {project.problem}
                  </ModalSection>
                  <ModalSection title="Solution" className="md:col-span-2">
                    {project.solution}
                  </ModalSection>
                  <ModalSection title="Role">{project.role}</ModalSection>
                  <ModalSection title="Outcome">{project.outcome}</ModalSection>
                  <ModalSection title="Stack" className="md:col-span-2">
                    <ul className="flex flex-wrap gap-2">
                      {project.stack.map((item) => (
                        <li key={item} className="chip">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </ModalSection>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-line pt-6">
                  {project.codeUrl ? (
                    <Magnetic strength={10} tilt={7}>
                      <a
                        href={project.codeUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="btn btn-outline"
                      >
                        View code
                        <ArrowUpRight size={14} className="btn-arrow" />
                      </a>
                    </Magnetic>
                  ) : null}
                  {project.liveUrl ? (
                    <Magnetic strength={12} tilt={8}>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="btn btn-primary"
                      >
                        Open live
                        <ArrowUpRight size={14} className="btn-arrow" />
                      </a>
                    </Magnetic>
                  ) : null}
                  <button
                    type="button"
                    onClick={onClose}
                    className="mono-label ml-auto transition-colors hover:text-ink"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function ModalSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="border-t border-line py-6">
        <p className="mono-label">{title}</p>
        <div className="mt-3 text-[15px] leading-[1.7] text-muted">{children}</div>
      </div>
    </section>
  );
}
