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
  status?: "favorite" | "to-review" | "archived";
  notes?: string;
  addedAt: string;
  source?: string;
  order: number;
};
export type ItemView = Item & { isNew: boolean; categoryName: string };

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

// "New" means added in the 14 days before the latest addition, and only once there is more than one batch.
// No clock is read, so the result is the same on every render.
const dates = items.map((i) => i.addedAt).sort();
const latest = dates.at(-1);
const earliest = dates[0];
const newCutoff = latest ? new Date(latest).getTime() - 14 * 86_400_000 : 0;
const isNew = (i: Item) => latest !== earliest && new Date(i.addedAt).getTime() > newCutoff;

const view = (i: Item): ItemView => ({ ...i, isNew: isNew(i), categoryName: categoryBySlug.get(i.category)?.name ?? i.category });

export const allItems = (): ItemView[] => items.map(view);
export const getItem = (slug: string): ItemView | undefined => {
  const i = items.find((x) => x.slug === slug);
  return i && view(i);
};
export const getCategory = (slug: string) => categoryBySlug.get(slug);
export const itemsInCategory = (slug: string): ItemView[] => items.filter((i) => i.category === slug).map(view);
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
          return { ...c, count: inCat.length, hasNew: inCat.some(isNew) };
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
