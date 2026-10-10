// Turns scripts/seed-links.mjs into content/items/*.json and public/thumbs/*.webp.
// For each link: fetch the page, read its title and description, pull the social image (og:image / twitter:image),
// resize it to 800x500 webp. Safe to re-run: existing items are skipped unless --force is passed.
//   node scripts/import-links.mjs [--force] [--only=slug,slug]
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import sharp from 'sharp';
import { seed } from './seed-links.mjs';
import { descriptions } from './descriptions.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const itemsDir = path.join(root, 'content', 'items');
const thumbsDir = path.join(root, 'public', 'thumbs');
const force = process.argv.includes('--force');
const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const only = onlyArg ? new Set(onlyArg.slice(7).split(',')) : null;
const today = new Date().toISOString().slice(0, 10);

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const exists = (p) => access(p).then(() => true, () => false);

function shorten(text, max = 120) {
  const t = (text || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const sentence = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
  if (sentence > 50) return cut.slice(0, sentence + 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:\-–—]$/, '') + '…';
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getPage(url) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, {
      headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml', 'accept-language': 'en-US,en;q=0.9' },
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    });
    if ((res.status === 429 || res.status === 503) && attempt < 3) {
      const wait = Math.min(Number(res.headers.get('retry-after')) * 1000 || 0, 10000) || 3000 * (attempt + 1);
      await sleep(wait);
      continue;
    }
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return { html: await res.text(), finalUrl: res.url };
  }
}

function readMeta(html, finalUrl) {
  const $ = cheerio.load(html);
  const m = (sel) => $(sel).first().attr('content')?.trim();
  const description = m('meta[property="og:description"]') || m('meta[name="description"]') || m('meta[name="twitter:description"]') || '';
  const rawImg = m('meta[property="og:image"]') || m('meta[property="og:image:url"]') || m('meta[name="twitter:image"]') || m('meta[name="twitter:image:src"]') || $('link[rel="image_src"]').attr('href');
  let image = null;
  if (rawImg) { try { image = new URL(rawImg, finalUrl).href; } catch { image = null; } }
  return { description, image };
}

async function saveThumb(imageUrl, pageUrl, file) {
  const res = await fetch(imageUrl, {
    headers: { 'user-agent': UA, referer: new URL(pageUrl).origin + '/', accept: 'image/*' },
    redirect: 'follow',
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) throw new Error('image HTTP ' + res.status);
  const type = res.headers.get('content-type') || '';
  if (!type.startsWith('image/')) throw new Error('not an image: ' + type);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > 12 * 1024 * 1024) throw new Error('image too large');
  const meta = await sharp(buf).metadata();
  if ((meta.width || 0) < 240) throw new Error('image too small: ' + meta.width);
  await sharp(buf).resize(800, 500, { fit: 'cover', position: 'centre' }).webp({ quality: 76 }).toFile(file);
}

async function importOne([name, url, category, tags, subcategory], index) {
  const slug = slugify(name);
  const itemFile = path.join(itemsDir, slug + '.json');
  if (!force && (await exists(itemFile))) return { slug, status: 'skipped' };
  const result = { slug, status: 'ok', thumb: false, notes: [] };
  let description = '';
  let image = null;
  try {
    const { html, finalUrl } = await getPage(url);
    ({ description, image } = readMeta(html, finalUrl));
  } catch (e) {
    result.status = 'page-failed';
    result.notes.push(String(e.message || e));
  }
  let thumbnail = null;
  if (image) {
    try {
      await saveThumb(image, url, path.join(thumbsDir, slug + '.webp'));
      thumbnail = `/thumbs/${slug}.webp`;
      result.thumb = true;
    } catch (e) {
      result.notes.push('thumb: ' + (e.message || e));
    }
  } else if (result.status === 'ok') {
    result.notes.push('thumb: no social image found');
  }
  const item = {
    slug, title: name, url, description: descriptions[slug] ?? shorten(description), category,
    ...(subcategory ? { subcategory } : {}),
    tags, thumbnail, addedAt: today, source: 'notion', order: index,
  };
  await writeFile(itemFile, JSON.stringify(item, null, 2) + '\n');
  return result;
}

async function main() {
  await mkdir(itemsDir, { recursive: true });
  await mkdir(thumbsDir, { recursive: true });
  const slugs = seed.map((r) => slugify(r[0]));
  const dup = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (dup.length) throw new Error('duplicate slugs: ' + dup.join(', '));
  const rows = seed.map((r, i) => [r, i]).filter(([r]) => !only || only.has(slugify(r[0])));
  const results = [];
  let next = 0;
  const worker = async () => {
    while (next < rows.length) {
      const [row, i] = rows[next++];
      const r = await importOne(row, i);
      results.push(r);
      console.log(`${String(results.length).padStart(3)}/${rows.length} ${r.status.padEnd(11)} ${r.thumb ? 'thumb' : '     '} ${r.slug}${r.notes.length ? '  (' + r.notes.join('; ') + ')' : ''}`);
    }
  };
  const cArg = process.argv.find((a) => a.startsWith('--c='));
  await Promise.all(Array.from({ length: cArg ? Number(cArg.slice(4)) : 6 }, worker));
  const report = {
    date: today,
    total: results.length,
    withThumbnail: results.filter((r) => r.thumb).length,
    pageFailed: results.filter((r) => r.status === 'page-failed').map((r) => ({ slug: r.slug, notes: r.notes })),
    noThumbnail: results.filter((r) => !r.thumb && r.status !== 'skipped').map((r) => ({ slug: r.slug, notes: r.notes })),
  };
  await writeFile(path.join(root, 'content', 'import-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(`\nDone. ${report.withThumbnail}/${report.total} thumbnails, ${report.pageFailed.length} pages failed.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
