import { ArrowUpRight } from 'lucide-react';
import { useLayoutEffect, useRef } from 'react';
import type { Project } from '../types/content';
import { gsap } from '../lib/gsap';
import { usePrefersReducedMotion } from '../lib/useMediaQuery';
import { cn } from '../lib/utils';
import { ProjectPreview } from './ProjectPreview';

function usePreviewScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || reduced) return;

    const context = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        })
        .fromTo(element, { scale: 1.035 }, { scale: 1, duration: 1, ease: 'none' })
        .to(element, { scale: 0.975, duration: 1, ease: 'none' });
    }, element);

    return () => context.revert();
  }, [reduced]);

  return ref;
}

function ProjectLinks({
  project,
  onOpen,
  className,
}: {
  project: Project;
  onOpen: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative z-[3] flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.08em]',
        className,
      )}
    >
      {project.codeUrl ? (
        <a
          href={project.codeUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="group/link inline-flex items-center gap-1 text-muted transition-colors hover:text-ink"
        >
          Code
          <ArrowUpRight
            size={11}
            className="transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
          />
        </a>
      ) : null}
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="group/link inline-flex items-center gap-1 text-muted transition-colors hover:text-ink"
        >
          Live
          <ArrowUpRight
            size={11}
            className="transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
          />
        </a>
      ) : null}
      <button
        type="button"
        onClick={onOpen}
        className="group/link ml-auto inline-flex items-center gap-1 text-muted transition-colors hover:text-ink"
      >
        Case study
        <ArrowUpRight
          size={11}
          className="transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
        />
      </button>
    </div>
  );
}

function Badge({ children }: { children: string }) {
  return (
    <span className="pointer-events-none inline-flex w-fit items-center gap-1.5 rounded-chip border border-accent/30 bg-accent/[0.06] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-accent">
      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
      {children}
    </span>
  );
}

interface CardProps {
  project: Project;
  index: number;
  onOpen: () => void;
}

export function ProjectCard({ project, index, onOpen }: CardProps) {
  const previewRef = usePreviewScroll();

  return (
    <article
      data-cursor
      data-cursor-label="View"
      style={{ animationDelay: `${Math.min(index, 7) * 55}ms` }}
      className="card-enter group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface transition-[border-color,transform,box-shadow] duration-500 ease-smooth hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_30px_60px_-36px_rgba(0,0,0,0.95)]"
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open the ${project.title} case study`}
        className="absolute inset-0 z-[2] rounded-card focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
      />

      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-bg">
        <div ref={previewRef} className="h-full w-full origin-center">
          <div className="h-full w-full transition-transform duration-700 ease-smooth group-hover:scale-[1.035]">
            <ProjectPreview project={project} />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.1em] text-faint">
          <span className="truncate">{project.categories.join(' / ')}</span>
          <span className="shrink-0 tabular">
            {String(index).padStart(2, '0')}
            {project.year ? ` · ${project.year}` : ''}
          </span>
        </div>

        <div className="mt-4 flex items-start justify-between gap-4">
          <h3 className="text-[clamp(1.35rem,2vw,1.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-ink">
            {project.title}
          </h3>
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-faint transition-colors duration-300 group-hover:border-accent/50 group-hover:text-accent"
          >
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-[14px] leading-[1.65] text-muted">
          {project.summary}
        </p>

        {project.badge ? (
          <div className="mt-4 flex">
            <Badge>{project.badge}</Badge>
          </div>
        ) : null}

        <ul className="mb-6 mt-5 flex flex-wrap gap-x-3 gap-y-1.5">
          {project.stack.slice(0, 4).map((item) => (
            <li
              key={item}
              className="font-mono text-[10px] uppercase tracking-[0.08em] text-faint"
            >
              {item}
            </li>
          ))}
        </ul>

        <ProjectLinks
          project={project}
          onOpen={onOpen}
          className="mt-auto border-t border-line pt-4"
        />
      </div>
    </article>
  );
}

export function FlagshipCard({ project, index, onOpen }: CardProps) {
  const previewRef = usePreviewScroll();

  return (
    <article
      data-cursor
      data-cursor-label="View"
      style={{ animationDelay: `${Math.min(index, 7) * 55}ms` }}
      className="card-enter group relative overflow-hidden rounded-card border border-line bg-surface transition-[border-color,box-shadow] duration-500 ease-smooth hover:border-line-strong hover:shadow-[0_36px_80px_-44px_rgba(0,0,0,0.95)]"
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open the ${project.title} case study`}
        className="absolute inset-0 z-[2] rounded-card focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
      />

      <div className="grid md:grid-cols-12">
        <div className="flex flex-col justify-between p-6 md:col-span-5 md:p-9">
          <div>
            <div className="flex items-center gap-3">
              <span className="kicker text-accent">Flagship</span>
              <span aria-hidden="true" className="h-px w-7 bg-accent/50" />
              <span className="kicker text-faint">Selected</span>
            </div>

            <h3 className="mt-8 text-[clamp(2.6rem,5.6vw,4.8rem)] font-semibold leading-[0.86] tracking-[-0.055em] text-ink">
              {project.title}
              <span className="text-accent">.</span>
            </h3>

            <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
              {project.categories.join(' · ')}
              {project.year ? ` · ${project.year}` : ''}
            </div>

            <p className="mt-5 max-w-[38ch] text-[15px] leading-[1.7] text-muted">
              {project.summary}
            </p>

            {project.badge ? (
              <span className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-chip border border-accent/30 bg-accent/[0.06] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-accent">
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
                {project.badge}
              </span>
            ) : null}
          </div>

          <div>
            <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-2">
              {project.stack.map((item) => (
                <li
                  key={item}
                  className="font-mono text-[10px] uppercase tracking-[0.08em] text-faint"
                >
                  {item}
                </li>
              ))}
            </ul>

            <ProjectLinks
              project={project}
              onOpen={onOpen}
              className="mt-7 border-t border-line pt-4"
            />
          </div>
        </div>

        <div className="relative aspect-[16/11] overflow-hidden border-t border-line md:col-span-7 md:aspect-auto md:min-h-[430px] md:border-l md:border-t-0">
          <div ref={previewRef} className="h-full w-full origin-center">
            <div className="h-full w-full transition-transform duration-700 ease-smooth group-hover:scale-[1.03]">
              <ProjectPreview project={project} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
