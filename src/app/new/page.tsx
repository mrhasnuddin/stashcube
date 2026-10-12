import type { Metadata } from "next";
import { ItemCollection } from "@/components/ItemCollection";
import { ViewToggle } from "@/components/ViewToggle";
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
      <div className="listing-bar">
        <p className="label result-count">{items.length} links</p>
        <ViewToggle />
      </div>
      <ItemCollection items={items} />
    </>
  );
}
