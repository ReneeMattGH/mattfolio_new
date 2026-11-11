import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9333;
const BASE = process.env.SITE_URL ?? 'http://127.0.0.1:5174/';
const outDir = process.env.OUT_DIR ?? '/tmp/matt-shots';
const profile = mkdtempSync(join(tmpdir(), 'matt-cdp-'));

const gpu = process.env.GPU === '1';
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    ...(gpu
      ? ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
      : ['--disable-gpu']),
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    '--window-size=1440,900',
    'about:blank',
  ],
  { stdio: 'ignore' },
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForEndpoint() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) return;
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
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  }
}

async function capture(cdp, { name, width, height, target, scroll, wait = 900 }) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await cdp.send('Runtime.evaluate', { expression: 'window.scrollTo(0,0)' });
  await sleep(500);

  if (target) {
    await cdp.evaluate(`(() => {
      const el = document.getElementById(${JSON.stringify(target)});
      if (!el) return 'missing';
      const nav = document.querySelector('header');
      const offset = nav ? nav.getBoundingClientRect().height : 0;
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - offset - 8);
      return Math.round(window.scrollY);
    })()`);
  } else if (typeof scroll === 'number') {
    await cdp.evaluate(`window.scrollTo(0, ${scroll})`);
  }
  await sleep(wait);

  const shot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false,
  });
  writeFileSync(join(outDir, `${name}.png`), Buffer.from(shot.data, 'base64'));
  const info = await cdp.evaluate(
    '({y: Math.round(window.scrollY), h: document.documentElement.scrollHeight, w: innerWidth})',
  );
  console.log(name, JSON.stringify(info));
}

async function main() {
  await waitForEndpoint();
  const created = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent('about:blank')}`, {
    method: 'PUT',
  }).then((r) => r.json());
  const cdp = new Cdp(created.webSocketDebuggerUrl);
  await cdp.ready;
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Log.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await cdp.send('Page.navigate', { url: BASE });
  await sleep(4500);

  const errors = cdp.events
    .filter((event) => ['Runtime.exceptionThrown', 'Log.entryAdded'].includes(event.method))
    .map((event) => JSON.stringify(event.params).slice(0, 400));
  console.log('CONSOLE_EVENTS', errors.length ? errors : 'none');

  await capture(cdp, { name: '1440-hero', width: 1440, height: 900 });
  await capture(cdp, { name: '1440-about', width: 1440, height: 900, target: 'about' });
  await capture(cdp, { name: '1440-experience', width: 1440, height: 900, target: 'experience' });
  await capture(cdp, { name: '1440-projects', width: 1440, height: 900, target: 'projects' });
  await capture(cdp, { name: '1440-projects-end', width: 1440, height: 900, target: 'projects', scroll: undefined, wait: 900 });
  await cdp.evaluate("window.scrollTo(0, document.getElementById('projects').offsetTop + 2600)");
  await sleep(900);
  const shot = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  writeFileSync(join(outDir, '1440-projects-mid.png'), Buffer.from(shot.data, 'base64'));

  await capture(cdp, { name: '1440-achievements', width: 1440, height: 900, target: 'achievements' });
  await capture(cdp, { name: '1440-skills', width: 1440, height: 900, target: 'skills' });
  await capture(cdp, { name: '1440-github', width: 1440, height: 900, target: 'github' });
  await capture(cdp, { name: '1440-contact', width: 1440, height: 900, target: 'contact' });

  await capture(cdp, { name: '768-hero', width: 768, height: 1024 });
  await capture(cdp, { name: '768-projects', width: 768, height: 1024, target: 'projects' });
  await capture(cdp, { name: '360-hero', width: 360, height: 780 });
  await capture(cdp, { name: '360-projects', width: 360, height: 780, target: 'projects' });
  await capture(cdp, { name: '360-contact', width: 360, height: 780, target: 'contact' });

  const interactive = await cdp.evaluate(`(() => {
    const header = document.querySelector('header');
    const buttons = [...header.querySelectorAll('button, a')].map((el) => el.textContent.trim());
    return {
      headerHeight: header.getBoundingClientRect().height,
      headerButtons: buttons,
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      images: [...document.images].length,
      h1: document.querySelector('h1')?.textContent,
      bodyFont: getComputedStyle(document.body).fontFamily,
    };
  })()`);
  console.log('PAGE', JSON.stringify(interactive, null, 2));

  cdp.ws.close();
  chrome.kill('SIGTERM');
}

main().catch((error) => {
  console.error(error);
  chrome.kill('SIGTERM');
  process.exitCode = 1;
});
