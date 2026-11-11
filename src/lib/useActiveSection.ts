import { useEffect, useState } from 'react';

export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? 'home');
  const key = ids.join('|');

  useEffect(() => {
    const sections = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [key]);

  return active;
}
