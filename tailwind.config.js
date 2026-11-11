/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        line: 'var(--border)',
        'line-strong': 'var(--border-strong)',
        ink: 'var(--text)',
        muted: 'var(--text-muted)',
        faint: 'var(--text-faint)',
        accent: 'var(--accent)',
        'accent-ink': 'var(--accent-ink)',
      },
      fontFamily: {
        sans: ['"Geist Variable"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono Variable"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        field: '8px',
        chip: '999px',
      },
      maxWidth: {
        shell: '1200px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      screens: {
        xs: '360px',
      },
    },
  },
  plugins: [],
};
