"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { ItemView } from "@/lib/content";
import { getSearch, getServerSearch, replaceSearch, subscribeSearch } from "@/lib/url-search";
import { ItemCollection } from "./ItemCollection";
import { ViewToggle } from "./ViewToggle";
import { PixelSearch } from "./pixel";

function score(item: ItemView, tokens: string[]) {
  const title = item.title.toLowerCase();
  const desc = item.description.toLowerCase();
  const cat = `${item.categoryName} ${item.subcategory ?? ""}`.toLowerCase();
  const tags = item.tags.join(" ").toLowerCase();
  let total = 0;
  for (const t of tokens) {
    const s = (title.includes(t) ? 4 : 0) + (tags.includes(t) ? 3 : 0) + (cat.includes(t) ? 2 : 0) + (desc.includes(t) ? 1 : 0);
    if (s === 0) return 0; // every word has to match something
    total += s;
  }
  return total;
}

/** Live client-side search over the whole stash. The query lives in the URL (?q=...) and is read from it on every render. */
export function SearchResults({ items }: { items: ItemView[] }) {
  const q = new URLSearchParams(useSyncExternalStore(subscribeSearch, getSearch, getServerSearch)).get("q") ?? "";
  const results = useMemo(() => {
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];
    return items
      .map((i) => ({ i, s: score(i, tokens) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s || a.i.order - b.i.order)
      .map((r) => r.i);
  }, [items, q]);

  return (
    <>
      <label className="search search-lg">
        <PixelSearch />
        <input
          autoFocus
          value={q}
          onChange={(e) => replaceSearch(e.target.value.trim() ? `q=${encodeURIComponent(e.target.value)}` : "")}
          placeholder="Search names, tags and categories"
          aria-label="Search the stash"
          autoComplete="off"
        />
      </label>
      <div className="listing-bar">
        <p className="label result-count" aria-live="polite">
          {q.trim() ? `${results.length} ${results.length === 1 ? "result" : "results"} for “${q.trim()}”` : `${items.length} links in the stash`}
        </p>
        <ViewToggle />
      </div>
      {q.trim() && results.length === 0 ? <p className="empty">Nothing found. Try a shorter word, or a tag like react or webgl.</p> : null}
      <ItemCollection items={q.trim() ? results : []} />
    </>
  );
}
