import type { MetadataRoute } from "next";
import { allItems, groupsWithCategories } from "@/lib/content";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const items = allItems();
  const latest = items.map((i) => i.addedAt).sort().at(-1);
  return [
    { url: `${base}/`, lastModified: latest },
    { url: `${base}/new`, lastModified: latest },
    { url: `${base}/about` },
    ...groupsWithCategories().flatMap((g) => g.categories.map((c) => ({ url: `${base}/c/${c.slug}`, lastModified: latest }))),
    ...items.map((i) => ({ url: `${base}/item/${i.slug}`, lastModified: i.addedAt })),
  ];
}
