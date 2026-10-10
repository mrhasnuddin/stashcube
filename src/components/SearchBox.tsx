"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { PixelSearch } from "./pixel";

export function SearchBox({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);

  // "/" jumps to the search field, like the key cap says
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      input.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <form
      className="search"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = input.current?.value.trim();
        router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
      }}
    >
      <PixelSearch />
      <input ref={input} name="q" defaultValue={initial} placeholder="Search the stash" aria-label="Search the stash" autoComplete="off" />
      <kbd aria-hidden="true">/</kbd>
    </form>
  );
}
