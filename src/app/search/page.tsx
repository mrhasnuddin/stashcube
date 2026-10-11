import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SearchResults } from "@/components/SearchResults";
import { allItems } from "@/lib/content";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({ title: "Search", description: "Search every link in the stash.", path: "/search", noindex: true });

export default function SearchPage() {
  return (
    <>
      <PageHeader trail={[{ label: "Search" }]} hideSearch />
      <div className="page-head">
        <span className="label">Search</span>
        <h1>Find a link</h1>
      </div>
      <Suspense fallback={<p className="label">Loading…</p>}>
        <SearchResults items={allItems()} />
      </Suspense>
    </>
  );
}
