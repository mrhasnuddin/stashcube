"use client";

import { useSyncExternalStore } from "react";
import { getServerView, getView, setView, subscribeView, type ViewMode } from "@/lib/view-mode";

const GridIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" shapeRendering="crispEdges">
    <path fill="currentColor" d="M0 0h5v5H0zM7 0h5v5H7zM0 7h5v5H0zM7 7h5v5H7z" />
  </svg>
);
const ListIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" shapeRendering="crispEdges">
    <path fill="currentColor" d="M0 1h12v2H0zM0 5h12v2H0zM0 9h12v2H0z" />
  </svg>
);

/** Grid / list switch. The choice is shared by every listing and remembered in the browser. */
export function ViewToggle() {
  const mode = useSyncExternalStore(subscribeView, getView, getServerView);
  const btn = (m: ViewMode, label: string, icon: React.ReactNode) => (
    <button type="button" aria-pressed={mode === m} onClick={() => setView(m)}>
      {icon}
      {label}
    </button>
  );
  return (
    <div className="view-toggle" role="group" aria-label="View">
      {btn("grid", "Grid", <GridIcon />)}
      {btn("list", "List", <ListIcon />)}
    </div>
  );
}
