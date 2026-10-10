// Writes the hand-written one-liners from scripts/descriptions.mjs into content/items/*.json.
//   node scripts/apply-descriptions.mjs
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { descriptions } from './descriptions.mjs';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'content', 'items');
const files = (await readdir(dir)).filter((f) => f.endsWith('.json'));
const slugs = new Set(files.map((f) => f.replace(/\.json$/, '')));
const unknown = Object.keys(descriptions).filter((s) => !slugs.has(s));
if (unknown.length) console.warn('descriptions for unknown slugs:', unknown.join(', '));
let changed = 0;
const stillEmpty = [];
for (const f of files) {
  const file = path.join(dir, f);
  const item = JSON.parse(await readFile(file, 'utf8'));
  const d = descriptions[item.slug];
  if (d && d !== item.description) { item.description = d; await writeFile(file, JSON.stringify(item, null, 2) + '\n'); changed++; }
  if (!item.description) stillEmpty.push(item.slug);
}
console.log(`updated ${changed} descriptions. Still empty: ${stillEmpty.join(', ') || 'none'}`);
