# Stashcube: Information Architecture

A public, curated library of links (UI libraries, 3D tools, icons, fonts, inspiration, AI skills) browsed as galleries grouped by category. As built, October 2026.

## Principles
- Every link is an **item**. Categories are **galleries** of items. Tags and sub-categories narrow a gallery.
- Public site. Content is plain files in the repo (git is the CMS). No database.
- Structure borrowed from ArtCraft (grouped sidebar, breadcrumb, badges), Theme Toggles (tile grid with hairline container lines) and cult ui (item page anatomy). Theme and branding are not borrowed.

## Sitemap
```
/                      Home: hero, category grid, latest additions
/c/[category]          Category gallery, with sub-category and tag filters (?sub=...&tag=...)
/item/[slug]           Item page: preview, description, tags, visit and copy-link, related, prev/next
/new                   Recently added feed
/picks                 My go-to stack: the most-used and most-recommended links, grouped by category
/changelog             What changed, newest first (content/changelog.json)
/search                Live client-side search (?q=...), also reached from the header box or the / key
/about                 What this is and how links are kept
/sitemap.xml, /robots.txt
```
Every route is prerendered at build time (one page per category and per item).

Not built yet, from the earlier plan: `/tags/[tag]`, `/collections`, sub-category routes (they are filters instead), a command palette, favorites row (no item is marked `favorite` yet).

## Navigation
Persistent left sidebar with grouped sections (small uppercase labels), Home, Recently added and My go-to stack on top, Changelog at the bottom, a pixel marker at the right edge of each entry (see `docs/DESIGN.md`), NEW badge on categories that have new items. A breadcrumb and search box sit at the top of every page. Categories with no links are hidden.

| Group | Categories |
|---|---|
| Build | UI Components (Libraries, Single components), Icons and Illustrations, Fonts, Templates and Mockups, GitHub |
| Create | 3D Tools, Colors and Effects (Colors and gradients, Shaders and effects), Motion |
| Brand | Logos, Inspiration (websites grouped by industry: Galleries, UI Details, Web3 and Crypto, SaaS and AI, 3D and Immersive, Architecture, Corporate and Industrial, Studios and Agencies, Film and Entertainment, Portfolios) |
| AI | Skills and Prompts (Skills and DESIGN.md, Prompts), MCP and Agents |
| Learn | Learning, Tools and Utilities |

The source of truth is `content/taxonomy.json`.

## Item data (`content/items/<slug>.json`)
| Field | Notes |
|---|---|
| `slug`, `title`, `url` | Slug is the URL; do not rename it after publishing |
| `description` | One plain sentence, written by hand (see `scripts/descriptions.mjs`) |
| `category`, `subcategory?` | One category; sub-category only where the category defines them |
| `tags[]` | Lowercase, short |
| `thumbnail` | `/thumbs/<slug>.webp` (800x500), or `null` for the pixel placeholder |
| `pricing?`, `status?`, `pick?`, `notes?` | `status`: `favorite`, `to-review`, `coming-soon` (shows a COMING SOON mark), `archived` (hidden). `pick: true` adds the link to My go-to stack and shows a PICK mark |
| `addedAt`, `source`, `order` | `addedAt` is a date for the first import and a full ISO timestamp for links added later. Only links with a timestamp get the NEW mark, for 4 days after they are added (decided in the browser by `NewBadge`) |

## Content workflow
- First import: `scripts/seed-links.mjs` (from the two Notion pages, deduplicated) through `scripts/import-links.mjs`, then `scripts/browser-fill.mjs` for sites that block plain requests. `scripts/apply-descriptions.mjs` writes the hand-written one-liners.
- Day to day: the project skill `.claude/skills/add-link` runs `node scripts/add-link.mjs <url> --category=... --tags=...`, which reads the page, saves a thumbnail (social image, or a Chrome screenshot) and writes the item.
- Deploy: build with `npm run build`; hosted on Vercel.
