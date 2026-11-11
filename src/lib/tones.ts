import type { Category } from '../types/content';

export const palette = {
  blue: '#8fb4ff',
  mint: '#8fe3c0',
  gold: '#f2c78f',
  iris: '#b9a8ff',
} as const;

export const categoryTones: Record<Category, string> = {
  Blockchain: palette.blue,
  AI: palette.mint,
  'Full-Stack': palette.iris,
  Fintech: palette.gold,
};

export function projectTone(project: { categories: Category[] }): string {
  return categoryTones[project.categories[0]] ?? palette.blue;
}
