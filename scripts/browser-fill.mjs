// Second pass for links that plain fetch could not read (bot protection, no social image, JS-only pages).
// Opens each page in your installed Chrome, reads the title and description from the rendered page,
// and takes a screenshot as the thumbnail. Only fills what is missing; never overwrites an existing thumbnail or description.
//   node scripts/browser-fill.mjs [--only=slug,slug]
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const itemsDir = path.join(root, 'content', 'items');
const thumbsDir = path.join(root, 'public', 'thumbs');
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const only = onlyArg ? new Set(onlyArg.slice(7).split(',')) : null;

function shorten(text, max = 120) {
  const t = (text || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const sentence = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
  if (sentence > 50) return cut.slice(0, sentence + 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:\-–—]$/, '') + '…';
}

const files = (await readdir(itemsDir)).filter((f) => f.endsWith('.json'));
const todo = [];
for (const f of files) {
  const item = JSON.parse(await readFile(path.join(itemsDir, f), 'utf8'));
  if (only && !only.has(item.slug)) continue;
  if (!item.thumbnail || !item.description) todo.push({ file: path.join(itemsDir, f), item });
}
console.log(`${todo.length} items to fill`);

const browser = await chromium.launch({ executablePath: CHROME, headless: !process.env.HEADED, args: ['--disable-blink-features=AutomationControlled'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: 'en-US' });
let next = 0;
const report = [];

async function work() {
  while (next < todo.length) {
    const { file, item } = todo[next++];
    const page = await context.newPage();
    const out = { slug: item.slug, thumb: false, description: false, error: null };
    try {
      const res = await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      out.status = res ? res.status() : null;
      await page.waitForTimeout(Number(process.env.WAIT) || 3500);
      if (!item.description) {
        const d = await page.evaluate(() => {
          const m = (s) => document.querySelector(s)?.getAttribute('content')?.trim();
          return m('meta[property="og:description"]') || m('meta[name="description"]') || '';
        });
        if (d) { item.description = shorten(d); out.description = true; }
      }
      const title = await page.title();
      const blocked = /(429|403|404|too many|forbidden|not found|just a moment|attention required|access denied)/i.test(title);
      if (!item.thumbnail && !blocked) {
        const buf = await page.screenshot({ type: 'jpeg', quality: 85 });
        await sharp(buf).resize(800, 500, { fit: 'cover', position: 'top' }).webp({ quality: 76 }).toFile(path.join(thumbsDir, item.slug + '.webp'));
        item.thumbnail = `/thumbs/${item.slug}.webp`;
        out.thumb = true;
      }
      await writeFile(file, JSON.stringify(item, null, 2) + '\n');
    } catch (e) {
      out.error = String(e.message || e).split('\n')[0];
    }
    await page.close();
    report.push(out);
    console.log(`${String(report.length).padStart(3)}/${todo.length} ${out.thumb ? 'thumb' : '     '} ${out.description ? 'desc' : '    '} ${out.slug}${out.status && out.status >= 400 ? ' (HTTP ' + out.status + ')' : ''}${out.error ? ' ERROR ' + out.error : ''}`);
  }
}
await Promise.all(Array.from({ length: 3 }, work));
await browser.close();
const missing = report.filter((r) => !r.thumb);
console.log(`\nDone. ${report.filter((r) => r.thumb).length} screenshots. Still without thumbnail: ${missing.map((r) => r.slug).join(', ') || 'none'}`);
