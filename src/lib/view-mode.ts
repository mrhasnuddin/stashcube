// Grid or list view for every listing, remembered in this browser and shared by all pages (useSyncExternalStore).
export type ViewMode = "grid" | "list";
const KEY = "stashcube:view";
const listeners = new Set<() => void>();
let current: ViewMode | null = null; // in-memory copy, so the toggle still works when storage is blocked

export const subscribeView = (cb: () => void) => {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      current = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
};
export const getView = (): ViewMode => {
  if (current) return current;
  try {
    return (current = localStorage.getItem(KEY) === "list" ? "list" : "grid");
  } catch {
    return "grid";
  }
};
export const getServerView = (): ViewMode => "grid";
export function setView(mode: ViewMode) {
  current = mode;
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    // storage blocked: the choice lasts until the page is closed
  }
  listeners.forEach((l) => l());
}
