"use client";

import { useSyncExternalStore } from "react";

const DAYS = 4;
const noSubscribe = () => () => {};

/**
 * NEW mark for a link added in the last 4 days. It depends on the clock, so it is decided in the browser:
 * the prerendered HTML never has it, and it expires on its own without a redeploy.
 * `since` is the link's addedAt timestamp, or null for links that never get the mark.
 */
export function NewBadge({ since }: { since: string | null }) {
  const show = useSyncExternalStore(
    noSubscribe,
    () => since !== null && Date.now() - Date.parse(since) < DAYS * 86_400_000,
    () => false,
  );
  return show ? <span className="badge">NEW</span> : null;
}
