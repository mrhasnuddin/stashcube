---
name: add-link
description: Add one or more links to the Stashcube library. Use when the user pastes a URL (or a list of URLs) to save, or says "add this to the stash", "save these links", "put this under UI Libraries".
---

# Add a link to Stashcube

The library is plain files in this repo: `content/items/<slug>.json` for each link, `public/thumbs/<slug>.webp` for its picture, and `content/taxonomy.json` for the categories. There is no database. The site reads these files at build time.

## Steps

1. **Pick the category.** Any `github.com` link goes to the GitHub category (`--category=github`, and the script picks it by default). Read `content/taxonomy.json`. Choose the best fit from what the link is for, not where it was found. If the fit is unclear, ask the user one short question. Every category with groups (sub-categories) needs one; the script lists them when run without `--category`. Website Inspiration (`inspiration`) is one standout website under the industry it is for; Galleries (`galleries`) is a library or collection of sites, like Awwwards or Lapa Ninja. A link can live in more than one place: pick the main category and group, then add the others with `--also=category:group,category2:group2` (a github.com link is also listed under GitHub automatically, in `skills-plugins` unless you say otherwise).
2. **Choose 2 to 4 tags.** Lowercase, short, specific: the stack (`react`, `three.js`, `tailwind`), the form (`icons`, `shaders`, `directory`), the price when it matters (`free`, `open-source`). Reuse tags that already exist in `content/items/` before inventing new ones.
3. **Run the script** (it reads the page, saves a thumbnail from the social image or a Chrome screenshot, and writes the item):

   ```bash
   node scripts/add-link.mjs <url> --category=<slug> [--sub=<slug>] [--tags=a,b,c] [--name="Name"] [--desc="One line."] [--pick] [--status=coming-soon]
   ```

   Add `--pick` when the user says the link is one of their go-to tools (it appears on the "My go-to stack" page). For a skill or plugin, add the install command from its README with `--install="..."` (repeat the flag for several lines). It shows in the list view and on the item page with a copy button. Use the Claude Code command when the README gives one.

   Add `--status=coming-soon` when the site is not live yet (the tile and item page show a COMING SOON mark).

   Run it once per link. Add `--force` only when the user wants a duplicate. Without `--category` it prints the category list.
4. **Write the description yourself.** The fetched description is usually marketing copy. Replace it with one plain sentence, under about 100 characters, that says what the link is and what it is for. Pass it with `--desc=` or edit the JSON afterwards. No hype words ("powerful", "seamless", "cutting-edge"), no lists of three, no closing flourish. Use the `humanizer` skill if the draft sounds generated.
5. **Check the result.** Open `content/items/<slug>.json`. Confirm title, description, category and tags. Confirm `thumbnail` is set; if it is `null`, the site shows a pixel pattern, which is fine, but tell the user.
6. **Preview** with `npm run dev` and open `/c/<category>`, or run `npm run build` to be sure every page still prerenders.
7. **Deploy** only if the user asks. Commit the new JSON and thumbnail together.

## Batches

For many links at once, run the script once per link. Pause between calls to the same site. If a site blocks the fetch (HTTP 403 or 429), the script falls back to Chrome automatically.

## Notes

- Thumbnails are 800x500 webp, cropped to fill. They are the site's own images and belong to those sites.
- `status` in an item can be `favorite`, `to-review`, `coming-soon` or `archived` (archived items are hidden). `pick: true` puts an item on "My go-to stack".
- Changelog: a single link or a small batch is a minor change. Add it to the current top release in `content/changelog.json` as `{ type: "added", minor: true, text }`, and do not bump the version. Only a big update (a new page or feature, a redesign, a large batch of links) gets a new version.
- The NEW mark lasts 4 days after a link is added. It comes from the full timestamp in `addedAt` that the script writes; do not edit it by hand, and keep the timestamp if you edit an item.
- Do not rename a slug after publishing; it is the URL.
