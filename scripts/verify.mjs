import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9334;
const BASE = process.env.SITE_URL ?? 'http://127.0.0.1:5174/';
const OUT = '/tmp/matt-shots';
mkdirSync(OUT, { recursive: true });
const profile = mkdtempSync(join(tmpdir(), 'matt-verify-'));

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--enable-unsafe-swiftshader',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function endpoint(path, options) {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}${path}`, options);
      if (res.ok) return res.json();
    } catch {
      /* retry */
    }
    await sleep(200);
  }
  throw new Error('Chrome debugging endpoint did not start');
}

class Cdp {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.id = 0;
    this.pending = new Map();
    this.events = [];
    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(JSON.stringify(message.error)));
        else resolve(message.result);
      } else if (message.method) {
        this.events.push(message);
      }
    });
    this.ready = new Promise((resolve) => this.ws.addEventListener('open', resolve));
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`${method} timed out`));
      }, 30000);
      this.pending.set(id, {
        resolve: (value) => { clearTimeout(timer); resolve(value); },
        reject: (error) => { clearTimeout(timer); reject(error); },
      });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
    }
    return result.result.value;
  }

  async shot(name) {
    const shot = await this.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
    });
    writeFileSync(join(OUT, `${name}.png`), Buffer.from(shot.data, 'base64'));
  }

  async waitFor(expression, timeout = 2500, interval = 100) {
    const started = Date.now();
    while (Date.now() - started < timeout) {
      if (await this.evaluate(expression)) return true;
      await sleep(interval);
    }
    return false;
  }

  async metrics(width, height) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(400);
  }

  async click(selector) {
    const result = await this.evaluate(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return false;
      el.click();
      return true;
    })()`);
    if (!result) throw new Error(`Missing selector: ${selector}`);
    await sleep(650);
  }

  async scrollTo(id) {
    await this.evaluate(`(() => {
      const el = document.getElementById(${JSON.stringify(id)});
      if (!el) return false;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'auto' });
      return true;
    })()`);
    await sleep(900);
  }

  async openTerminal() {
    await this.evaluate(
      "window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))",
    );
    await sleep(550);
  }

  async terminalCommand(text) {
    const found = await this.evaluate(`(() => {
      const input = document.querySelector('input[aria-label="Terminal command"]');
      if (!input) return false;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(input, ${JSON.stringify(text)});
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    })()`);
    await sleep(150);
    if (!found) return false;
    await this.evaluate(`document.querySelector('input[aria-label="Terminal command"]')?.closest('form')?.requestSubmit()`);
    await sleep(1000);
    return true;
  }
}

const results = [];
function check(name, pass, detail = '') {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name}${detail ? ` · ${detail}` : ''}`);
}

async function main() {
  const version = await endpoint('/json/version');
  const browser = new Cdp(version.webSocketDebuggerUrl);
  await browser.ready;
  await browser.send('Browser.grantPermissions', {
    origin: new URL(BASE).origin,
    permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
  });

  const created = await endpoint('/json/new?about:blank', { method: 'PUT' });
  const cdp = new Cdp(created.webSocketDebuggerUrl);
  await cdp.ready;
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.enable');
  await cdp.send('Log.enable');
  await cdp.send('Emulation.setFocusEmulationEnabled', { enabled: true });
  await cdp.send('Page.bringToFront');
  await cdp.metrics(1440, 900);
  await cdp.send('Page.navigate', { url: BASE });
  await sleep(3800);

  const exceptions = cdp.events.filter((event) => event.method === 'Runtime.exceptionThrown');
  check('No runtime exceptions on load', exceptions.length === 0, `${exceptions.length} exceptions`);
  if (exceptions.length) {
    console.log(exceptions.map((event) => JSON.stringify(event.params).slice(0, 500)).join('\n'));
  }

  const hero = await cdp.evaluate(`(() => ({
    title: document.title,
    h1: document.querySelector('h1')?.innerText,
    scrollHeight: document.documentElement.scrollHeight,
    canvas: document.querySelectorAll('canvas').length,
    overflow: document.documentElement.scrollWidth > innerWidth,
    active: document.querySelector('nav[aria-label="Primary"] a[aria-current="page"]')?.textContent,
    proof: [...document.querySelectorAll('#home ul li')].map(li => li.textContent?.trim()),
  }))()`);
  check('Hero has one h1 with the full name', Boolean(hero.h1?.includes('George')), hero.h1);
  check('WebGL hero canvas mounted', hero.canvas === 1, `${hero.canvas} canvas`);
  check('No horizontal overflow at 1440', !hero.overflow);
  check('Active nav starts at Home', hero.active === 'Home', String(hero.active));
  await cdp.shot('verify-1440-hero');

  // Nav anchor + active state
  await cdp.click('nav[aria-label="Primary"] a[href="#about"]');
  await sleep(1400);
  const aboutState = await cdp.evaluate(`({
    active: document.querySelector('nav[aria-label="Primary"] a[aria-current="page"]')?.textContent,
    y: Math.round(scrollY),
    hash: location.hash,
  })`);
  check('Nav scrolls to About and marks it active', aboutState.active === 'About' && aboutState.hash === '#about', JSON.stringify(aboutState));

  // Projects filters + modal
  await cdp.scrollTo('projects');
  const filterResult = await cdp.evaluate(`(() => {
    const tabs = [...document.querySelectorAll('#projects button')];
    const ai = tabs.find(el => el.textContent.trim() === 'AI');
    if (!ai) return { ok: false, countBefore: 0 };
    const before = document.querySelectorAll('#projects article').length;
    ai.click();
    return { ok: true, before };
  })()`);
  await sleep(900);
  const aiCount = await cdp.evaluate("document.querySelectorAll('#projects article').length");
  check('AI filter updates the project grid', filterResult.ok && aiCount > 0 && aiCount < filterResult.before, `${filterResult.before} -> ${aiCount}`);
  await cdp.shot('verify-projects-filter');
  await cdp.evaluate("[...document.querySelectorAll('#projects button')].find(el => el.textContent.trim() === 'All').click()");
  await sleep(700);

  const modalOpened = await cdp.evaluate(`(() => {
    const button = document.querySelector('button[aria-label="Open the HAVX case study"]');
    if (!button) return false;
    button.click();
    return true;
  })()`);
  await sleep(700);
  const modalState = await cdp.evaluate(`({
    dialog: Boolean(document.querySelector('[role="dialog"]')),
    title: document.querySelector('#case-study-title')?.textContent,
    focus: document.activeElement?.getAttribute('aria-label'),
    overflow: document.body.style.overflow,
  })`);
  check('Case study modal opens', modalOpened && modalState.dialog && modalState.title === 'HAVX', JSON.stringify(modalState));
  check('Modal moves focus to close and locks scroll', modalState.focus === 'Close case study' && modalState.overflow === 'hidden', JSON.stringify(modalState));
  await cdp.shot('verify-modal');

  await cdp.evaluate("document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))");
  await cdp.waitFor("!document.querySelector('[role=\"dialog\"]')");
  const modalClosed = await cdp.evaluate(`({
    dialog: Boolean(document.querySelector('[role="dialog"]')),
    overflow: document.body.style.overflow,
  })`);
  check('Escape closes the modal and restores scroll', !modalClosed.dialog && modalClosed.overflow === '', JSON.stringify(modalClosed));

  // Contact copy + validation
  await cdp.scrollTo('contact');
  const copied = await cdp.evaluate(`(() => {
    const button = [...document.querySelectorAll('#contact button')].find(el => el.textContent.trim().toLowerCase().includes('copy'));
    if (!button) return false;
    button.click();
    return true;
  })()`);
  await sleep(500);
  const toast = await cdp.evaluate("document.querySelector('#contact [role=\"status\"]')?.textContent");
  check('Copy email shows a confirmation', copied && Boolean(toast?.includes('copied')), String(toast));
  await cdp.shot('verify-contact');

  const invalid = await cdp.evaluate(`(() => {
    const form = document.querySelector('#contact form');
    if (!form) return false;
    form.requestSubmit();
    return true;
  })()`);
  await sleep(500);
  const invalidState = await cdp.evaluate(`(() => {
    const form = document.querySelector('#contact form');
    return {
      errors: [...form.querySelectorAll('[role="alert"]')].map(el => el.textContent.trim()),
      focus: document.activeElement?.tagName,
    };
  })()`);
  check('Empty form exposes inline validation', invalid && invalidState.errors.length >= 2, JSON.stringify(invalidState));
  check('Invalid submit focuses the first field', invalidState.focus === 'INPUT', String(invalidState.focus));

  // Quick view
  await cdp.evaluate("window.scrollTo(0,0)");
  await sleep(500);
  const quickToggled = await cdp.evaluate(`(() => {
    const button = [...document.querySelectorAll('header button')].find(el => el.textContent.trim() === 'Quick view');
    if (!button) return false;
    button.click();
    return true;
  })()`);
  await sleep(900);
  const quickState = await cdp.evaluate(`({
    pressed: [...document.querySelectorAll('header button')].some(el => el.getAttribute('aria-pressed') === 'true'),
    sections: [...document.querySelectorAll('main section[id]')].map(el => el.id),
    projects: document.querySelectorAll('#projects article').length,
    canvas: document.querySelectorAll('canvas').length,
  })`);
  check('Quick view renders a compact single page', quickToggled && quickState.pressed && quickState.canvas === 0 && quickState.projects === 6, JSON.stringify(quickState));
  await cdp.shot('verify-quickview');

  await cdp.evaluate("[...document.querySelectorAll('header button')].find(el => el.textContent.trim() === 'Full site').click()");
  await sleep(900);
  const fullSite = await cdp.evaluate("Boolean(document.querySelector('#home canvas')) || document.querySelector('#home h1')?.textContent.length > 0");
  check('Full site restores from quick view', fullSite);

  // Command terminal
  await cdp.evaluate('window.scrollTo(0,0)');
  await sleep(400);
  await cdp.openTerminal();
  const terminalOpenState = await cdp.evaluate(`({
    dialog: Boolean(document.querySelector('[aria-labelledby="terminal-title"]')),
    focus: document.activeElement?.getAttribute('aria-label'),
    overflow: document.body.style.overflow,
    welcome: document.querySelector('[aria-labelledby="terminal-title"]')?.textContent.includes('Navigate by command'),
  })`);
  check(
    'Cmd/Ctrl+K opens the terminal with focus and scroll lock',
    terminalOpenState.dialog && terminalOpenState.focus === 'Terminal command' && terminalOpenState.overflow === 'hidden' && terminalOpenState.welcome,
    JSON.stringify(terminalOpenState),
  );
  await cdp.shot('verify-terminal');

  await cdp.terminalCommand('help');
  const helpState = await cdp.evaluate(`(() => {
    const text = document.querySelector('[aria-labelledby="terminal-title"]')?.textContent ?? '';
    return {
      commands: text.includes('Commands'),
      goto: text.includes('goto <section>'),
      open: text.includes('open <project>'),
      filter: text.includes('filter <category>'),
    };
  })()`);
  check('help lists every command family', helpState.commands && helpState.goto && helpState.open && helpState.filter, JSON.stringify(helpState));

  await cdp.terminalCommand('sections');
  const sectionsListed = await cdp.evaluate(`(() => {
    const text = document.querySelector('[aria-labelledby="terminal-title"]')?.textContent ?? '';
    return ['Home', 'About', 'Experience', 'Projects', 'Achievements', 'Skills', 'GitHub', 'Contact']
      .filter((label) => text.includes(label)).length;
  })()`);
  check('sections lists every navigable topic', sectionsListed === 8, `${sectionsListed}/8 sections`);

  await cdp.evaluate(`(() => {
    const input = document.querySelector('input[aria-label="Terminal command"]');
    if (!input) return false;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, 'go');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  })()`);
  await sleep(250);
  await cdp.evaluate(`document.querySelector('input[aria-label="Terminal command"]').dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', bubbles: true }))`);
  await sleep(250);
  const completed = await cdp.evaluate(`document.querySelector('input[aria-label="Terminal command"]')?.value`);
  check('Tab completes a partial command', completed === 'goto home', String(completed));

  await cdp.evaluate(`document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`);
  await cdp.waitFor("!document.querySelector('[aria-labelledby=\"terminal-title\"]')");
  const terminalClosed = await cdp.evaluate(`({
    dialog: Boolean(document.querySelector('[aria-labelledby="terminal-title"]')),
    overflow: document.body.style.overflow,
  })`);
  check('Escape closes the terminal and restores scroll', !terminalClosed.dialog && terminalClosed.overflow === '', JSON.stringify(terminalClosed));

  await cdp.openTerminal();
  await cdp.terminalCommand('open havx');
  await sleep(400);
  const terminalProject = await cdp.evaluate(`({
    terminal: Boolean(document.querySelector('[aria-labelledby="terminal-title"]')),
    dialog: Boolean(document.querySelector('[aria-labelledby="case-study-title"]')),
    title: document.getElementById('case-study-title')?.textContent,
  })`);
  check(
    'open <project> jumps to the case study',
    !terminalProject.terminal && terminalProject.dialog && terminalProject.title === 'HAVX',
    JSON.stringify(terminalProject),
  );
  await cdp.evaluate("document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))");
  await cdp.waitFor("!document.querySelector('[aria-labelledby=\"case-study-title\"]')");

  const projectsBefore = await cdp.evaluate("document.querySelectorAll('#projects article').length");
  await cdp.openTerminal();
  await cdp.terminalCommand('filter ai');
  await sleep(700);
  const terminalFilter = await cdp.evaluate(`({
    terminal: Boolean(document.querySelector('[aria-labelledby="terminal-title"]')),
    cards: document.querySelectorAll('#projects article').length,
    active: [...document.querySelectorAll('#projects button')].find(el => el.textContent.trim() === 'AI')?.getAttribute('aria-pressed'),
    hash: location.hash,
  })`);
  check(
    'filter <category> applies the grid filter',
    !terminalFilter.terminal && terminalFilter.cards > 0 && terminalFilter.cards < projectsBefore && terminalFilter.active === 'true' && terminalFilter.hash === '#projects',
    `${projectsBefore} -> ${terminalFilter.cards} cards · ${JSON.stringify(terminalFilter)}`,
  );
  await cdp.evaluate("[...document.querySelectorAll('#projects button')].find(el => el.textContent.trim() === 'All').click()");
  await sleep(600);

  await cdp.openTerminal();
  await cdp.terminalCommand('goto contact');
  await sleep(2400);
  const terminalGoto = await cdp.evaluate(`({
    hash: location.hash,
    top: Math.round(document.getElementById('contact').getBoundingClientRect().top),
  })`);
  check(
    'goto <section> scrolls to the section and sets the hash',
    terminalGoto.hash === '#contact' && Math.abs(terminalGoto.top) < 160,
    JSON.stringify(terminalGoto),
  );

  await cdp.openTerminal();
  await cdp.terminalCommand('doesnotexist');
  const terminalUnknown = await cdp.evaluate(`document.querySelector('[aria-labelledby="terminal-title"]')?.textContent.includes('Unknown command')`);
  check('Unknown commands return a recoverable error', terminalUnknown);
  await cdp.evaluate(`document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`);
  await cdp.waitFor("!document.querySelector('[aria-labelledby=\"terminal-title\"]')");

  // Mobile menu
  await cdp.metrics(390, 844);
  await cdp.evaluate('window.scrollTo(0,0)');
  await sleep(700);
  const noOverflow390 = await cdp.evaluate('document.documentElement.scrollWidth <= innerWidth');
  check('No horizontal overflow at 390', noOverflow390);
  await cdp.click('button[aria-label="Open menu"]');
  await sleep(700);
  const menuState = await cdp.evaluate(`({
    menu: Boolean(document.querySelector('#mobile-menu')),
    links: document.querySelectorAll('#mobile-menu nav a').length,
    expanded: document.querySelector('button[aria-controls="mobile-menu"]')?.getAttribute('aria-expanded'),
    quickView: Boolean([...document.querySelectorAll('#mobile-menu button')].find(el => el.textContent.includes('Quick view'))),
  })`);
  check('Mobile menu opens with all links and quick view', menuState.menu && menuState.links === 8 && menuState.expanded === 'true' && menuState.quickView, JSON.stringify(menuState));
  await cdp.shot('verify-mobile-menu');
  await cdp.evaluate("document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))");
  await cdp.waitFor("!document.querySelector('#mobile-menu')");
  const menuClosed = await cdp.evaluate("!document.querySelector('#mobile-menu')");
  check('Escape closes the mobile menu', menuClosed);

  await cdp.openTerminal();
  const mobileTerminal = await cdp.evaluate(`(() => {
    const panel = document.querySelector('[aria-labelledby="terminal-title"]');
    const box = panel?.getBoundingClientRect();
    return {
      width: Math.round(box?.width ?? 0),
      fits: Boolean(box && box.left >= -1 && box.right <= innerWidth + 1),
      input: Boolean(document.querySelector('input[aria-label="Terminal command"]')),
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  })()`);
  check(
    'Terminal fits the 390 viewport as a bottom sheet',
    mobileTerminal.fits && mobileTerminal.width <= 390 && mobileTerminal.input && !mobileTerminal.overflow,
    JSON.stringify(mobileTerminal),
  );
  await cdp.shot('verify-terminal-mobile');
  await cdp.evaluate(`document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`);
  await cdp.waitFor("!document.querySelector('[aria-labelledby=\"terminal-title\"]')");

  const noOverflow360 = await (async () => {
    await cdp.metrics(360, 780);
    await cdp.evaluate('window.scrollTo(0,0)');
    await sleep(600);
    return cdp.evaluate('document.documentElement.scrollWidth <= innerWidth');
  })();
  check('No horizontal overflow at 360', noOverflow360);
  if (!noOverflow360) {
    const offenders = await cdp.evaluate(`(() => {
      const vw = innerWidth;
      return [...document.querySelectorAll('body *')]
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            tag: el.tagName.toLowerCase(),
            id: el.id,
            cls: (el.className && String(el.className).slice(0, 90)) || '',
            left: Math.round(r.left),
            right: Math.round(r.right),
            width: Math.round(r.width),
            text: (el.textContent || '').trim().slice(0, 40),
          };
        })
        .filter((box) => box.width > 0 && (box.right > vw + 1 || box.left < -1))
        .slice(0, 20);
    })()`);
    console.log('OVERFLOW_360', JSON.stringify(offenders, null, 2));
  }

  // Reduced motion
  await cdp.metrics(1440, 900);
  await cdp.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  });
  await cdp.send('Page.navigate', { url: BASE });
  await sleep(2600);
  const reducedState = await cdp.evaluate(`({
    canvas: document.querySelectorAll('canvas').length,
    heading: document.querySelector('h1')?.innerText,
    opacity: getComputedStyle(document.querySelector('h1 .hero-line-inner')).transform,
  })`);
  check('Reduced motion uses the static hero fallback', reducedState.canvas === 0 && Boolean(reducedState.heading), JSON.stringify(reducedState));
  await cdp.shot('verify-reduced-motion');

  await cdp.send('Emulation.setEmulatedMedia', { features: [] });
  await cdp.metrics(1920, 1080);
  await cdp.send('Page.navigate', { url: BASE });
  await sleep(3200);
  const wide = await cdp.evaluate(`({
    overflow: document.documentElement.scrollWidth > innerWidth,
    shell: document.querySelector('#home .shell')?.getBoundingClientRect().width,
    h1Width: document.querySelector('h1')?.getBoundingClientRect().width,
    nav: Boolean(document.querySelector('nav[aria-label="Primary"]')),
  })`);
  check('1920 layout keeps the shell constrained', !wide.overflow && wide.shell <= 1200, JSON.stringify(wide));
  await cdp.shot('verify-1920-hero');

  // Assets
  const assets = await cdp.evaluate(`Promise.all([
    fetch('/resume.pdf').then(r => r.ok && r.headers.get('content-type')),
    fetch('/og.png').then(r => r.ok && r.headers.get('content-type')),
    fetch('/favicon.svg').then(r => r.ok && r.headers.get('content-type')),
    fetch('/robots.txt').then(r => r.ok),
    fetch('/sitemap.xml').then(r => r.ok),
  ])`);
  check('Resume, OG image, favicon, robots and sitemap are served', assets.every(Boolean), JSON.stringify(assets));

  const ids = await cdp.evaluate(`(() => {
    const all = [...document.querySelectorAll('[id]')].map(el => el.id);
    return all.filter((id, i) => all.indexOf(id) !== i);
  })()`);
  check('No duplicate element ids', ids.length === 0, ids.join(','));

  await cdp.ws.close();
  chrome.kill('SIGTERM');

  const failed = results.filter((result) => !result.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  chrome.kill('SIGTERM');
  process.exitCode = 1;
});
