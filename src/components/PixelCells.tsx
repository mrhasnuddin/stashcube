"use client";

import { useEffect, useRef } from "react";

/*
 * The 4x4 cell grid at the right edge of sidebar items and primary buttons.
 * Rest: empty. Hover or keyboard focus: one of three hover patterns, random on every new hover and never the
 * same twice in a row. Press, or aria-current: the dither block from the Figma active state, reached by a
 * per-variant pixel morph. All motion is CSS (see components.css); this only writes the cells and their delays.
 */
type Kind = "nav" | "btn";
type Shape = readonly string[];
type Variant = {
  nav: Shape; // hover shape on the full grid
  btn: Shape; // hover shape confined to the two right columns, inside the button padding
  e: (r: number, c: number) => number; // enter order (exit runs it in reverse)
  d: (r: number, c: number, hv: number, ac: number) => number; // press-morph order
};

const ACTIVE: Shape = ["0011", "1011", "0111", "1011"];
const VARIANTS: Record<string, Variant> = {
  chevron: {
    nav: ["0100", "0010", "0010", "0100"],
    btn: ["0010", "0001", "0001", "0010"],
    e: (r) => r,
    d: (_r, c, hv, ac) => (hv && !ac ? 0 : c + 1),
  },
  stair: {
    nav: ["0001", "0010", "0100", "1000"],
    btn: ["0000", "0001", "0011", "0011"],
    e: (_r, c) => c,
    d: (r, c, hv, ac) => (hv && !ac ? 0 : Math.abs(r + c - 3) + 1),
  },
  bars: {
    nav: ["0000", "0010", "0011", "0111"],
    btn: ["0000", "0001", "0001", "0011"],
    e: (_r, c) => c,
    d: (r, _c, hv, ac) => (hv && !ac ? 0 : 3 - r + 1),
  },
};
const NAMES = Object.keys(VARIANTS);
let lastVariant: string | null = null;
const pick = () => {
  const options = NAMES.filter((n) => n !== lastVariant);
  return (lastVariant = options[Math.floor(Math.random() * options.length)]);
};

function fill(zone: HTMLElement, name: string, kind: Kind) {
  const v = VARIANTS[name];
  const hover = v[kind];
  const blink = name === "bars";
  const top: Record<number, number> = {};
  if (blink)
    for (let c = 0; c < 4; c++)
      for (let r = 0; r < 4; r++)
        if (hover[r][c] === "1") {
          top[c] = r;
          break;
        }
  let html = "";
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      const hv = +hover[r][c];
      const ac = +ACTIVE[r][c];
      const e = v.e(r, c);
      const b = blink && hv && top[c] === r ? `;--b:${c}" data-b="` : "";
      html += `<i style="--h:${hv};--a:${ac};--d:${v.d(r, c, hv, ac)};--de:${e};--dx:${3 - e}${b}"></i>`;
    }
  zone.innerHTML = html;
}

export function PixelCells({ kind }: { kind: Kind }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const zone = ref.current;
    const host = zone?.parentElement;
    if (!zone || !host) return;
    const set = (name: string) => {
      host.dataset.pv = name;
      fill(zone, name, kind);
    };
    set("chevron");
    const go = (e: Event) => {
      if (host.matches("[aria-current]") || host.dataset.state === "busy" || host.dataset.state === "done") return;
      if (e.type === "focus" && !host.matches(":focus-visible")) return;
      set(pick());
    };
    host.addEventListener("mouseenter", go);
    host.addEventListener("focus", go);
    return () => {
      host.removeEventListener("mouseenter", go);
      host.removeEventListener("focus", go);
    };
  }, [kind]);

  return <b ref={ref} className="pxz" aria-hidden="true" />;
}
