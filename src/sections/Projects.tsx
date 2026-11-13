import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { FlagshipCard, ProjectCard } from '../components/ProjectCard';
import { ProjectModal } from '../components/ProjectModal';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { Tilt } from '../components/Tilt';
import { categories, experiments, projects } from '../data/projects';
import { FILTER_PROJECTS_EVENT, OPEN_PROJECT_EVENT } from '../lib/siteEvents';
import { categoryTones } from '../lib/tones';
import { cn } from '../lib/utils';
import type { Category, Project } from '../types/content';

export function Projects() {
  const [filter, setFilter] = useState<'All' | Category>('All');
  const [selected, setSelected] = useState<Project | null>(null);
  const [expanded, setExpanded] = useState(false);

  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    const onOpen = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      const project = projects.find((item) => item.id === id);
      if (project) setSelected(project);
    };

    const onFilter = (event: Event) => {
      const category = (event as CustomEvent<string>).detail;
      if (categories.includes(category as 'All' | Category)) {
        setFilter(category as 'All' | Category);
      }
    };

    window.addEventListener(OPEN_PROJECT_EVENT, onOpen);
    window.addEventListener(FILTER_PROJECTS_EVENT, onFilter);
    return () => {
      window.removeEventListener(OPEN_PROJECT_EVENT, onOpen);
      window.removeEventListener(FILTER_PROJECTS_EVENT, onFilter);
    };
  }, []);

  const visible =
    filter === 'All'
      ? projects
      : projects.filter((project) => project.categories.includes(filter));
  const flagship = visible.find((project) => project.flagship);
  const rest = visible
    .filter((project) => !project.flagship)
    .map((project, index) => ({ project, index }))
    .sort(
      (a, b) =>
        Number(Boolean(b.project.badge)) - Number(Boolean(a.project.badge)) ||
        a.index - b.index,
    )
    .map(({ project }) => project);
  const trimmed = filter === 'All' && !expanded;
  const restShown = trimmed ? rest.slice(0, 6) : rest;
  const shownCount = (flagship ? 1 : 0) + restShown.length;

  return (
    <section id="projects" className="section">
      <div className="shell">
        <SectionHeader
          index="03"
          label="Projects"
          title={
            <>
              Work that <span className="text-outline">ships<span className="title-punct">,</span></span> on-chain and off.
            </>
          }
          description="Selected projects across payments, DeFi, AI and developer tooling."
        />

        <div className="sticky top-[var(--nav-h)] z-30 mb-10 border-y border-line bg-bg">
          <div className="flex items-center justify-between gap-6">
            <div className="no-scrollbar -mr-4 flex flex-1 items-center gap-5 overflow-x-auto py-3.5 pr-4 sm:gap-7">
              {categories.map((category) => {
                const active = filter === category;
                const tone = category === 'All' ? 'var(--text)' : categoryTones[category];
                const count =
                  category === 'All'
                    ? projects.length
                    : projects.filter((project) => project.categories.includes(category)).length;

                return (
                  <div key={category} className="relative flex shrink-0 items-baseline">
                    <button
                      type="button"
                      onClick={() => {
                        setFilter(category);
                        setExpanded(false);
                      }}
                      aria-pressed={active}
                      className={cn(
                        'flex items-center gap-2 whitespace-nowrap text-[13px] transition-colors duration-200',
                        active ? 'text-ink' : 'text-muted hover:text-ink',
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full transition-opacity duration-200"
                        style={{ backgroundColor: tone, opacity: active ? 1 : 0.55 }}
                      />
                      {category}
                    </button>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'ml-1.5 hidden font-mono text-[9px] tabular transition-colors duration-200 sm:inline',
                        active ? '' : 'text-faint/70',
                      )}
                      style={active ? { color: tone } : undefined}
                    >
                      {String(count).padStart(2, '0')}
                    </span>
                    {active ? (
                      <motion.span
                        layoutId="project-filter"
                        className="absolute -bottom-3.5 left-0 right-0 h-px sm:right-4"
                        style={{ backgroundColor: tone }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
            <div className="hidden shrink-0 items-center gap-3 border-l border-line pl-6 sm:flex">
              <span className="kicker tabular text-faint">
                {String(shownCount).padStart(2, '0')} shown
              </span>
              <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-accent/70" />
              <span className="kicker text-faint">2025 — 26</span>
            </div>
          </div>
        </div>

        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {flagship ? (
            <Tilt max={2.2}>
              <FlagshipCard
                project={flagship}
                index={projects.indexOf(flagship) + 1}
                onOpen={() => setSelected(flagship)}
              />
            </Tilt>
          ) : null}

          <div className={cn('grid gap-4 md:grid-cols-2', flagship && 'mt-4')}>
            {restShown.map((project) => (
              <Tilt key={project.id} className="h-full">
                <ProjectCard
                  project={project}
                  index={projects.indexOf(project) + 1}
                  onOpen={() => setSelected(project)}
                />
              </Tilt>
            ))}
          </div>

          {filter === 'All' && rest.length > 6 ? (
            <button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              aria-expanded={expanded}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-card border border-line bg-surface px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted transition-colors duration-300 hover:border-line-strong hover:text-ink"
            >
              {expanded ? 'Show fewer projects' : `Show all ${visible.length} projects`}
              <ChevronDown
                size={13}
                aria-hidden="true"
                className={cn('transition-transform duration-300', expanded && 'rotate-180')}
              />
            </button>
          ) : null}
        </motion.div>

        <Reveal delay={0.05}>
          <div className="mt-4 rounded-card border border-line bg-surface px-6 py-7 md:px-8 md:py-8">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
              <div className="max-w-[38ch]">
                <div className="flex items-center gap-3">
                  <span className="kicker text-accent">[ Lab ]</span>
                  <span aria-hidden="true" className="h-px w-6 bg-accent/50" />
                  <span className="kicker text-faint">Experiments</span>
                </div>
                <p className="mt-4 text-[clamp(1.25rem,2.2vw,1.6rem)] font-medium leading-[1.2] tracking-[-0.03em] text-ink">
                  Smaller builds, contract practice and prototypes kept in the open.
                </p>
              </div>

              <ul className="grid flex-1 gap-x-10 sm:grid-cols-2 lg:max-w-[560px]">
                {experiments.map((experiment) => (
                  <li key={experiment.title} className="border-t border-line">
                    <a
                      href={experiment.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group row-hover flex items-center justify-between gap-3 py-3.5 pl-4 font-mono text-[11px] uppercase tracking-[0.06em] text-muted transition-colors hover:text-ink"
                    >
                      {experiment.title}
                      <ArrowUpRight
                        size={13}
                        aria-hidden="true"
                        className="shrink-0 text-faint transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-4">
              <span className="kicker text-faint">More on GitHub</span>
              <a
                href="https://github.com/ReneeMattGH"
                target="_blank"
                rel="noreferrer noopener"
                className="link-sweep font-mono text-[10px] uppercase tracking-[0.1em] text-muted hover:text-ink"
              >
                Open the archive
                <ArrowRight size={12} aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      <ProjectModal project={selected} onClose={close} />
    </section>
  );
}
