export type Category = 'Blockchain' | 'AI' | 'Full-Stack' | 'Fintech';

export type PreviewKind =
  | 'ide'
  | 'marketplace'
  | 'vault'
  | 'payroll'
  | 'subscribe'
  | 'invoice'
  | 'lending'
  | 'assets'
  | 'chart'
  | 'globe'
  | 'terminal'
  | 'health'
  | 'trading';

export interface SocialLink {
  label: string;
  handle?: string;
  href: string;
}

export interface Stat {
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
}

export interface EducationEntry {
  programme: string;
  institution: string;
  period: string;
  result: string;
}

export interface Profile {
  name: string;
  firstName: string;
  casualName: string;
  role: string;
  status: string;
  location: string;
  email: string;
  siteUrl: string;
  resumeUrl: string;
  bio: string;
  proof: string[];
  stats: Stat[];
  education: EducationEntry[];
  currently: {
    title: string;
    description: string;
    status: string;
    href: string;
  };
  socials: SocialLink[];
}

export interface Role {
  company: string;
  title: string;
  location: string;
  start: string;
  end: string;
  current?: boolean;
  bullets: string[];
  tags: string[];
}

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  categories: Category[];
  year?: string;
  summary: string;
  problem: string;
  solution: string;
  role: string;
  outcome: string;
  stack: string[];
  metrics?: ProjectMetric[];
  codeUrl?: string;
  liveUrl?: string;
  video?: string;
  image?: string;
  preview: PreviewKind;
  flagship?: boolean;
  badge?: string;
}

export interface Experiment {
  title: string;
  href: string;
}

export interface Achievement {
  event: string;
  result: string;
  year?: string;
  context: string;
  highlight?: boolean;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  href?: string;
}

export type SkillIconKey = 'blocks' | 'code' | 'globe' | 'brain' | 'wrench';

export interface SkillGroup {
  label: string;
  icon: SkillIconKey;
  items: string[];
  className: string;
}
