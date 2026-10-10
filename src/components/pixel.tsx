/* Small pixel building blocks that render on the server: logo tile, pop-out cube, arrow and a deterministic placeholder. */

const S = ["01111", "11000", "11000", "01110", "00011", "00011", "11110"];

export function LogoTile({ size = 32 }: { size?: number }) {
  const rects: React.ReactNode[] = [];
  for (let y = 0; y < 15; y++)
    for (let x = 0; x < 15; x++) {
      const corner = (x === 0 || x === 14) && (y === 0 || y === 14);
      if (!corner) rects.push(<rect key={`b${x}-${y}`} x={x} y={y} width="1" height="1" fill="var(--color-primary)" />);
    }
  S.forEach((row, y) =>
    [...row].forEach((b, x) => {
      if (b === "1") rects.push(<rect key={`s${x}-${y}`} x={x + 5} y={y + 4} width="1" height="1" fill="var(--color-background)" />);
    }),
  );
  return (
    <svg viewBox="0 0 15 15" width={size} height={size} shapeRendering="crispEdges" role="img" aria-label="Stashcube">
      {rects}
    </svg>
  );
}

const cubeCells = (() => {
  const top = (x: number, y: number) => Math.abs(x + 0.5 - 8) / 8 + Math.abs(y + 0.5 - 4) / 4 <= 1;
  const out: { x: number; y: number; k: "a" | "b" | "c" }[] = [];
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const cx = x + 0.5,
        cy = y + 0.5;
      if (top(x, y)) out.push({ x, y, k: "a" });
      else if (x < 8 && cy >= 4 + cx / 2 && cy <= 12 + cx / 2) out.push({ x, y, k: "b" });
      else if (x >= 8 && cy >= 12 - cx / 2 && cy <= 20 - cx / 2) out.push({ x, y, k: "c" });
    }
  return out;
})();

/** The little cube that pops out of a tile on hover. Colors come from the .pop classes in components.css. */
export function PopCube() {
  return (
    <svg viewBox="0 0 16 16" width="32" height="32" shapeRendering="crispEdges" aria-hidden="true">
      {cubeCells.map((c) => (
        <rect key={`${c.x}-${c.y}`} className={c.k} x={c.x} y={c.y} width="1" height="1" />
      ))}
    </svg>
  );
}

export function PixelArrow() {
  return (
    <svg className="px arr" viewBox="0 0 7 5" width="14" height="10" aria-hidden="true">
      <path d="M4 0h1v1H4zM5 1h1v1H5zM0 2h7v1H0zM5 3h1v1H5zM4 4h1v1H4z" />
    </svg>
  );
}

export function PixelCheck() {
  return (
    <svg className="px" viewBox="0 0 7 5" width="14" height="10" aria-hidden="true">
      <path d="M6 0h1v1H6zM5 1h1v1H5zM4 2h1v1H4zM0 2h1v1H0zM3 3h1v1H3zM1 3h1v1H1zM2 4h1v1H2z" />
    </svg>
  );
}

export function PixelSearch() {
  return (
    <svg className="px" viewBox="0 0 9 9" width="18" height="18" aria-hidden="true">
      <path d="M2 0h3v1H2zM1 1h1v1H1zM5 1h1v1H5zM0 2h1v3H0zM6 2h1v3H6zM1 5h1v1H1zM5 5h1v1H5zM2 6h3v1H2zM6 6h1v1H6zM7 7h1v1H7zM8 8h1v1H8z" />
    </svg>
  );
}

// ----- deterministic dither placeholder for links without a thumbnail -----
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

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function PixelPlaceholder({ seed }: { seed: string }) {
  const h = hash(seed);
  const cx = [0, 32][h & 1];
  const cy = [0, 20][(h >> 1) & 1];
  const phase = (h % 628) / 100;
  const cells: React.ReactNode[] = [];
  for (let y = 0; y < 20; y++)
    for (let x = 0; x < 32; x++) {
      const d = Math.hypot((x - cx) / 32, (y - cy) / 20);
      const f = 1 - d * 1.15 + Math.sin(x * 0.37 + y * 0.21 + phase) * 0.14;
      if (f <= 0 || f <= (B8[y % 8][x % 8] + 0.5) / 64) continue;
      const tone = f > 0.65 ? "var(--primitive-color-lime-600)" : f > 0.35 ? "var(--primitive-color-lime-700)" : "var(--primitive-color-lime-800)";
      cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={tone} />);
    }
  return (
    <svg viewBox="0 0 32 20" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" aria-hidden="true" className="ph">
      {cells}
    </svg>
  );
}
