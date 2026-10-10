"use client";

import { useEffect, useRef } from "react";

/*
 * Weak background texture, top-right corner only: an ordered (Bayer 8x8) dither of a noisy radial field,
 * drawn as square cells that dissolve out of the corner. Deterministic (seeded), so it never flickers on resize.
 * A very faint dot grid near the same corner comes from body::before in components.css.
 */
const B8 = (() => {
  let m = [[0]];
  for (let n = 1; n < 8; n *= 2) {
    const t: number[][] = [];
    for (let y = 0; y < 2 * n; y++) {
      t[y] = [];
      for (let x = 0; x < 2 * n; x++) t[y][x] = 4 * m[y % n][x % n] + (y < n ? (x < n ? 0 : 2) : x < n ? 3 : 1);
    }
    m = t;
  }
  return m;
})();

const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = (a: number, b: number, s: number) =>
  (Math.sin(a * 0.37 + b * 0.21 + s) + Math.sin(a * 0.11 - b * 0.43 + s * 2.3) + Math.sin(a * 0.07 + b * 0.05 + s * 5.1)) / 3;

export function PixelTexture() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const draw = () => {
      const css = getComputedStyle(document.documentElement);
      const v = (n: string) => css.getPropertyValue(n).trim();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = cv.clientWidth;
      const h = cv.clientHeight;
      if (!w || !h) return;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const cell = parseFloat(v("--texture-pixel-cell")) || 8;
      const rnd = rng(7);
      const shades: [number, string][] = [
        [0.78, v("--primitive-color-lime-500")],
        [0.55, v("--primitive-color-lime-600")],
        [0.3, v("--primitive-color-lime-700")],
        [0, v("--primitive-color-lime-800")],
      ];
      const spark = v("--primitive-color-lime-200");
      for (let j = 0; j < Math.ceil(h / cell); j++)
        for (let i = 0; i < Math.ceil(w / cell); i++) {
          const x = i * cell;
          const y = j * cell;
          const f = 1 - Math.hypot((w - x) / (w * 0.95), (y / h) * 1.05) + noise(i, j, 3) * 0.28;
          if (f <= 0 || f <= (B8[j % 8][i % 8] + 0.5) / 64) continue;
          let c = shades.find((s) => f >= s[0])![1];
          if (f > 0.35 && rnd() < 0.025) c = spark;
          ctx.fillStyle = c;
          ctx.fillRect(x, y, cell - 1, cell - 1);
        }
    };
    draw();
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(draw, 120);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="tex tex-pixels" aria-hidden="true" />;
}
