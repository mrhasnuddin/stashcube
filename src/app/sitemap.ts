import type { MetadataRoute } from "next";
import { allItems, groupsWithCategories } from "@/lib/content";
import { SITE_URL as base } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const items = allItems();
  const latest = items.map((i) => i.addedAt).sort().at(-1);
  return [
    { url: `${base}/`, lastModified: latest },
    { url: `${base}/new`, lastModified: latest },
    { url: `${base}/picks`, lastModified: latest },
    { url: `${base}/changelog` },
    { url: `${base}/about` },
    ...groupsWithCategories().flatMap((g) => g.categories.map((c) => ({ url: `${base}/c/${c.slug}`, lastModified: latest }))),
    ...items.map((i) => ({ url: `${base}/item/${i.slug}`, lastModified: i.addedAt })),
  ];
}
