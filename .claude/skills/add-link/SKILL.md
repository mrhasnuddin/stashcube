---
name: add-link
description: Add one or more links to the Stashcube library. Use when the user pastes a URL (or a list of URLs) to save, or says "add this to the stash", "save these links", "put this under UI Libraries".
---

# Add a link to Stashcube

The library is plain files in this repo: `content/items/<slug>.json` for each link, `public/thumbs/<slug>.webp` for its picture, and `content/taxonomy.json` for the categories. There is no database. The site reads these files at build time.

## Steps

1. **Pick the category.** Read `content/taxonomy.json`. Choose the best fit from what the link is for, not where it was found. If the fit is unclear, ask the user one short question. Inspiration links also need a sub-category (`galleries`, `web3-crypto`, `studios-agencies`, `portfolios`, `saas-ai`, `other`).
2. **Choose 2 to 4 tags.** Lowercase, short, specific: the stack (`react`, `three.js`, `tailwind`), the form (`icons`, `shaders`, `directory`), the price when it matters (`free`, `open-source`). Reuse tags that already exist in `content/items/` before inventing new ones.
3. **Run the script** (it reads the page, saves a thumbnail from the social image or a Chrome screenshot, and writes the item):

   ```bash
   node scripts/add-link.mjs <url> --category=<slug> [--sub=<slug>] [--tags=a,b,c] [--name="Name"] [--desc="One line."]
   ```

   Run it once per link. Add `--force` only when the user wants a duplicate. Without `--category` it prints the category list.
4. **Write the description yourself.** The fetched description is usually marketing copy. Replace it with one plain sentence, under about 100 characters, that says what the link is and what it is for. Pass it with `--desc=` or edit the JSON afterwards. No hype words ("powerful", "seamless", "cutting-edge"), no lists of three, no closing flourish. Use the `humanizer` skill if the draft sounds generated.
5. **Check the result.** Open `content/items/<slug>.json`. Confirm title, description, category and tags. Confirm `thumbnail` is set; if it is `null`, the site shows a pixel pattern, which is fine, but tell the user.
6. **Preview** with `npm run dev` and open `/c/<category>`, or run `npm run build` to be sure every page still prerenders.
7. **Deploy** only if the user asks. Commit the new JSON and thumbnail together.

## Batches

For many links at once, run the script once per link. Pause between calls to the same site. If a site blocks the fetch (HTTP 403 or 429), the script falls back to Chrome automatically.

## Notes

- Thumbnails are 800x500 webp, cropped to fill. They are the site's own images and belong to those sites.
- `status` in an item can be `favorite`, `to-review` or `archived` (archived items are hidden).
- The "NEW" mark is computed from `addedAt`; do not edit it by hand.
- Do not rename a slug after publishing; it is the URL.
