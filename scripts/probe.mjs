import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9335;
const profile = mkdtempSync(join(tmpdir(), 'matt-probe-'));
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  let page;
  for (let i = 0; i < 50; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' });
      if (res.ok) {
        page = await res.json();
        break;
      }
    } catch {}
    await sleep(200);
  }
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      const { resolve } = pending.get(m.id);
      pending.delete(m.id);
      resolve(m.result);
    }
  });
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const next = ++id;
      pending.set(next, { resolve });
      ws.send(JSON.stringify({ id: next, method, params }));
    });
  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return r.result?.value;
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 360,
    height: 780,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send('Page.navigate', { url: 'http://127.0.0.1:5174/' });
  await sleep(3800);

  const report = await evaluate(`(() => {
    const vw = innerWidth;
    const out = {
      innerWidth: vw,
      docScroll: document.documentElement.scrollWidth,
      bodyScroll: document.body.scrollWidth,
      sections: [...document.querySelectorAll('section, header, footer')].map((el) => ({
        tag: el.tagName.toLowerCase(),
        id: el.id,
        scroll: el.scrollWidth,
        client: el.clientWidth,
      })).filter((s) => s.scroll > vw),
    };
    const hideTest = (selector, label) => {
      const nodes = [...document.querySelectorAll(selector)];
      const before = document.documentElement.scrollWidth;
      nodes.forEach((el) => (el.style.display = 'none'));
      const after = document.documentElement.scrollWidth;
      nodes.forEach((el) => (el.style.display = ''));
      return { label, count: nodes.length, before, after };
    };
    out.tests = [
      hideTest('.marquee', 'marquee'),
      hideTest('.outline-wordmark', 'footer wordmark'),
      hideTest('canvas', 'canvas'),
    ];
    const contact = document.getElementById('contact');
    out.contactChildren = [...contact.querySelectorAll('*')].map((el) => {
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName.toLowerCase(),
        cls: (el.className && String(el.className).slice(0, 100)) || '',
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
        text: (el.textContent || '').trim().slice(0, 50),
      };
    }).filter((b) => b.right > vw + 1 || b.left < -1).slice(0, 15);
    out.contactGrids = [...contact.querySelectorAll('*')].map((el) => ({
      tag: el.tagName.toLowerCase(),
      cls: (el.className && String(el.className).slice(0, 80)) || '',
      scroll: el.scrollWidth,
      client: el.clientWidth,
    })).filter((b) => b.scroll > vw).slice(0, 15);
    return out;
  })()`);
  console.log(JSON.stringify(report, null, 2));

  ws.close();
  chrome.kill('SIGTERM');
}

main().catch((e) => {
  console.error(e);
  chrome.kill('SIGTERM');
});
