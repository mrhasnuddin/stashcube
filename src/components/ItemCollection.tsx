"use client";

import { useSyncExternalStore } from "react";
import type { ItemView } from "@/lib/content";
import { getServerView, getView, subscribeView } from "@/lib/view-mode";
import { ItemList } from "./ItemList";
import { ItemTile } from "./ItemTile";

/** Renders links as tiles or as a list, following the shared view switch. */
export function ItemCollection({ items, showCategory = true }: { items: ItemView[]; showCategory?: boolean }) {
  const mode = useSyncExternalStore(subscribeView, getView, getServerView);
  if (mode === "list") return <ItemList items={items} showCategory={showCategory} />;
  return (
    <div className="grid">
      {items.map((i, n) => (
        <ItemTile key={i.slug} item={i} priority={n < 4} />
      ))}
    </div>
  );
}
