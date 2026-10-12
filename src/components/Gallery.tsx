"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { ItemView, Subcategory } from "@/lib/content";
import { getSearch, getServerSearch, replaceSearch, subscribeSearch } from "@/lib/url-search";
import { ItemCollection } from "./ItemCollection";
import { ViewToggle } from "./ViewToggle";

function Chip({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" className="tag" aria-pressed={pressed} onClick={onClick}>
      <i />
      {children}
    </button>
  );
}

// The URL query (?sub=...&tag=...) is the filter state (see src/lib/url-search.ts).

/** Category gallery with a sub-category row and tag filters. */
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
  const toggleTag = (t: string) => {
    const next = new URLSearchParams(params);
    next.delete("tag");
    (tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t]).forEach((x) => next.append("tag", x));
    replaceSearch(next.toString());
  };

  const scoped = useMemo(() => (sub ? items.filter((i) => i.subcategory === sub) : items), [items, sub]);
  const topTags = useMemo(() => {
    const counts = new Map<string, number>();
    scoped.forEach((i) => i.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return [...counts.entries()]
      .filter(([t, n]) => n >= 2 || tags.includes(t))
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 14)
      .map(([t]) => t);
  }, [scoped, tags]);
  const shown = useMemo(() => scoped.filter((i) => tags.every((t) => i.tags.includes(t))), [scoped, tags]);

  return (
    <>
      {subcategories.length > 0 ? (
        <div className="chips" role="group" aria-label="Sub-category">
          <Chip pressed={sub === null} onClick={() => pickSub(null)}>
            All
          </Chip>
          {subcategories.map((s) => (
            <Chip key={s.slug} pressed={sub === s.slug} onClick={() => pickSub(s.slug)}>
              {s.name}
            </Chip>
          ))}
        </div>
      ) : null}
      {topTags.length > 0 ? (
        <div className="chips" role="group" aria-label="Tags">
          {topTags.map((t) => (
            <Chip key={t} pressed={tags.includes(t)} onClick={() => toggleTag(t)}>
              {t}
            </Chip>
          ))}
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
        <p className="empty">Nothing matches those filters. Clear a tag or switch sub-category.</p>
      )}
    </>
  );
}
