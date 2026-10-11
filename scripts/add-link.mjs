// Add one link to the stash: reads the page, saves a thumbnail, writes content/items/<slug>.json.
//   node scripts/add-link.mjs <url> --category=<slug> [--sub=<slug>] [--tags=a,b,c] [--name="Name"] [--desc="One line."] [--pick] [--status=coming-soon] [--force]
// Thumbnail: the page's social image if it has one, otherwise a screenshot taken in your installed Chrome.
// Categories live in content/taxonomy.json. Run without --category to list them.
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const itemsDir = path.join(root, 'content', 'items');
const thumbsDir = path.join(root, 'public', 'thumbs');
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

const args = process.argv.slice(2);
const flag = (n) => args.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3);
const has = (n) => args.includes(`--${n}`);
const url = args.find((a) => /^https?:\/\//.test(a));
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const taxonomy = JSON.parse(await readFile(path.join(root, 'content', 'taxonomy.json'), 'utf8'));
const categories = taxonomy.groups.flatMap((g) => g.categories.map((c) => ({ ...c, group: g.name })));

function listCategories() {
  for (const c of categories) {
    console.log(`  ${c.slug.padEnd(18)} ${c.group} / ${c.name}${c.subcategories ? '   subs: ' + c.subcategories.map((s) => s.slug).join(', ') : ''}`);
  }
}

if (!url) { console.error('Usage: node scripts/add-link.mjs <url> --category=<slug> [--sub=<slug>] [--tags=a,b] [--name="Name"] [--desc="One line."]\n\nCategories:'); listCategories(); process.exit(2); }
// A github.com link goes to the GitHub tab unless told otherwise
const category = flag('category') ?? (url && new URL(url).hostname === 'github.com' ? 'github' : undefined);
const cat = categories.find((c) => c.slug === category);
if (!cat) { console.error(category ? `Unknown category "${category}".` : 'Missing --category.', 'Pick one of:'); listCategories(); process.exit(2); }
const status = flag('status');
if (status && !['favorite', 'to-review', 'archived', 'coming-soon'].includes(status)) { console.error(`Unknown --status "${status}". Use favorite, to-review, archived or coming-soon.`); process.exit(2); }
const sub = flag('sub');
if (sub && !cat.subcategories?.some((s) => s.slug === sub)) { console.error(`"${sub}" is not a sub-category of ${cat.slug}.`); process.exit(2); }
if (cat.subcategories && !sub) console.warn(`Note: ${cat.slug} has sub-categories (${cat.subcategories.map((s) => s.slug).join(', ')}). Add --sub=... to file it properly.`);

// duplicates
const existing = await Promise.all((await readdir(itemsDir)).filter((f) => f.endsWith('.json')).map(async (f) => JSON.parse(await readFile(path.join(itemsDir, f), 'utf8'))));
const norm = (u) => new URL(u).hostname.replace(/^www\./, '') + new URL(u).pathname.replace(/\/$/, '');
const dupe = existing.find((i) => norm(i.url) === norm(url));
if (dupe && !has('force')) { console.error(`Already in the stash as "${dupe.title}" (${dupe.slug}). Use --force to add it anyway.`); process.exit(3); }

function shorten(text, max = 120) {
  const t = (text || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const s = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
  return s > 50 ? cut.slice(0, s + 1) : cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:\-–—]$/, '') + '…';
}

let title = flag('name') || '';
let description = flag('desc') || '';
let imageUrl = null;
try {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html', 'accept-language': 'en-US,en;q=0.9' }, redirect: 'follow', signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const $ = cheerio.load(await res.text());
  const m = (s) => $(s).first().attr('content')?.trim();
  if (!title) title = (m('meta[property="og:site_name"]') || $('title').first().text().split(/[|·–—]| - /)[0] || '').trim();
  if (!description) description = shorten(m('meta[property="og:description"]') || m('meta[name="description"]') || '');
  const raw = m('meta[property="og:image"]') || m('meta[name="twitter:image"]') || $('link[rel="image_src"]').attr('href');
  if (raw) imageUrl = new URL(raw, res.url).href;
} catch (e) {
  console.warn('Plain fetch failed (' + (e.message || e) + '), will try Chrome.');
}

const slug = slugify(title || new URL(url).hostname.replace(/^www\./, ''));
if (existing.some((i) => i.slug === slug)) { console.error(`Slug "${slug}" is taken. Pass a different --name.`); process.exit(3); }
await mkdir(thumbsDir, { recursive: true });
const out = path.join(thumbsDir, slug + '.webp');
let thumbnail = null;

if (imageUrl) {
  try {
    const r = await fetch(imageUrl, { headers: { 'user-agent': UA, referer: new URL(url).origin + '/', accept: 'image/*' }, signal: AbortSignal.timeout(25000) });
    if (!r.ok || !(r.headers.get('content-type') || '').startsWith('image/')) throw new Error('not an image');
    const buf = Buffer.from(await r.arrayBuffer());
    if (((await sharp(buf).metadata()).width || 0) < 240) throw new Error('too small');
    await sharp(buf).resize(800, 500, { fit: 'cover', position: 'centre' }).webp({ quality: 76 }).toFile(out);
    thumbnail = `/thumbs/${slug}.webp`;
  } catch (e) { console.warn('Social image unusable (' + (e.message || e) + '), will try a screenshot.'); }
}

if (!thumbnail || !title || !description) {
  try {
    const { chromium } = await import('playwright-core');
    const browser = await chromium.launch({ executablePath: CHROME, headless: true });
    const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: 'en-US' })).newPage();
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3500);
    if (!title) title = (await page.title()).split(/[|·–—]| - /)[0].trim();
    if (!description) description = shorten(await page.evaluate(() => document.querySelector('meta[property="og:description"]')?.content || document.querySelector('meta[name="description"]')?.content || ''));
    if (!thumbnail && res && res.status() < 400) {
      await sharp(await page.screenshot({ type: 'jpeg', quality: 85 })).resize(800, 500, { fit: 'cover', position: 'top' }).webp({ quality: 76 }).toFile(out);
      thumbnail = `/thumbs/${slug}.webp`;
    }
    await browser.close();
  } catch (e) { console.warn('Chrome pass failed: ' + (e.message || e)); }
}

const finalSlug = slugify(title || slug);
const item = {
  slug: finalSlug, title: title || slug, url, description, category: cat.slug,
  ...(sub ? { subcategory: sub } : {}),
  tags: (flag('tags') || '').split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
  ...(has('pick') ? { pick: true } : {}),
  ...(status ? { status } : {}),
  thumbnail, addedAt: new Date().toISOString().slice(0, 10), source: 'manual',
  order: Math.max(-1, ...existing.map((i) => i.order)) + 1,
};
await writeFile(path.join(itemsDir, finalSlug + '.json'), JSON.stringify(item, null, 2) + '\n');
console.log(`Added "${item.title}" (${finalSlug}) to ${cat.group} / ${cat.name}${sub ? ' / ' + sub : ''}`);
console.log(`  description: ${item.description || '(none found, add one with --desc or edit the JSON)'}`);
console.log(`  thumbnail:   ${thumbnail || '(none, a pixel placeholder will show)'}`);
console.log(`  tags:        ${item.tags.join(', ') || '(none)'}`);
