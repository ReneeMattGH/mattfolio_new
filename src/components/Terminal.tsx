import { AnimatePresence, motion } from 'framer-motion';
import { CornerDownLeft, SquareTerminal, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { profile } from '../data/profile';
import { categories, projects } from '../data/projects';
import { copyText } from '../lib/clipboard';
import { startScroll, stopScroll } from '../lib/scroll';
import { cn } from '../lib/utils';

const SECTIONS = [
  { id: 'home', label: 'Home', index: '00', hint: 'Introduction and proof' },
  { id: 'about', label: 'About', index: '01', hint: 'Profile, education, stats' },
  { id: 'experience', label: 'Experience', index: '02', hint: 'Roles and responsibilities' },
  { id: 'projects', label: 'Projects', index: '03', hint: 'Work and case studies' },
  { id: 'achievements', label: 'Achievements', index: '04', hint: 'Hackathon results' },
  { id: 'skills', label: 'Skills', index: '05', hint: 'Stack and tools' },
  { id: 'github', label: 'GitHub', index: '06', hint: 'Live repositories and activity' },
  { id: 'contact', label: 'Contact', index: '07', hint: 'Email and message form' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

const SECTION_ALIASES: Record<string, SectionId> = {
  work: 'projects',
  projects: 'projects',
  awards: 'achievements',
  stack: 'skills',
  gh: 'github',
  exp: 'experience',
};

interface Command {
  name: string;
  arg?: string;
  hint: string;
  aliases?: string[];
}

const COMMANDS: Command[] = [
  { name: 'goto', arg: 'section', hint: 'Jump to any section', aliases: ['go', 'cd'] },
  { name: 'open', arg: 'project', hint: 'Open a project case study', aliases: ['project'] },
  { name: 'sections', hint: 'List every section' },
  { name: 'filter', arg: 'category', hint: 'Filter the project grid' },
  { name: 'quickview', hint: 'Toggle recruiter quick view', aliases: ['qv'] },
  { name: 'resume', hint: 'Download the PDF resume' },
  { name: 'email', hint: 'Copy the email address' },
  { name: 'link', arg: 'name', hint: 'Open a social or profile link' },
  { name: 'socials', hint: 'List contact links' },
  { name: 'whoami', hint: 'Who this portfolio belongs to' },
  { name: 'time', hint: 'Current time in Chennai' },
  { name: 'help', hint: 'Show every command', aliases: ['?'] },
  { name: 'clear', hint: 'Clear the output', aliases: ['cls'] },
  { name: 'close', hint: 'Close the terminal', aliases: ['exit', 'quit'] },
];

const SOCIAL_TARGETS = profile.socials.map((social) => ({
  key: social.label.toLowerCase().replace(/[^a-z0-9]/g, ''),
  label: social.label,
  href: social.href,
  handle: social.handle,
}));

interface Suggestion {
  value: string;
  label: string;
  hint: string;
}

const FEATURED: Suggestion[] = [
  { value: 'help', label: 'help', hint: 'Every command' },
  { value: 'goto projects', label: 'goto projects', hint: 'Jump to the work' },
  { value: 'open havx', label: 'open havx', hint: 'Flagship case study' },
  { value: 'filter ai', label: 'filter ai', hint: 'AI projects' },
  { value: 'email', label: 'email', hint: 'Copy the address' },
  { value: 'quickview', label: 'quickview', hint: 'Recruiter view' },
];

type OutputKind =
  | 'welcome'
  | 'help'
  | 'sections'
  | 'projects'
  | 'socials'
  | 'text'
  | 'error'
  | 'success';

interface Message {
  id: number;
  kind: 'input' | 'output';
  text?: string;
  output?: OutputKind;
  detail?: string;
}

function commandUsage(command: Command): string {
  return command.arg ? `${command.name} <${command.arg}>` : command.name;
}

function formatIstTime(): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());
}

function findSections(query: string) {
  const value = query.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!value) return SECTIONS;
  return SECTIONS.filter(
    (section) =>
      section.id.startsWith(value) || section.label.toLowerCase().startsWith(value),
  );
}

function findProjects(query: string) {
  const value = query.toLowerCase();
  if (!value) return projects;
  return projects.filter(
    (project) =>
      project.id.includes(value) ||
      project.title.toLowerCase().includes(value) ||
      project.categories.some((category) => category.toLowerCase().includes(value)),
  );
}

function getSuggestions(input: string): Suggestion[] {
  const trimmed = input.trimStart();
  if (!trimmed) return [];

  const [rawHead, ...rawRest] = trimmed.split(/\s+/);
  const head = rawHead.toLowerCase();
  const rest = rawRest.join(' ').toLowerCase();

  if (SECTIONS.some((section) => section.id === head) || SECTION_ALIASES[head]) {
    return [];
  }

  if (['goto', 'go', 'cd'].includes(head)) {
    return findSections(rest)
      .slice(0, 6)
      .map((section) => ({
        value: `goto ${section.id}`,
        label: `${section.index}  ${section.label}`,
        hint: section.hint,
      }));
  }

  if (['open', 'project'].includes(head)) {
    return findProjects(rest)
      .slice(0, 6)
      .map((project) => ({
        value: `open ${project.id}`,
        label: project.title,
        hint: project.categories.join(' · '),
      }));
  }

  if (head === 'filter') {
    return categories
      .filter((category) => category.toLowerCase().startsWith(rest))
      .map((category) => ({
        value: `filter ${category.toLowerCase()}`,
        label: category,
        hint: 'Project category',
      }));
  }

  if (head === 'link') {
    return SOCIAL_TARGETS.filter(
      (target) => target.key.startsWith(rest) || target.label.toLowerCase().startsWith(rest),
    ).map((target) => ({
      value: `link ${target.key}`,
      label: target.label,
      hint: target.handle ?? target.href,
    }));
  }

  if (rawRest.length > 0) return [];

  return COMMANDS.filter(
    (command) =>
      command.name.startsWith(head) ||
      command.aliases?.some((alias) => alias.startsWith(head)),
  )
    .slice(0, 6)
    .map((command) => ({
      value: command.arg ? `${command.name} ` : command.name,
      label: commandUsage(command),
      hint: command.hint,
    }));
}

interface TerminalProps {
  open: boolean;
  quickView: boolean;
  onClose: () => void;
  onNavigate: (section: SectionId) => void;
  onOpenProject: (id: string) => void;
  onFilterProjects: (category: string) => void;
  onToggleQuickView: () => void;
}

export function Terminal({
  open,
  quickView,
  onClose,
  onNavigate,
  onOpenProject,
  onFilterProjects,
  onToggleQuickView,
}: TerminalProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, kind: 'output', output: 'welcome' },
  ]);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const nextId = useRef(2);

  const suggestions = useMemo(() => getSuggestions(value), [value]);

  useEffect(() => {
    if (!open) return;

    previousFocus.current = document.activeElement as HTMLElement | null;
    stopScroll();
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = '';
      startScroll();
      previousFocus.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const output = outputRef.current;
    if (output) output.scrollTop = output.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (open) return;
    setValue('');
    setHistoryIndex(-1);
  }, [open]);

  if (typeof document === 'undefined') return null;

  const push = (message: Omit<Message, 'id'>) => {
    setMessages((current) => [...current, { ...message, id: nextId.current++ }]);
  };

  const respond = (output: OutputKind, detail?: string) => {
    push({ kind: 'output', output, detail });
  };

  const leave = () => {
    previousFocus.current = null;
  };

  const run = async (raw: string) => {
    const command = raw.trim();
    if (!command) return;

    push({ kind: 'input', text: command });
    setHistory((current) =>
      current[current.length - 1] === command ? current : [...current, command],
    );
    setHistoryIndex(-1);

    const [rawHead, ...rawRest] = command.split(/\s+/);
    const head = rawHead.toLowerCase();
    const arg = rawRest.join(' ');
    const direct = SECTION_ALIASES[head] ?? SECTIONS.find((section) => section.id === head)?.id;
    if (direct) {
      leave();
      onNavigate(direct);
      return;
    }

    const definition = COMMANDS.find(
      (item) => item.name === head || item.aliases?.includes(head),
    );
    if (!definition) {
      respond('error', `Unknown command “${rawHead}”. Type help to see what is available.`);
      return;
    }

    switch (definition.name) {
      case 'help':
        respond('help');
        return;

      case 'sections':
        respond('sections');
        return;

      case 'goto': {
        if (!arg) {
          respond('sections');
          return;
        }
        const query = arg.toLowerCase().replace(/[^a-z0-9]/g, '');
        const alias = SECTION_ALIASES[query];
        if (alias) {
          leave();
          onNavigate(alias);
          return;
        }
        const matches = findSections(arg);
        if (matches.length === 1) {
          leave();
          onNavigate(matches[0].id);
          return;
        }
        if (matches.length > 1) {
          respond(
            'error',
            `“${arg}” matches ${matches.map((section) => section.label).join(', ')}. Try goto ${matches[0].id}.`,
          );
          return;
        }
        respond('error', `No section matches “${arg}”. Type sections to see every section.`);
        return;
      }

      case 'open': {
        if (!arg) {
          respond('projects');
          return;
        }
        const query = arg.toLowerCase();
        const exact = projects.find(
          (project) =>
            project.id === query || project.title.toLowerCase() === query,
        );
        if (exact) {
          leave();
          onOpenProject(exact.id);
          return;
        }
        const matches = findProjects(query);
        if (matches.length === 1) {
          leave();
          onOpenProject(matches[0].id);
          return;
        }
        if (matches.length > 1) {
          respond(
            'error',
            `“${arg}” matches ${matches.length} projects: ${matches
              .slice(0, 4)
              .map((project) => project.id)
              .join(', ')}${matches.length > 4 ? '…' : ''}. Be more specific.`,
          );
          return;
        }
        respond('error', `No project matches “${arg}”. Type open to list all projects.`);
        return;
      }

      case 'filter': {
        if (!arg) {
          respond(
            'text',
            `Categories: ${categories.map((category) => category.toLowerCase()).join(' · ')}`,
          );
          return;
        }
        const query = arg.toLowerCase();
        const category =
          categories.find((item) => item.toLowerCase() === query) ??
          categories.find((item) => item.toLowerCase().startsWith(query));
        if (!category) {
          respond(
            'error',
            `No category matches “${arg}”. Try ${categories.map((item) => item.toLowerCase()).join(', ')}.`,
          );
          return;
        }
        leave();
        onFilterProjects(category);
        return;
      }

      case 'quickview':
        leave();
        onToggleQuickView();
        return;

      case 'resume': {
        const link = document.createElement('a');
        link.href = profile.resumeUrl;
        link.download = 'Matt-Resume.pdf';
        link.click();
        respond('success', 'Resume download started.');
        return;
      }

      case 'email': {
        const copied = await copyText(profile.email);
        respond(
          copied ? 'success' : 'error',
          copied
            ? `Copied ${profile.email} to the clipboard.`
            : `Copy failed. The address is ${profile.email}.`,
        );
        return;
      }

      case 'link': {
        if (!arg) {
          respond('socials');
          return;
        }
        const query = arg.toLowerCase().replace(/[^a-z0-9]/g, '');
        const target =
          SOCIAL_TARGETS.find((item) => item.key === query) ??
          SOCIAL_TARGETS.find(
            (item) => item.key.startsWith(query) || item.label.toLowerCase().startsWith(arg.toLowerCase()),
          );
        if (!target) {
          respond('error', `No link matches “${arg}”. Type socials to see every link.`);
          return;
        }
        if (target.href === '/') {
          leave();
          onNavigate('home');
          return;
        }
        window.open(target.href, '_blank', 'noopener,noreferrer');
        respond('success', `Opening ${target.handle ?? target.href}.`);
        return;
      }

      case 'socials':
        respond('socials');
        return;

      case 'whoami':
        respond(
          'text',
          `${profile.name}\n${profile.role}\n${profile.location} · ${profile.status}`,
        );
        return;

      case 'time':
        respond('text', `Chennai · ${formatIstTime()} IST`);
        return;

      case 'clear':
        setMessages([]);
        return;

      case 'close':
        onClose();
        return;

      default:
        respond('error', 'That command is not wired up yet.');
    }
  };

  const pickSuggestion = (suggestion: Suggestion) => {
    if (suggestion.value.endsWith(' ')) {
      setValue(suggestion.value);
      inputRef.current?.focus();
      return;
    }
    setValue('');
    void run(suggestion.value);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Tab' && suggestions.length > 0) {
      event.preventDefault();
      event.stopPropagation();
      setValue(suggestions[0].value);
      return;
    }

    if (event.key === 'ArrowUp') {
      if (history.length === 0) return;
      event.preventDefault();
      const next = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setValue(history[next]);
      return;
    }

    if (event.key === 'ArrowDown') {
      if (historyIndex === -1) return;
      event.preventDefault();
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(-1);
        setValue('');
      } else {
        setHistoryIndex(next);
        setValue(history[next]);
      }
    }
  };

  const onPanelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== 'Tab' || !panelRef.current) return;
    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled])',
      ),
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

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[95] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
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
            aria-labelledby="terminal-title"
            onKeyDown={onPanelKeyDown}
            initial={{ opacity: 0, y: 24, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.995 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex h-[84svh] w-full max-w-[780px] flex-col overflow-hidden rounded-t-[16px] border border-line bg-surface shadow-[0_-24px_80px_rgba(0,0,0,0.5)] sm:h-[min(78vh,660px)] sm:rounded-card"
          >
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-4 py-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <SquareTerminal size={14} className="shrink-0 text-accent" aria-hidden="true" />
                <span
                  id="terminal-title"
                  className="truncate font-mono text-[10px] uppercase tracking-[0.1em] text-muted"
                >
                  Matt / Terminal
                </span>
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.08em] text-faint sm:inline">
                  · {quickView ? 'Quick view' : 'Full site'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden font-mono text-[9px] uppercase tracking-[0.08em] text-faint sm:inline">
                  Esc to close
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close terminal"
                  className="control inline-flex h-8 w-8 items-center justify-center rounded-field text-muted"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div
              ref={outputRef}
              data-lenis-prevent
              aria-live="polite"
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4"
            >
              <div className="space-y-4 font-mono text-[12px] leading-[1.7]">
                {messages.map((message) =>
                  message.kind === 'input' ? (
                    <p key={message.id} className="flex gap-2 text-ink">
                      <span aria-hidden="true" className="text-accent">
                        ›
                      </span>
                      <span className="min-w-0 break-words">{message.text}</span>
                    </p>
                  ) : (
                    <OutputView
                      key={message.id}
                      message={message}
                      onRun={(command) => {
                        setValue('');
                        void run(command);
                      }}
                      onFill={(command) => {
                        setValue(command);
                        inputRef.current?.focus();
                      }}
                    />
                  ),
                )}
              </div>
            </div>

            {suggestions.length > 0 ? (
              <div className="shrink-0 border-t border-line px-2 py-1.5">
                {suggestions.slice(0, 4).map((suggestion) => (
                  <button
                    key={suggestion.value}
                    type="button"
                    onClick={() => pickSuggestion(suggestion)}
                    className="group flex w-full items-center justify-between gap-4 rounded-[6px] px-2 py-1.5 text-left transition-colors hover:bg-white/[0.04]"
                  >
                    <span className="truncate font-mono text-[11px] text-muted group-hover:text-ink">
                      {suggestion.label}
                    </span>
                    <span className="hidden shrink-0 font-mono text-[9px] uppercase tracking-[0.06em] text-faint sm:inline">
                      {suggestion.hint}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}

            <form
              onSubmit={(event) => {
                event.preventDefault();
                const command = value;
                setValue('');
                void run(command);
              }}
              className="flex shrink-0 items-center gap-3 border-t border-line bg-surface-2 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 sm:pb-3"
            >
              <span aria-hidden="true" className="font-mono text-[13px] text-accent">
                ›
              </span>
              <input
                ref={inputRef}
                value={value}
                onChange={(event) => {
                  setValue(event.target.value);
                  setHistoryIndex(-1);
                }}
                onKeyDown={onInputKeyDown}
                placeholder="Type a command…"
                aria-label="Terminal command"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent font-mono text-[13px] text-ink outline-none placeholder:text-faint"
              />
              <span className="hidden font-mono text-[9px] uppercase tracking-[0.06em] text-faint md:inline">
                Tab complete · ↑↓ history
              </span>
              <button
                type="submit"
                aria-label="Run command"
                disabled={!value.trim()}
                className="control inline-flex h-8 w-8 items-center justify-center rounded-field text-muted disabled:opacity-40"
              >
                <CornerDownLeft size={13} />
              </button>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function OutputView({
  message,
  onRun,
  onFill,
}: {
  message: Message;
  onRun: (command: string) => void;
  onFill: (command: string) => void;
}) {
  if (message.output === 'welcome') {
    return (
      <div className="max-w-[58ch]">
        <p className="font-sans text-[19px] font-medium leading-tight tracking-[-0.025em] text-ink">
          Navigate by command.
        </p>
        <p className="mt-2 font-sans text-[13px] leading-[1.65] text-muted">
          Every section, project and action is reachable from here. Type help for the
          full list, or start with one of these.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {FEATURED.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onRun(item.value)}
              className="rounded-chip border border-line px-2.5 py-1 text-[10px] text-muted transition-colors hover:border-line-strong hover:text-ink"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (message.output === 'help') {
    return (
      <div>
        <p className="mono-label">Commands</p>
        <div className="mt-2 grid gap-x-6 sm:grid-cols-2">
          {COMMANDS.map((command) => (
            <button
              key={command.name}
              type="button"
              onClick={() =>
                onFill(command.arg ? `${command.name} ` : command.name)
              }
              className="group border-t border-line py-2 text-left"
            >
              <span className="block font-mono text-[11px] text-ink transition-colors group-hover:text-accent">
                {commandUsage(command)}
              </span>
              <span className="mt-0.5 block text-[10px] text-faint">{command.hint}</span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-faint">
          Section names work directly — try “projects” or “contact”.
        </p>
      </div>
    );
  }

  if (message.output === 'sections') {
    return (
      <div>
        <p className="mono-label">Sections</p>
        <div className="mt-1 sm:grid sm:grid-cols-2 sm:gap-x-6">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => onRun(`goto ${section.id}`)}
              className="group flex w-full items-center gap-3 border-t border-line py-2 text-left"
            >
              <span className="font-mono text-[10px] tabular text-faint">{section.index}</span>
              <span className="text-[12px] text-ink transition-colors group-hover:text-accent">
                {section.label}
              </span>
              <span className="ml-auto text-[10px] text-faint">↵</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (message.output === 'projects') {
    return (
      <div>
        <p className="mono-label">Projects</p>
        <div className="mt-1 sm:grid sm:grid-cols-2 sm:gap-x-6">
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              onClick={() => onRun(`open ${project.id}`)}
              className="group flex w-full items-center gap-3 border-t border-line py-2 text-left"
            >
              <span className="font-mono text-[10px] tabular text-faint">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 truncate text-[11px] text-ink transition-colors group-hover:text-accent">
                {project.title}
              </span>
              <span className="ml-auto hidden shrink-0 font-mono text-[9px] uppercase tracking-[0.06em] text-faint sm:inline">
                {project.categories[0]}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-faint">
          Or filter first: filter blockchain, filter ai, filter full-stack, filter fintech.
        </p>
      </div>
    );
  }

  if (message.output === 'socials') {
    return (
      <div>
        <p className="mono-label">Links</p>
        <div className="mt-1">
          {SOCIAL_TARGETS.map((target) => (
            <a
              key={target.key}
              href={target.href === '/' ? '#home' : target.href}
              target={target.href.startsWith('http') ? '_blank' : undefined}
              rel={target.href.startsWith('http') ? 'noreferrer noopener' : undefined}
              className="group flex items-center gap-3 border-t border-line py-2"
            >
              <span className="w-[86px] shrink-0 text-[11px] text-ink transition-colors group-hover:text-accent">
                {target.label}
              </span>
              <span className="truncate text-[10px] text-faint">
                {target.handle ?? target.href}
              </span>
              <span className="ml-auto text-[10px] text-faint">↗</span>
            </a>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-faint">
          Open one directly: link github, link linkedin, link x, link havxwallet.
        </p>
      </div>
    );
  }

  return (
    <p
      className={cn(
        'whitespace-pre-line break-words',
        message.output === 'error' && 'text-muted',
        message.output === 'success' && 'text-ink',
        message.output === 'text' && 'text-muted',
      )}
    >
      {message.detail}
    </p>
  );
}
