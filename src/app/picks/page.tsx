import type { Metadata } from "next";
import Link from "next/link";
import { ItemCollection } from "@/components/ItemCollection";
import { ViewToggle } from "@/components/ViewToggle";
import { PageHeader } from "@/components/PageHeader";
import { pickCount, picksByCategory } from "@/lib/content";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "My go-to stack",
  description: "The most-used and most-recommended libraries, skills and resources in the stash.",
  path: "/picks",
});

export default function PicksPage() {
  const groups = picksByCategory();
  return (
    <>
      <PageHeader trail={[{ label: "My go-to stack" }]} />
      <div className="page-head">
        <span className="label">Picks</span>
        <h1>My go-to stack</h1>
        <p>
          The most-used and most-recommended libraries, skills and resources, kept short on purpose. {pickCount()} links.
        </p>
      </div>
      <div className="listing-bar">
        <span />
        <ViewToggle />
      </div>
      {groups.map((g) => (
        <section key={g.category.slug}>
          <div className="section-head">
            <span className="label">{g.category.name}</span>
            <Link href={`/c/${g.category.slug}`}>See all {g.category.name}</Link>
          </div>
          <ItemCollection items={g.items} showCategory={false} />
        </section>
      ))}
    </>
  );
}
