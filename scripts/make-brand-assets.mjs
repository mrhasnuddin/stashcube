// Builds the share images and app icons from the brand files.
//   node scripts/make-brand-assets.mjs
// Output:
//   public/og/stashcube-og.png         1200x630  (1.91:1, standard link preview: Open Graph, X, Slack, LinkedIn, Facebook)
//   public/og/stashcube-og-square.png  1200x1200 (1:1, WhatsApp, Telegram, iMessage, X summary card)
//   src/app/favicon.ico                16, 32 and 48 px
//   src/app/apple-icon.png             180 px
//   public/icons/icon-192.png, icon-512.png   web app manifest
// The share images use the same dithered corner texture as the site. They carry no counts, so they do not go stale.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const tileSvg = await readFile(path.join(root, 'brand', 'stashcube-tile.svg'), 'utf8');

const page = (w, h, square) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Martian+Mono:wght@500&display=block" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0}
body{width:${w}px;height:${h}px;background:#0A0A0A;color:#F5F5F5;position:relative;overflow:hidden;font-family:'Bricolage Grotesque',sans-serif}
canvas{position:absolute;inset:0}
.in{position:absolute;inset:0;padding:${square ? 96 : 72}px;display:flex;flex-direction:column;justify-content:space-between}
.logo{display:flex;align-items:center;gap:${square ? 28 : 22}px}
.logo svg{width:${square ? 90 : 75}px;height:${square ? 90 : 75}px}
.word{font-weight:800;letter-spacing:-0.03em;font-size:${square ? 76 : 62}px;line-height:1}
.word b{color:#95D914;font-weight:800}
h1{font-weight:800;letter-spacing:-0.035em;line-height:1.02;font-size:${square ? 118 : 76}px;max-width:${square ? 960 : 860}px;text-wrap:balance}
h1 .nb{white-space:nowrap}
h1 em{font-style:normal;color:#95D914}
.foot{font-family:'Martian Mono',monospace;font-weight:500;text-transform:uppercase;letter-spacing:.08em;font-size:${square ? 25 : 20}px;color:#8C8C8C;display:flex;flex-direction:${square ? "column" : "row"};gap:${square ? 14 : 28}px;align-items:${square ? "flex-start" : "center"};margin-top:${square ? 56 : 36}px;white-space:nowrap}
.foot .row{display:flex;gap:18px;align-items:center}
.foot .row i{width:8px;height:8px;background:#95D914;display:block}
.foot>span{color:#F5F5F5}
</style></head><body>
<canvas id="c" width="${w}" height="${h}"></canvas>
<div class="in">
  <div class="logo">${tileSvg.replace(/<title>.*?<\/title>/, '').replace(/ width="15" height="15"/, '')}<div class="word">stash<b>cube</b></div></div>
  <div>
    <h1>Tools and libraries for <em><span class="nb">AI-native</span> designers and builders.</em></h1>
    <div class="foot"><div class="row"><i></i>UI · 3D · Icons · Fonts · AI skills</div><span>Curated by DeanStudio</span></div>
  </div>
</div>
<script>
// same ordered (Bayer 8x8) dither as src/components/PixelTexture.tsx, scaled up for the share image
const B8=(()=>{let m=[[0]];for(let n=1;n<8;n*=2){const t=[];for(let y=0;y<2*n;y++){t[y]=[];for(let x=0;x<2*n;x++)t[y][x]=4*m[y%n][x%n]+(y<n?(x<n?0:2):(x<n?3:1))}m=t}return m})();
const rng=s=>()=>{s|=0;s=(s+0x6d2b79f5)|0;let t=Math.imul(s^(s>>>15),1|s);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296};
const noise=(a,b,s)=>(Math.sin(a*.37+b*.21+s)+Math.sin(a*.11-b*.43+s*2.3)+Math.sin(a*.07+b*.05+s*5.1))/3;
const cv=document.getElementById('c'),ctx=cv.getContext('2d'),w=${w},h=${h},cell=${square ? 20 : 16},rnd=rng(7);
const shades=[[.78,'#95D914'],[.55,'#6C9E0E'],[.3,'#4A6D0A'],[0,'#33480A']];
for(let j=0;j<Math.ceil(h/cell);j++)for(let i=0;i<Math.ceil(w/cell);i++){
  const x=i*cell,y=j*cell,f=1-Math.hypot((w-x)/(w*.7),(y/h)*${square ? 1.6 : 1.9})+noise(i,j,3)*.28;
  if(f<=0||f<=(B8[j%8][i%8]+.5)/64)continue;
  let c=shades.find(s=>f>=s[0])[1];if(f>.35&&rnd()<.025)c='#C2F25A';
  ctx.fillStyle=c;ctx.fillRect(x,y,cell-2,cell-2)}
</script></body></html>`;

await mkdir(path.join(root, 'public', 'og'), { recursive: true });
await mkdir(path.join(root, 'public', 'icons'), { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME });
for (const [file, w, h, square] of [
  ['stashcube-og.png', 1200, 630, false],
  ['stashcube-og-square.png', 1200, 1200, true],
]) {
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.setContent(page(w, h, square), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(root, 'public', 'og', file) });
  await p.close();
  console.log('wrote public/og/' + file);
}
await browser.close();

// icons: the lime tile, nearest-neighbour from its 15x15 grid so the pixels stay sharp
const tile15 = await sharp(Buffer.from(tileSvg), { density: 72 }).png().toBuffer();
const scaled = (size) => sharp(tile15).resize(size, size, { kernel: 'nearest' });
// padded on black, for the home-screen and manifest icons (the tile sits inside the safe zone)
const padded = async (size) => {
  const inner = Math.floor((size * 0.62) / 15) * 15;
  return sharp({ create: { width: size, height: size, channels: 4, background: '#0A0A0A' } })
    .composite([{ input: await scaled(inner).png().toBuffer(), gravity: 'center' }])
    .png()
    .toBuffer();
};
await writeFile(path.join(root, 'src', 'app', 'apple-icon.png'), await padded(180));
await writeFile(path.join(root, 'public', 'icons', 'icon-192.png'), await padded(192));
await writeFile(path.join(root, 'public', 'icons', 'icon-512.png'), await padded(512));

// favicon.ico with PNG frames (16, 32, 48)
const sizes = [16, 32, 48];
const frames = await Promise.all(sizes.map((s) => sharp(Buffer.from(tileSvg), { density: (72 * s) / 15 }).resize(s, s).png().toBuffer()));
const head = Buffer.alloc(6 + 16 * sizes.length);
head.writeUInt16LE(1, 2);
head.writeUInt16LE(sizes.length, 4);
let offset = head.length;
sizes.forEach((s, i) => {
  const o = 6 + 16 * i;
  head[o] = s;
  head[o + 1] = s;
  head.writeUInt16LE(1, o + 4);
  head.writeUInt16LE(32, o + 6);
  head.writeUInt32LE(frames[i].length, o + 8);
  head.writeUInt32LE(offset, o + 12);
  offset += frames[i].length;
});
await writeFile(path.join(root, 'src', 'app', 'favicon.ico'), Buffer.concat([head, ...frames]));
console.log('wrote favicon.ico, apple-icon.png, icons 192 and 512');
