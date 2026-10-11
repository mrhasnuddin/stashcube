// The URL query string as an external store, for useSyncExternalStore.
// Next keeps visited pages mounted, so component state copied from the URL once goes stale on the next visit;
// reading the URL on every render (and again after each navigation commits) never does.
// The server snapshot is empty, so prerendered HTML is unfiltered and filters apply right after hydration.
const listeners = new Set<() => void>();

export const subscribeSearch = (cb: () => void) => {
  listeners.add(cb);
  window.addEventListener("popstate", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("popstate", cb);
  };
};
export const getSearch = () => window.location.search;
export const getServerSearch = () => "";

/** Replace the query string without adding a history entry, and tell subscribers. */
export function replaceSearch(qs: string) {
  window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  listeners.forEach((l) => l());
}
