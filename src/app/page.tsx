import Link from "next/link";
import { CategoryTile, ItemTile } from "@/components/ItemTile";
import { PageHeader } from "@/components/PageHeader";
import { PixelCells } from "@/components/PixelCells";
import { PixelArrow } from "@/components/pixel";
import { groupsWithCategories, latestItems, totalCount } from "@/lib/content";

export default function Home() {
  const groups = groupsWithCategories();
  const categoryCount = groups.reduce((n, g) => n + g.categories.length, 0);
  const latest = latestItems(8);
  return (
    <>
      <PageHeader trail={[{ label: "Home" }]} />
      <section className="hero">
        <span className="label">Public library</span>
        <h1 style={{ marginTop: "var(--primitive-spacing-4)" }}>
          Every good link,
          <br />
          <span style={{ color: "var(--color-primary)" }}>stashed.</span>
        </h1>
        <p>
          UI libraries, 3D tools, icons, fonts and sites worth studying. {totalCount()} links in {categoryCount} categories, saved one at a time.
        </p>
        <div className="row" style={{ marginTop: "var(--primitive-spacing-8)" }}>
          <Link className="btn p" href="/c/ui-libraries">
            <span className="t">
              Browse the stash <PixelArrow />
            </span>
            <PixelCells kind="btn" />
          </Link>
          <Link className="btn s" href="/new">
            <span className="t">Recently added</span>
          </Link>
        </div>
      </section>

      <section>
        <span className="label">Categories</span>
        <div className="grid cat-grid">
          {groups.flatMap((g) =>
            g.categories.map((c) => <CategoryTile key={c.slug} slug={c.slug} name={c.name} group={g.name} description={c.description} count={c.count} />),
          )}
        </div>
      </section>

      <section>
        <div className="section-head">
          <span className="label">Latest additions</span>
          <Link href="/new">See all</Link>
        </div>
        <div className="grid">
          {latest.map((i, n) => (
            <ItemTile key={i.slug} item={i} priority={n < 4} />
          ))}
        </div>
      </section>
    </>
  );
}
