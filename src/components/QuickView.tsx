import { ArrowRight, ArrowUpRight, Download } from 'lucide-react';
import { useState } from 'react';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import type { Project } from '../types/content';
import { Achievements } from '../sections/Achievements';
import { Contact } from '../sections/Contact';
import { Experience } from '../sections/Experience';
import { Skills } from '../sections/Skills';
import { Magnetic } from './Magnetic';
import { ProjectModal } from './ProjectModal';
import { Reveal } from './Reveal';
import { SectionHeader } from './SectionHeader';
import { SpotlightCard } from './SpotlightCard';

const featuredIds = [
  'havx',
  'bnb-greenfield',
  'bitlend',
  'invopay',
  'blockvault',
  'geotrade',
];

const featured = projects.filter((project) => featuredIds.includes(project.id));

interface QuickViewProps {
  onExit: () => void;
}

export function QuickView({ onExit }: QuickViewProps) {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <main className="relative z-10">
      <section id="home" className="border-b border-line pt-[72px]">
        <div className="shell py-14 md:py-20">
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.08em] text-faint">
            <span>Quick view · essentials only</span>
            <button
              type="button"
              onClick={onExit}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-ink"
            >
              Open the full site
              <ArrowUpRight size={11} />
            </button>
          </div>

          <div className="mt-10 grid gap-10 md:grid-cols-12">
            <div className="md:col-span-8">
              <div className="flex items-center gap-3">
                <span className="status-dot h-1.5 w-1.5 rounded-full bg-accent" />
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
                  {profile.status}
                </p>
              </div>

              <h1 className="mt-6 text-[clamp(2.2rem,5.2vw,4.2rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-ink">
                George Kingsley
                <br />
                Renee Matthew
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="mono-label">Known as Matt</span>
                <span className="h-px w-8 bg-line-strong" />
                <span className="mono-label">{profile.location}</span>
              </div>

              <p className="mt-6 max-w-[56ch] text-[16px] leading-[1.65] text-muted md:text-[17px]">
                {profile.role}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Magnetic strength={12} tilt={8}>
                  <a href="#projects" className="btn btn-primary">
                    View projects
                    <ArrowRight size={14} className="btn-arrow" />
                  </a>
                </Magnetic>
                <Magnetic strength={10} tilt={7}>
                  <a href={profile.resumeUrl} download className="btn btn-outline">
                    Download resume
                    <Download size={14} className="opacity-70" />
                  </a>
                </Magnetic>
                <a href="#contact" className="link-underline inline-flex items-center gap-1.5 text-[14px]">
                  Email
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>

            <aside className="md:col-span-4 md:border-l md:border-line md:pl-8">
              <p className="mono-label">Proof</p>
              <ul className="mt-2 divide-y divide-line">
                {profile.proof.map((item) => (
                  <li
                    key={item}
                    className="py-3 font-mono text-[11px] uppercase tracking-[0.05em] text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mono-label mt-6">Based in</p>
              <p className="mt-2 text-[13px] text-muted">{profile.location}</p>
            </aside>
          </div>
        </div>
      </section>

      <section id="about" className="section">
        <div className="shell">
          <SectionHeader
            index="01"
            label="About"
            title="The short version."
            description="Chennai Institute of Technology · 2024 — 2028"
          />

          <div className="grid gap-4 md:grid-cols-12">
            <Reveal className="h-full md:col-span-7">
              <SpotlightCard className="h-full p-6">
                <span className="mono-label">Profile</span>
                <p className="mt-4 max-w-[58ch] text-[15px] leading-[1.75] text-ink/90">
                  {profile.bio}
                </p>
              </SpotlightCard>
            </Reveal>

            <div className="flex flex-col gap-4 md:col-span-5">
              <Reveal>
                <SpotlightCard className="p-5">
                  <span className="mono-label">Education</span>
                  <ul className="mt-3 divide-y divide-line">
                    {profile.education.map((entry) => (
                      <li key={entry.programme} className="py-3">
                        <p className="text-[13px] font-medium leading-snug text-ink">
                          {entry.programme}
                        </p>
                        <p className="mt-1 text-[12px] text-muted">
                          {entry.institution} · {entry.period} · {entry.result}
                        </p>
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </Reveal>

              <Reveal delay={0.05}>
                <SpotlightCard className="p-5">
                  <span className="mono-label">Currently</span>
                  <p className="mt-3 flex items-center gap-2 text-[15px] font-medium text-ink">
                    {profile.currently.title}
                    <span className="status-dot h-1 w-1 rounded-full bg-accent" />
                  </p>
                  <p className="mt-1 text-[12px] leading-[1.6] text-muted">
                    {profile.currently.description}
                  </p>
                </SpotlightCard>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Experience />

      <section id="projects" className="section">
        <div className="shell">
          <SectionHeader
            index="03"
            label="Projects"
            title="Selected work."
            description={`Six of ${projects.length} projects. The full site has the rest.`}
          />

          <div className="grid gap-4 md:grid-cols-2">
            {featured.map((project, index) => (
              <Reveal key={project.id} delay={index * 0.04} className="h-full">
                <article className="card flex h-full flex-col p-5 md:p-6">
                  <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.08em] text-faint">
                    <span className="truncate">
                      {project.categories.join(' · ')}
                      {project.year ? ` · ${project.year}` : ''}
                    </span>
                    <span className="shrink-0 tabular">
                      {String(projects.indexOf(project) + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="mt-4 text-[18px] font-semibold leading-tight tracking-[-0.02em] text-ink">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-[1.65] text-muted">{project.summary}</p>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 4).map((item) => (
                      <li key={item} className="chip !px-2 !py-0.5 text-[9px]">
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-center gap-4 border-t border-line pt-4 font-mono text-[10px] uppercase tracking-[0.08em]">
                    {project.codeUrl ? (
                      <a
                        href={project.codeUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 text-muted transition-colors hover:text-ink"
                      >
                        Code
                        <ArrowUpRight size={11} />
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setSelected(project)}
                      className="ml-auto inline-flex items-center gap-1 text-muted transition-colors hover:text-ink"
                    >
                      Case study
                      <ArrowUpRight size={11} />
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Magnetic strength={10} tilt={7}>
            <button type="button" onClick={onExit} className="btn btn-outline mt-4">
              See all {projects.length} projects
              <ArrowUpRight size={14} className="btn-arrow" />
            </button>
          </Magnetic>
        </div>

        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      </section>

      <Achievements />
      <Skills />
      <Contact />
    </main>
  );
}
