import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/Gallery";
import { PageHeader } from "@/components/PageHeader";
import { getCategory, groupsWithCategories, itemsInCategory } from "@/lib/content";

export function generateStaticParams() {
  return groupsWithCategories().flatMap((g) => g.categories.map((c) => ({ category: c.slug })));
}

export async function generateMetadata(props: PageProps<"/c/[category]">): Promise<Metadata> {
  const { category } = await props.params;
  const cat = getCategory(category);
  if (!cat) return {};
  return { title: cat.name, description: cat.description };
}

export default async function CategoryPage(props: PageProps<"/c/[category]">) {
  const { category } = await props.params;
  const cat = getCategory(category);
  if (!cat) notFound();
  const items = itemsInCategory(category);
  if (items.length === 0) notFound();
  return (
    <>
      <PageHeader trail={[{ label: cat.group }, { label: cat.name }]} />
      <div className="page-head">
        <span className="label">{cat.group}</span>
        <h1>{cat.name}</h1>
        <p>{cat.description}</p>
      </div>
      <Gallery items={items} subcategories={cat.subcategories} />
    </>
  );
}
