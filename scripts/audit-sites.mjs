// Visits every link in your installed Chrome and records what each site says about itself:
// title, meta description, first headings and the first few hundred characters of visible text.
// Used to double-check categories by hand. Output is JSON.
//   node scripts/audit-sites.mjs <out.json> [--only=slug,slug]
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const itemsDir = path.join(root, 'content', 'items');
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const out = process.argv[2];
if (!out) { console.error('Usage: node scripts/audit-sites.mjs <out.json> [--only=slug,slug]'); process.exit(2); }
const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const only = onlyArg ? new Set(onlyArg.slice(7).split(',')) : null;

const items = [];
for (const f of (await readdir(itemsDir)).filter((f) => f.endsWith('.json'))) {
  const i = JSON.parse(await readFile(path.join(itemsDir, f), 'utf8'));
  if (!only || only.has(i.slug)) items.push(i);
}

const browser = await chromium.launch({ executablePath: CHROME, headless: !process.env.HEADED, args: ['--disable-blink-features=AutomationControlled'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: 'en-US' });
const results = [];
let next = 0;

async function work() {
  while (next < items.length) {
    const item = items[next++];
    const page = await context.newPage();
    const r = { slug: item.slug, url: item.url, category: item.category, subcategory: item.subcategory || null };
    try {
      const res = await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      r.status = res ? res.status() : null;
      await page.waitForTimeout(Number(process.env.WAIT) || 3000);
      Object.assign(r, await page.evaluate(() => {
        const m = (s) => document.querySelector(s)?.getAttribute('content')?.trim() || '';
        const norm = (t) => (t || '').replace(/\s+/g, ' ').trim();
        return {
          title: norm(document.title),
          meta: norm(m('meta[property="og:description"]') || m('meta[name="description"]')),
          h: [...document.querySelectorAll('h1,h2')].slice(0, 4).map((h) => norm(h.textContent)).filter(Boolean),
          text: norm(document.body ? document.body.innerText : '').slice(0, 420),
        };
      }));
    } catch (e) {
      r.error = String(e.message || e).split('\n')[0];
    }
    await page.close();
    results.push(r);
    console.log(`${String(results.length).padStart(3)}/${items.length} ${r.error ? 'ERR ' : (r.status || '') + ' '}${r.slug}`);
  }
}
await Promise.all(Array.from({ length: 4 }, work));
await browser.close();
results.sort((a, b) => a.slug.localeCompare(b.slug));
await writeFile(out, JSON.stringify(results, null, 1));
console.log('wrote', out);
