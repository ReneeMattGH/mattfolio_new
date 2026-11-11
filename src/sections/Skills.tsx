import {
  Boxes,
  BrainCircuit,
  Code2,
  Globe2,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { Marquee } from '../components/Marquee';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { SpotlightCard } from '../components/SpotlightCard';
import { skillGroups, softSkills, toolMarquee } from '../data/skills';
import type { SkillIconKey } from '../types/content';

const icons: Record<SkillIconKey, LucideIcon> = {
  blocks: Boxes,
  code: Code2,
  globe: Globe2,
  brain: BrainCircuit,
  wrench: Wrench,
};

export function Skills() {
  return (
    <section id="skills" className="section">
      <div className="shell">
        <SectionHeader
          index="05"
          label="Skills"
          title={
            <>
              A stack built for <span className="whitespace-nowrap text-outline">on-chain</span>{' '}
              products.
            </>
          }
          description="Languages, frameworks and tools used across the work."
        />

        <div className="grid gap-4 md:grid-cols-12">
          {skillGroups.map((group, index) => {
            const Icon = icons[group.icon];
            return (
              <Reveal
                key={group.label}
                delay={index * 0.04}
                className={`h-full ${group.className}`}
              >
                <SpotlightCard className="flex h-full flex-col p-6 md:p-7">
                  <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
                    <div className="flex items-center gap-2.5">
                      <Icon
                        size={16}
                        strokeWidth={1.5}
                        className="text-accent"
                        aria-hidden="true"
                      />
                      <h3 className="text-[16px] font-medium leading-none tracking-[-0.02em] text-ink">
                        {group.label}
                      </h3>
                    </div>
                    <span className="font-mono text-[10px] tabular text-faint">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <ul className="mt-5 flex flex-1 flex-wrap content-start gap-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-[4px] border border-line bg-white/[0.02] px-2.5 py-1 font-mono text-[11px] text-muted transition-colors duration-200 hover:border-line-strong hover:text-ink"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.14em] text-faint/70">
                    {String(group.items.length).padStart(2, '0')} entries
                  </p>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.08}>
          <div className="mt-4 flex flex-col gap-4 border-y border-line py-5 md:flex-row md:items-center md:gap-8">
            <span className="kicker shrink-0 px-0 text-faint md:w-[132px]">Also used</span>
            <div className="min-w-0 flex-1 border-t border-line pt-4 md:border-t-0 md:pt-0">
              <Marquee items={toolMarquee} duration={64} label="Additional tools" />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-14">
            <div className="flex items-center gap-3">
              <span className="kicker text-accent">[ Working style ]</span>
              <span aria-hidden="true" className="h-px w-8 bg-accent/50" />
              <span className="kicker text-faint">{softSkills.length} traits</span>
            </div>

            <ul className="mt-7 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
              {softSkills.map((skill, index) => (
                <li key={skill} className="border-t border-line pt-4">
                  <span className="kicker tabular text-faint/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-2 text-[14.5px] leading-[1.4] text-muted">{skill}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
