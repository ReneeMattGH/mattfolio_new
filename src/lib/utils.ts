export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

export const shortcutLabel =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent)
    ? '⌘K'
    : 'Ctrl K';

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const seconds = Math.round((then - Date.now()) / 1000);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size || unit === 'minute') {
      return formatter.format(Math.round(seconds / size), unit);
    }
  }
  return 'just now';
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}
