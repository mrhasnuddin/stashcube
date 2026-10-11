import Link from "next/link";
import { CategoryTile, ItemTile } from "@/components/ItemTile";
import { PageHeader } from "@/components/PageHeader";
import { DeanStudioLink, STUDIO_URL } from "@/components/DeanStudioLink";
import { PixelCells } from "@/components/PixelCells";
import { PixelArrow } from "@/components/pixel";
import { groupsWithCategories, latestItems, totalCount } from "@/lib/content";
import { SITE_NAME, SITE_URL, STUDIO_NAME } from "@/lib/site";

// Describes only what the page really is: a site with a search page, published by DeanStudio.
const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { "@type": "Organization", name: STUDIO_NAME, url: STUDIO_URL },
  potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/search?q={search_term_string}`, "query-input": "required name=search_term_string" },
}).replace(/</g, "\\u003c");

export default function Home() {
  const groups = groupsWithCategories();
  const categoryCount = groups.reduce((n, g) => n + g.categories.length, 0);
  const latest = latestItems(8);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <PageHeader trail={[{ label: "Home" }]} />
      <section className="hero">
        <span className="label">
          Curated by <DeanStudioLink />
        </span>
        <h1 style={{ marginTop: "var(--primitive-spacing-4)" }}>
          Tools and libraries for <span style={{ color: "var(--color-primary)" }}>AI-native designers and builders.</span>
        </h1>
        <p>
          UI libraries, 3D tools, icons, fonts, AI skills and inspiration for starting a new project, picked for people who design and build with AI. {totalCount()} links
          across {categoryCount} categories.
        </p>
        <div className="row" style={{ marginTop: "var(--primitive-spacing-8)" }}>
          <Link className="btn p" href="/c/ui">
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
