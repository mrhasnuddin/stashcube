import fs from "node:fs";
import path from "node:path";
import taxonomy from "../../content/taxonomy.json";

export type Subcategory = { slug: string; name: string };
export type Category = {
  slug: string;
  name: string;
  description: string;
  group: string;
  groupSlug: string;
  subcategories: Subcategory[];
};
export type Item = {
  slug: string;
  title: string;
  url: string;
  description: string;
  category: string;
  subcategory?: string;
  tags: string[];
  thumbnail: string | null;
  pricing?: "free" | "freemium" | "paid" | "open-source";
  status?: "favorite" | "to-review" | "archived" | "coming-soon";
  /** Part of "My go-to stack" */
  pick?: boolean;
  notes?: string;
  addedAt: string;
  source?: string;
  order: number;
};
export type ItemView = Item & { newSince: string | null; categoryName: string; comingSoon: boolean };

/*
 * Content is read once at module scope. These are synchronous local reads, so Next treats them as
 * predictable values and prerenders every page that uses them.
 */
const itemsDir = path.join(process.cwd(), "content", "items");
const items: Item[] = fs
  .readdirSync(itemsDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(itemsDir, f), "utf8")) as Item)
  .filter((i) => i.status !== "archived")
  .sort((a, b) => a.order - b.order);

const categories: Category[] = taxonomy.groups.flatMap((g) =>
  g.categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    group: g.name,
    groupSlug: g.slug,
    subcategories: (("subcategories" in c ? c.subcategories : []) as Subcategory[]) ?? [],
  })),
);
const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

// Only links added with a full timestamp (scripts/add-link.mjs writes one) can be NEW, and the NewBadge component
// decides in the browser whether the last 4 days have passed. Links with a date-only addedAt never get the mark.
const newSince = (i: Item) => (i.addedAt.includes("T") ? i.addedAt : null);

const view = (i: Item): ItemView => ({
  ...i,
  newSince: newSince(i),
  categoryName: categoryBySlug.get(i.category)?.name ?? i.category,
  comingSoon: i.status === "coming-soon",
});

export const allItems = (): ItemView[] => items.map(view);
export const getItem = (slug: string): ItemView | undefined => {
  const i = items.find((x) => x.slug === slug);
  return i && view(i);
};
export const getCategory = (slug: string) => categoryBySlug.get(slug);
// Grouped by sub-category in the taxonomy order (so "All" reads as industries, not import order), then by import order.
export const itemsInCategory = (slug: string): ItemView[] => {
  const subs = categoryBySlug.get(slug)?.subcategories ?? [];
  const rank = (i: Item) => {
    const r = subs.findIndex((s) => s.slug === i.subcategory);
    return r === -1 ? subs.length : r;
  };
  return items
    .filter((i) => i.category === slug)
    .sort((a, b) => rank(a) - rank(b))
    .map(view);
};
export const latestItems = (n: number): ItemView[] =>
  [...items].sort((a, b) => b.addedAt.localeCompare(a.addedAt) || b.order - a.order).slice(0, n).map(view);

/** Sidebar and home: groups with only the categories that have at least one link. */
export function groupsWithCategories() {
  return taxonomy.groups
    .map((g) => ({
      slug: g.slug,
      name: g.name,
      categories: categories
        .filter((c) => c.groupSlug === g.slug)
        .map((c) => {
          const inCat = items.filter((i) => i.category === c.slug);
          return { ...c, count: inCat.length, newSince: inCat.map(newSince).filter((d): d is string => d !== null).sort().at(-1) ?? null };
        })
        .filter((c) => c.count > 0),
    }))
    .filter((g) => g.categories.length > 0);
}

export function neighbours(item: Item) {
  const list = items.filter((i) => i.category === item.category);
  const idx = list.findIndex((i) => i.slug === item.slug);
  return { prev: idx > 0 ? view(list[idx - 1]) : undefined, next: idx < list.length - 1 ? view(list[idx + 1]) : undefined };
}

export function related(item: Item, n: number): ItemView[] {
  const score = (i: Item) => i.tags.filter((t) => item.tags.includes(t)).length + (i.subcategory && i.subcategory === item.subcategory ? 1 : 0);
  return items
    .filter((i) => i.category === item.category && i.slug !== item.slug)
    .sort((a, b) => score(b) - score(a) || a.order - b.order)
    .slice(0, n)
    .map(view);
}

export const totalCount = () => items.length;

/** The order categories appear in on the "My go-to stack" page; any other category follows in taxonomy order. */
const PICK_ORDER = ["skills", "ui", "icons", "fonts"];

export function picksByCategory() {
  const picked = items.filter((i) => i.pick);
  const rank = (slug: string) => {
    const r = PICK_ORDER.indexOf(slug);
    return r === -1 ? PICK_ORDER.length + categories.findIndex((c) => c.slug === slug) : r;
  };
  return [...new Set(picked.map((i) => i.category))]
    .sort((a, b) => rank(a) - rank(b))
    .map((slug) => ({ category: categoryBySlug.get(slug)!, items: picked.filter((i) => i.category === slug).map(view) }));
}
export const pickCount = () => items.filter((i) => i.pick).length;

export type ChangeType = "added" | "changed" | "fixed";
export type ChangelogEntry = { version: string; date: string; title: string; summary?: string; changes: { type: ChangeType; text: string; minor?: boolean }[] };
const changelogFile = path.join(process.cwd(), "content", "changelog.json");
const changelog: ChangelogEntry[] = fs.existsSync(changelogFile) ? JSON.parse(fs.readFileSync(changelogFile, "utf8")) : [];
export const getChangelog = (): ChangelogEntry[] => changelog;
