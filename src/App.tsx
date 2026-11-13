import Lenis from 'lenis';
import { useCallback, useEffect, useState } from 'react';
import { AmbientBackground } from './components/AmbientBackground';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { QuickView } from './components/QuickView';
import { ScrollProgress } from './components/ScrollProgress';
import { Terminal } from './components/Terminal';
import { About } from './sections/About';
import { Achievements } from './sections/Achievements';
import { Contact } from './sections/Contact';
import { Experience } from './sections/Experience';
import { GitHubSection } from './sections/GitHubSection';
import { Hero } from './sections/Hero';
import { Projects } from './sections/Projects';
import { Skills } from './sections/Skills';
import { Testimonials } from './sections/Testimonials';
import { gsap, ScrollTrigger } from './lib/gsap';
import { getLenis, handleAnchorClick, scrollToTarget, setLenis } from './lib/scroll';
import { requestProjectFilter, requestProjectOpen } from './lib/siteEvents';
import { usePrefersReducedMotion } from './lib/useMediaQuery';

export default function App() {
  const [quickView, setQuickView] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setTerminalOpen((current) => !current);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (reduced) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    setLenis(lenis);

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      window.clearTimeout(refreshTimer);
      lenis.off('scroll', onScroll);
      lenis.destroy();
      gsap.ticker.remove(tick);
      setLenis(null);
    };
  }, [reduced]);

  useEffect(() => {
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 350);
    return () => window.clearTimeout(timer);
  }, [quickView]);

  const toggleQuickView = useCallback(() => {
    setQuickView((current) => !current);
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  const navigateFromTerminal = useCallback(
    (section: string) => {
      setTerminalOpen(false);
      window.setTimeout(() => {
        const target = document.getElementById(section);
        if (target) {
          scrollToTarget(target);
          window.history.pushState(null, '', `#${section}`);
          return;
        }
        if (quickView) {
          setQuickView(false);
          window.setTimeout(() => {
            scrollToTarget(`#${section}`);
            window.history.pushState(null, '', `#${section}`);
          }, 240);
        }
      }, 80);
    },
    [quickView],
  );

  const runOnProjects = useCallback(
    (action: () => void) => {
      setTerminalOpen(false);
      if (quickView) {
        setQuickView(false);
        window.setTimeout(() => {
          scrollToTarget('#projects');
          window.history.pushState(null, '', '#projects');
          action();
        }, 260);
        return;
      }
      window.setTimeout(() => {
        scrollToTarget('#projects');
        window.history.pushState(null, '', '#projects');
        action();
      }, 80);
    },
    [quickView],
  );

  const openProjectFromTerminal = useCallback(
    (id: string) => runOnProjects(() => requestProjectOpen(id)),
    [runOnProjects],
  );

  const filterProjectsFromTerminal = useCallback(
    (category: string) => runOnProjects(() => requestProjectFilter(category)),
    [runOnProjects],
  );

  const toggleQuickViewFromTerminal = useCallback(() => {
    setTerminalOpen(false);
    window.setTimeout(toggleQuickView, 80);
  }, [toggleQuickView]);

  return (
    <>
      <AmbientBackground />
      <ScrollProgress />
      <Navbar
        quickView={quickView}
        onToggleQuickView={toggleQuickView}
        onOpenTerminal={() => setTerminalOpen(true)}
      />

      {quickView ? (
        <QuickView onExit={toggleQuickView} />
      ) : (
        <main>
          <Hero onOpenTerminal={() => setTerminalOpen(true)} />
          <About />
          <Experience />
          <Projects />
          <Achievements />
          <Testimonials />
          <Skills />
          <GitHubSection />
          <Contact />
        </main>
      )}

      <Footer />
      <Terminal
        open={terminalOpen}
        quickView={quickView}
        onClose={() => setTerminalOpen(false)}
        onNavigate={navigateFromTerminal}
        onOpenProject={openProjectFromTerminal}
        onFilterProjects={filterProjectsFromTerminal}
        onToggleQuickView={toggleQuickViewFromTerminal}
      />
    </>
  );
}
