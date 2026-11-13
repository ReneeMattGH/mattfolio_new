# Matt — Portfolio

Personal portfolio for **George Kingsley Renee Matthew**, a blockchain and full-stack engineer. Built with Vite, React, TypeScript, Tailwind, React Three Fiber and GSAP.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run typecheck   # TypeScript, strict
npm run build       # typecheck + production bundle
npm run preview     # serve the production build locally
```

The production site is a static SPA — no server or database required.

## Editing content

All copy lives in typed files under `src/data/`. Nothing is hard-coded in components.

| File | Controls |
| --- | --- |
| `src/data/profile.ts` | Name, role, bio, email, location, availability, proof points, About stats, education, "Currently" card, socials, canonical site URL |
| `src/data/experience.ts` | Roles, dates, locations, bullets, tags |
| `src/data/projects.ts` | Categories, project list, flagship flag, case-study copy, links, preview type, optional `metrics` and `video`, experiments |
| `src/data/achievements.ts` | Achievement rows. Leave `year` empty unless confirmed |
| `src/data/skills.ts` | Skill groups and marquee items |
| `src/data/testimonials.ts` | Quotes with name, role, company and optional profile link. The section is hidden while the list is empty |
| `src/data/github.ts` | Cached fallback snapshot used when the GitHub API is rate-limited |

TypeScript will fail the build if a required field is missing, so run `npm run typecheck` after editing.

Content rules kept throughout: no invented metrics, links, quotes or dates, no phone number or address, and empty fields are omitted rather than filled with placeholders.

Project preview images are bound automatically: drop a file named `<project-id>.png` (or `.jpg`, `.jpeg`, `.webp`) into `public/projects/`. `scripts/project-images.mjs` regenerates `src/data/projectImages.ts` before `dev` and `build`. Projects without an image keep their generated preview.

The Projects grid shows the flagship plus the top six winners by default; **Show all** reveals the rest of the list.

## Command terminal

A real command palette for the site. Open it with **⌘K / Ctrl K**, the **Terminal** button in the nav, the hero footer, or the mobile menu. `Esc` closes it; focus returns to where you left off.

| Command | Action |
| --- | --- |
| `goto <section>` / `go` / `cd` | Scroll to a section |
| `open <project>` | Jump to a project case study |
| `filter <category>` | Filter the project grid (`blockchain`, `ai`, `full-stack`, `fintech`) |
| `quickview` / `qv` | Toggle recruiter quick view |
| `resume` | Download the PDF resume |
| `email` | Copy the email address |
| `link <name>` / `socials` | Open or list social links |
| `sections`, `whoami`, `time`, `help` / `?`, `clear`, `close` | List sections and utility actions |

Section names also work directly (`projects`, `contact`). `Tab` completes the first suggestion and `↑`/`↓` walk command history. Every command drives the real site state — filters, modals, navigation and clipboard — rather than printing a simulated result.

### Before deploying

1. `SITE_URL` in `src/data/profile.ts` is set to `https://mattfolio-new.vercel.app`. If the domain changes, update it there and in `public/robots.txt`, `public/sitemap.xml` and the canonical/Open Graph tags in `index.html`.
2. Keep the About stats in `profile.ts` consistent with reality. The `GitHub repositories` stat is a snapshot; the live GitHub section reads the API at runtime, so it can legitimately show a different number. Update both when you want them aligned.
3. If you add a project that has no public URL yet, leave the field out rather than inventing a link.
4. Testimonials stay unpublished until real, permissioned quotes are added to `src/data/testimonials.ts`.

## Environment variables

Copy `.env.example` to `.env` and fill in only what you need. All are optional.

```bash
VITE_FORM_ENDPOINT=            # Formspree endpoint, e.g. https://formspree.io/f/xxxxxxx

VITE_EMAILJS_SERVICE_ID=       # Alternative: EmailJS
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=

VITE_GITHUB_TOKEN=             # Lifts the unauthenticated GitHub API rate limit
```

The contact form dispatches to Formspree, then EmailJS, and finally falls back to opening a real `mailto:` draft. It never shows a fake success message. Without an endpoint configured, the mail client fallback is the intended path.

`VITE_GITHUB_TOKEN` is bundled into the client. Use a read-only token with no scopes and accept that it is public.

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, **Add New → Project** and import the repo.
3. Framework preset: **Vite**. Build command `npm run build`, output directory `dist`.
4. Add the environment variables you use in **Settings → Environment Variables**.
5. Deploy, then add the production domain and update `SITE_URL`, `public/robots.txt` and `public/sitemap.xml`.

`vercel.json` is not required — the site is a single page with no client-side routes, so no rewrite rule is needed.

Any static host works the same way: run `npm run build` and serve `dist/`.

## Generated assets

`public/og.png` (1200×630 social card) and `public/resume.pdf` (one page, A4) are rendered from the HTML templates in `scripts/`. Regenerate them after changing the copy in those templates:

```bash
# Social card
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,630 --screenshot=public/og.png \
  "file://$PWD/scripts/og.html"

# Resume
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=public/resume.pdf \
  "file://$PWD/scripts/resume.html"
```

Both templates use the Geist fonts in `scripts/fonts/`. Verify the resume stays on one page after edits.

## Project structure

```
index.html                  SEO, Open Graph, JSON-LD Person
public/                     favicon, OG card, resume, robots, sitemap, project images
src/
  components/               nav, terminal, scroll progress, cards, modal, footer
  sections/                 hero, about, experience, projects, achievements,
                            skills, github, contact, testimonials
  three/HeroScene.tsx       restrained WebGL chain (lazy-loaded, with fallback)
  lib/                      Lenis, GSAP setup, hooks, GitHub API client
  data/                     all editable content
  types/                    shared content types
scripts/                    static asset templates and verification utilities
```

## Behaviour notes

- The page renders immediately — there is no intro loader and no custom cursor, so content and links are usable from the first paint.
- The 3D hero is lazy-loaded after first paint and skipped entirely for reduced-motion users. Touch devices and low-core machines get a lighter scene (no post-processing, lower DPR). If WebGL fails, an error boundary shows a static fallback.
- Motion respects `prefers-reduced-motion`: reveals become instant, smooth scrolling is replaced by native scrolling.
- The GitHub section caches responses in `sessionStorage` for 10 minutes. On rate-limit or network failure it shows a labelled cached snapshot and pauses the heatmap rather than rendering invented data, with a retry action.
- Quick view is a recruiter-friendly mode that hides the 3D scene and shows all projects without filters.

## Verification scripts (optional)

These are development aids, not part of the build:

```bash
node scripts/verify.mjs    # interaction/a11y/responsive checks (set SITE_URL to target a build)
node scripts/capture.mjs   # section screenshots via Chrome DevTools Protocol
node scripts/probe.mjs     # narrow-viewport overflow diagnostics
```

They launch a local Chrome instance and are safe to delete if you do not want them in the repo.
