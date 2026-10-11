import type { Metadata } from "next";
import { ItemTile } from "@/components/ItemTile";
import { PageHeader } from "@/components/PageHeader";
import { latestItems } from "@/lib/content";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({ title: "Recently added", description: "The newest links in the stash.", path: "/new" });

export default function NewPage() {
  const items = latestItems(48);
  return (
    <>
      <PageHeader trail={[{ label: "Recently added" }]} />
      <div className="page-head">
        <span className="label">Feed</span>
        <h1>Recently added</h1>
        <p>The newest links, most recent first.</p>
      </div>
      <div className="grid">
        {items.map((i, n) => (
          <ItemTile key={i.slug} item={i} priority={n < 4} />
        ))}
      </div>
    </>
  );
}
