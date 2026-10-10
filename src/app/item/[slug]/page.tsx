import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { ItemTile } from "@/components/ItemTile";
import { PageHeader } from "@/components/PageHeader";
import { PixelCells } from "@/components/PixelCells";
import { PixelArrow, PixelPlaceholder } from "@/components/pixel";
import { allItems, getCategory, getItem, neighbours, related } from "@/lib/content";

export function generateStaticParams() {
  return allItems().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata(props: PageProps<"/item/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const item = getItem(slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.description || `${item.title} in ${item.categoryName}`,
    openGraph: item.thumbnail ? { images: [{ url: item.thumbnail, width: 800, height: 500 }] } : undefined,
  };
}

const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");
const date = (iso: string) => new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });

export default async function ItemPage(props: PageProps<"/item/[slug]">) {
  const { slug } = await props.params;
  const item = getItem(slug);
  if (!item) notFound();
  const cat = getCategory(item.category)!;
  const sub = cat.subcategories.find((s) => s.slug === item.subcategory);
  const { prev, next } = neighbours(item);
  const more = related(item, 4);
  return (
    <article className="item">
      <PageHeader trail={[{ label: cat.group }, { label: cat.name, href: `/c/${cat.slug}` }, { label: item.title }]} />
      <div className="item-grid">
        <div>
          <span className="label">
            {cat.name}
            {sub ? ` / ${sub.name}` : ""}
          </span>
          <h1>{item.title}</h1>
          {item.description ? <p className="lede">{item.description}</p> : null}
          <p className="label host">
            {host(item.url)} · Added {date(item.addedAt)}
          </p>
          <div className="row" style={{ marginTop: "var(--primitive-spacing-6)" }}>
            <a className="btn p" href={item.url} target="_blank" rel="noopener noreferrer">
              <span className="t">
                Visit site <PixelArrow />
              </span>
              <PixelCells kind="btn" />
            </a>
            <CopyLinkButton url={item.url} />
          </div>
          {item.tags.length > 0 ? (
            <div className="chips" style={{ marginTop: "var(--primitive-spacing-6)" }}>
              {item.tags.map((t) => (
                <Link key={t} className="tag" href={`/search?q=${encodeURIComponent(t)}`}>
                  <i />
                  {t}
                </Link>
              ))}
            </div>
          ) : null}
          {item.notes ? <p className="lede">{item.notes}</p> : null}
        </div>
        <a className="item-preview" href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${item.title}`}>
          {item.thumbnail ? (
            <Image src={item.thumbnail} alt={`${item.title} homepage`} fill sizes="(max-width: 820px) 100vw, 55vw" priority className="thumb-img" />
          ) : (
            <PixelPlaceholder seed={item.slug} />
          )}
        </a>
      </div>

      {more.length > 0 ? (
        <section style={{ marginTop: "var(--primitive-spacing-12)" }}>
          <div className="section-head">
            <span className="label">More in {cat.name}</span>
            <Link href={`/c/${cat.slug}`}>See all</Link>
          </div>
          <div className="grid">
            {more.map((i) => (
              <ItemTile key={i.slug} item={i} />
            ))}
          </div>
        </section>
      ) : null}

      <nav className="neighbours" aria-label="More in this category">
        {prev ? <Link href={`/item/${prev.slug}`}>← {prev.title}</Link> : <span />}
        {next ? <Link href={`/item/${next.slug}`}>{next.title} →</Link> : <span />}
      </nav>
    </article>
  );
}
