"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { ItemView, Subcategory } from "@/lib/content";
import { getSearch, getServerSearch, replaceSearch, subscribeSearch } from "@/lib/url-search";
import { ItemCollection } from "./ItemCollection";
import { ViewToggle } from "./ViewToggle";

/** Category gallery with a sleek, modern sub-category pill bar. */
export function Gallery({ items, subcategories }: { items: ItemView[]; subcategories: Subcategory[] }) {
  const search = useSyncExternalStore(subscribeSearch, getSearch, getServerSearch);
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const subParam = params.get("sub");
  const sub = subParam && subcategories.some((s) => s.slug === subParam) ? subParam : null;
  const tags = useMemo(() => params.getAll("tag"), [params]);

  const pickSub = (s: string | null) => {
    const next = new URLSearchParams(params);
    if (s) next.set("sub", s);
    else next.delete("sub");
    replaceSearch(next.toString());
  };

  const removeTag = (t: string) => {
    const next = new URLSearchParams(params);
    next.delete("tag");
    tags.filter((x) => x !== t).forEach((x) => next.append("tag", x));
    replaceSearch(next.toString());
  };

  const clearAllTags = () => {
    const next = new URLSearchParams(params);
    next.delete("tag");
    replaceSearch(next.toString());
  };

  // Subcategory counts
  const subCounts = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((i) => {
      i.subs.forEach((s) => map.set(s, (map.get(s) ?? 0) + 1));
    });
    return map;
  }, [items]);

  const scoped = useMemo(() => (sub ? items.filter((i) => i.subs.includes(sub)) : items), [items, sub]);
  const shown = useMemo(() => scoped.filter((i) => tags.every((t) => i.tags.includes(t))), [scoped, tags]);

  return (
    <>
      {subcategories.length > 0 ? (
        <div className="filter-nav capsule-style" role="group" aria-label="Sub-category filter">
          <button
            type="button"
            className="filter-capsule"
            aria-pressed={sub === null}
            onClick={() => pickSub(null)}
          >
            <span className="capsule-name">All</span>
            <span className="capsule-count">{items.length}</span>
          </button>
          {subcategories.map((s) => {
            const count = subCounts.get(s.slug) ?? 0;
            return (
              <button
                key={s.slug}
                type="button"
                className="filter-capsule"
                aria-pressed={sub === s.slug}
                onClick={() => pickSub(s.slug)}
              >
                <span className="capsule-name">{s.name}</span>
                {count > 0 ? <span className="capsule-count">{count}</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}

      {tags.length > 0 ? (
        <div className="active-tag-bar">
          <span className="label">Filtered by:</span>
          {tags.map((t) => (
            <button key={t} type="button" className="active-tag-chip" onClick={() => removeTag(t)}>
              #{t} <span className="remove-x">×</span>
            </button>
          ))}
          <button type="button" className="clear-tags-btn" onClick={clearAllTags}>
            Clear
          </button>
        </div>
      ) : null}

      <div className="listing-bar">
        <p className="label result-count" aria-live="polite">
          {shown.length === items.length ? `${items.length} ${items.length === 1 ? "link" : "links"}` : `${shown.length} of ${items.length} links`}
        </p>
        <ViewToggle />
      </div>

      {shown.length > 0 ? (
        <ItemCollection items={shown} showCategory={false} />
      ) : (
        <p className="empty">Nothing matches those filters. Clear a filter or switch sub-category.</p>
      )}
    </>
  );
}
