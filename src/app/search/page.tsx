import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SearchResults } from "@/components/SearchResults";
import { allItems } from "@/lib/content";

export const metadata: Metadata = { title: "Search", description: "Search every link in the stash." };

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
