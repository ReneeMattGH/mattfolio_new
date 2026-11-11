import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Download, List, Menu, SquareTerminal, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { profile } from '../data/profile';
import { startScroll, stopScroll } from '../lib/scroll';
import { palette } from '../lib/tones';
import { useActiveSection } from '../lib/useActiveSection';
import { useMagnetic } from '../lib/useMagnetic';
import { useMediaQuery } from '../lib/useMediaQuery';
import { cn, shortcutLabel } from '../lib/utils';
import { Magnetic } from './Magnetic';

const links = [
  { id: 'home', label: 'Home', index: '00' },
  { id: 'about', label: 'About', index: '01' },
  { id: 'experience', label: 'Experience', index: '02' },
  { id: 'projects', label: 'Projects', index: '03' },
  { id: 'achievements', label: 'Achievements', index: '04' },
  { id: 'skills', label: 'Skills', index: '05' },
  { id: 'github', label: 'GitHub', index: '06' },
  { id: 'contact', label: 'Contact', index: '07' },
];

const navIds = links.map((link) => link.id);

interface NavbarProps {
  visible: boolean;
  quickView: boolean;
  onToggleQuickView: () => void;
  onOpenTerminal: () => void;
}

export function Navbar({
  visible,
  quickView,
  onToggleQuickView,
  onOpenTerminal,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(navIds);
  const desktop = useMediaQuery('(min-width: 1024px)');
  const terminalRef = useMagnetic<HTMLButtonElement>({ strength: 6, tilt: 5, radius: 28 });
  const quickRef = useMagnetic<HTMLButtonElement>({ strength: 6, tilt: 5, radius: 28 });
  const menuRef = useMagnetic<HTMLButtonElement>({ strength: 5, tilt: 4, radius: 24 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    stopScroll();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      startScroll();
    };
  }, [menuOpen]);

  useEffect(() => {
    if (desktop) setMenuOpen(false);
  }, [desktop]);

  const toggleQuickView = () => {
    onToggleQuickView();
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[80] transition-[opacity,background-color,border-color] duration-500 ease-smooth',
          visible ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-x-0 bottom-0 h-px transition-opacity duration-700 ease-smooth',
            scrolled || menuOpen ? 'opacity-100' : 'opacity-0',
          )}
          style={{
            backgroundImage: `linear-gradient(90deg, ${palette.blue}00, ${palette.blue}80 22%, ${palette.mint}66 52%, ${palette.gold}66 82%, ${palette.gold}00)`,
          }}
        />
        <div
          className={cn(
            'border-b transition-[background-color,border-color,backdrop-filter] duration-500 ease-smooth',
            scrolled || menuOpen
              ? 'border-line bg-bg/80 backdrop-blur-xl backdrop-saturate-150'
              : 'border-transparent bg-transparent',
          )}
        >
          <div className="shell flex h-[72px] items-center justify-between gap-6">
            <a
              href="#home"
              className="group flex shrink-0 items-baseline gap-2.5"
              aria-label="Matt — home"
            >
              <span className="text-[18px] font-semibold tracking-[-0.03em] text-ink">
                Matt
                <span className="text-accent">.</span>
              </span>
              <span
                aria-hidden="true"
                className="hidden h-3 w-px self-center bg-line-strong xl:block"
              />
              <span className="kicker hidden text-faint transition-colors group-hover:text-muted xl:block">
                Portfolio / 2026
              </span>
            </a>

            <nav aria-label="Primary" className="hidden items-center gap-4 lg:flex">
              {links.map((link) => {
                const isActive = active === link.id;
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'relative py-2 text-[14px] transition-colors duration-300',
                      isActive ? 'text-ink' : 'nav-link text-muted hover:text-ink',
                    )}
                  >
                    {link.label}
                    {isActive ? (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-0 -bottom-0.5 h-px"
                        style={{
                          backgroundImage: `linear-gradient(90deg, ${palette.blue}, ${palette.mint})`,
                        }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      />
                    ) : null}
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-2.5">
              <button
                ref={terminalRef}
                type="button"
                onClick={onOpenTerminal}
                aria-label="Open command terminal"
                className="control magnetic-surface group hidden items-center gap-2 rounded-chip px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted md:inline-flex"
              >
                <SquareTerminal
                  size={13}
                  className="text-faint transition-colors group-hover:text-accent"
                  aria-hidden="true"
                />
                Terminal
                <span className="rounded-[4px] border border-line px-1 py-px text-[9px] text-faint">
                  {shortcutLabel}
                </span>
              </button>

              <button
                ref={quickRef}
                type="button"
                onClick={toggleQuickView}
                aria-pressed={quickView}
                className="control magnetic-surface hidden items-center gap-2 rounded-chip px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted xl:inline-flex"
              >
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full transition-colors duration-200',
                    quickView ? 'bg-accent' : 'bg-white/25',
                  )}
                />
                {quickView ? 'Full site' : 'Quick view'}
              </button>

              <Magnetic strength={9} tilt={6} radius={32}>
                <a
                  href={profile.resumeUrl}
                  download
                  className="btn btn-outline !min-h-[38px] !px-3.5 !py-0 text-[13px]"
                >
                  Resume
                  <Download size={13} className="opacity-70" />
                </a>
              </Magnetic>

              <button
                ref={menuRef}
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="control magnetic-surface inline-flex h-10 w-10 items-center justify-center rounded-field text-ink lg:hidden"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[75] flex flex-col bg-bg pt-[88px] lg:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="shell flex h-full flex-col overflow-y-auto pb-10">
              <nav aria-label="Mobile" className="mt-6">
                {links.map((link, i) => (
                  <motion.a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.04 + i * 0.045,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex items-center justify-between border-b border-line py-4"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="mono-label">{link.index}</span>
                      <span
                        className={cn(
                          'text-[26px] font-medium tracking-[-0.03em]',
                          active === link.id ? 'text-ink' : 'text-muted',
                        )}
                      >
                        {link.label}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={18}
                      className={active === link.id ? 'text-accent' : 'text-faint'}
                    />
                  </motion.a>
                ))}
              </nav>

              <motion.div
                className="mt-8 flex flex-col gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenTerminal();
                  }}
                  className="control flex items-center justify-between rounded-field px-4 py-3 text-left text-[14px] text-muted"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <SquareTerminal size={15} className="text-accent" />
                    Command terminal
                  </span>
                  <kbd className="rounded-[5px] border border-line px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.08em] text-faint">
                    {shortcutLabel}
                  </kbd>
                </button>
                <button
                  type="button"
                  onClick={toggleQuickView}
                  aria-pressed={quickView}
                  className="control flex items-center justify-between rounded-field px-4 py-3 text-left text-[14px] text-muted"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <List size={15} />
                    {quickView ? 'Switch to full site' : 'Quick view for recruiters'}
                  </span>
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      quickView ? 'bg-accent' : 'bg-white/25',
                    )}
                  />
                </button>
                <Magnetic className="w-full" strength={10} tilt={6}>
                  <a href={profile.resumeUrl} download className="btn btn-primary w-full">
                    Download resume
                    <Download size={14} />
                  </a>
                </Magnetic>
              </motion.div>

              <div className="mt-auto pt-10">
                <a
                  href={`mailto:${profile.email}`}
                  className="mono-label link-quiet inline-flex items-center gap-2"
                >
                  {profile.email}
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
