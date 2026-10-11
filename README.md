# Stashcube

A public library of links: UI libraries, 3D tools, icons, fonts, inspiration and AI skills. Next.js 16, content as plain files, no database.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # prerenders every category and item page
```

## Content
- Links: `content/items/<slug>.json`. Pictures: `public/thumbs/<slug>.webp`. Categories: `content/taxonomy.json`.
- Add a link: `node scripts/add-link.mjs <url> --category=<slug> [--sub=<slug>] [--tags=a,b] [--desc="One line."]`
  (or ask Claude Code in this folder; the `add-link` skill does it). Run it with no category to list the options.
- Thumbnails: the page's social image, or a screenshot taken in your installed Chrome (set `CHROME_PATH` if Chrome is elsewhere).
- First import from Notion: `scripts/seed-links.mjs` + `scripts/import-links.mjs`, then `scripts/browser-fill.mjs`. Hand-written one-liners: `scripts/descriptions.mjs`, applied with `node scripts/apply-descriptions.mjs`.

## Design system
Tokens live in `design/design-tokens.json`. After editing them run `npm run tokens`. The style guide is `design/preview.html` (open it through any static server). Decisions are written up in `docs/DESIGN.md`; the site structure is in `docs/IA.md`.

## Environment
`NEXT_PUBLIC_SITE_URL` sets the canonical URL used for metadata, the sitemap, robots.txt and share images. Set it to the real domain once one is attached. On Vercel it falls back to the production URL Vercel provides, and elsewhere to `http://localhost:3000`.

Share images and icons: `node scripts/make-brand-assets.mjs` redraws `public/og/stashcube-og.png` (1200x630, 1.91:1) and `stashcube-og-square.png` (1200x1200, 1:1), `src/app/favicon.ico`, `src/app/apple-icon.png` and the manifest icons in `public/icons/`. Run it after changing the logo or the tagline. Page tags come from `pageMeta()` in `src/lib/site.ts`.
