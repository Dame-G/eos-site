// The maths of the flowing line background, shared by the home page (FlowField.vue) and the share image (scripts/gen-brand.mjs). It is plain TypeScript with no framework or browser use, so Node can run it as it is. The lines are a few dozen filled shapes whose outlines are re-computed about 15 times a second and painted on a canvas. The pattern never repeats: lines run across the whole window, and what swells them is one continuous field of slow waves that drifts through every line, so a bigger window just reveals more of the same endless thing.
const GAP = 48; // distance between lines
export const TILT = -30; // degrees; the lines run across the page on a slant
const XSTEP = 48; // distance between sample points along a line
const TAU = Math.PI * 2;
const THIN = 3.2; // thickness where nothing is swelling, px
const SIZE = 12; // how much thicker a line can swell, px
const PUSH = [0, 0.95, 0.5, 0.18]; // how much of a neighbour's half-thickness a line this many rows away gives way

function seed(i: number, n: number) {
  const s = Math.sin((i + 1) * 12.9898 + n * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

// What swells the lines: a few travelling waves of different lengths and speeds, added together. Any line can swell anywhere, because the field is defined everywhere. It reads each line's own waving as well as where the line is, so the swelling travels along with the wave: it gathers on crests and troughs and moves the way the line is moving.
const sign = (v: number) => (v > 0.5 ? 1 : -1);
const WAVES = Array.from({ length: 7 }, (_, k) => ({
  along: (sign(seed(k, 1)) * TAU) / (280 + seed(k, 2) * 320), // radians per px along the lines
  across: sign(seed(k, 3)) * (0.35 + seed(k, 4) * 0.8), // radians per line
  follow: sign(seed(k, 5)) * (0.015 + seed(k, 6) * 0.035), // radians per px of the line's own waving
  speed: (sign(seed(k, 8)) * TAU) / (20 + seed(k, 7) * 30),
  tide: TAU / (45 + seed(k, 11) * 60), // how fast the wave itself strengthens and fades
  tidePhase: seed(k, 12) * TAU,
  phase: seed(k, 9) * TAU,
  weight: 0.6 + seed(k, 10) * 0.4,
}));
const NORM = 1 / Math.sqrt(WAVES.reduce((s, w) => s + w.weight * w.weight * 0.35, 0) / 2);

/** How much thicker than thin the line `row` is at `x`, given the line's own waving there. */
function swell(x: number, row: number, waving: number, time: number) {
  let f = 0;
  // The whole field is also bent by a slow swirl, and each wave strengthens and fades on its own tide, so the places that swell keep moving and changing rather than riding along rigidly.
  const bend = 1.6 * Math.sin(x * 0.0043 + row * 0.19 + time * 0.05) + 1.2 * Math.sin(x * 0.0021 - row * 0.1 - time * 0.03);
  for (const w of WAVES) {
    const tide = 0.15 + 0.85 * Math.max(0, Math.sin(w.tide * time + w.tidePhase));
    f += w.weight * tide * Math.sin(w.along * x + w.across * (GAP / 40) * row + w.follow * waving + w.speed * time + w.phase + bend);
  }
  const u = Math.min(1, Math.max(0, (f * NORM + 0.3) / 1.3));
  return SIZE * u * u * (3 - 2 * u);
}

const MARGIN = 72; // how far a line can stray from its row's centre (sweeps, waving, shoving, swelling), px

export interface Field {
  rows: number[]; // the lines to draw
  x0: number;
  count: number; // samples along each line
  lo: number[]; // per line, the first and last sample worth drawing: the rest lies outside the window
  hi: number[];
}

// The lines for the window as it is now. The window is mapped back through the tilt so the lines cover its corners; each line is then cut to the part of it that crosses the window.
export function fieldFor(sw: number, sh: number): Field {
  const rad = (TILT * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const corners = [[0, 0], [sw, 0], [sw, sh], [0, sh]].map(([x, y]) => [x! * cos + y! * sin, -x! * sin + y! * cos] as const);
  const xs = corners.map((c) => c[0]);
  const ys = corners.map((c) => c[1]);
  const x0 = Math.min(...xs) - 3 * XSTEP;
  const x1 = Math.max(...xs) + 3 * XSTEP;
  const count = Math.ceil((x1 - x0) / XSTEP) + 5;
  const r0 = Math.floor(Math.min(...ys) / GAP) - 1;
  const r1 = Math.ceil(Math.max(...ys) / GAP) + 1;
  const rows: number[] = [];
  const lo: number[] = [];
  const hi: number[] = [];
  for (let i = r0; i <= r1; i++) {
    // Where the window's outline crosses the band this line can reach.
    const top = (i + 0.5) * GAP - MARGIN;
    const bottom = (i + 0.5) * GAP + MARGIN;
    let left = Infinity;
    let right = -Infinity;
    const take = (x: number) => {
      left = Math.min(left, x);
      right = Math.max(right, x);
    };
    corners.forEach(([ax, ay], n) => {
      const [bx, by] = corners[(n + 1) % 4]!;
      if (ay >= top && ay <= bottom) take(ax);
      for (const y of [top, bottom]) if ((ay - y) * (by - y) < 0) take(ax + ((bx - ax) * (y - ay)) / (by - ay));
    });
    if (left > right) continue;
    const first = Math.max(0, Math.floor((left - MARGIN - x0) / XSTEP) + 2);
    const last = Math.min(count - 1, Math.ceil((right + MARGIN - x0) / XSTEP) + 2);
    if (last - first < 4) continue;
    rows.push(i);
    lo.push(first);
    hi.push(last);
  }
  return { rows, x0, count, lo, hi };
}

/** One line as a filled band: its upper and lower edge at each sample from `lo` to `hi`. */
export interface Shape {
  top: number[];
  bottom: number[];
  lo: number;
  hi: number;
}

// Every line's outline at `time` seconds. Each line is two slow sine waves (no two alike, none repeating), thickened where the field swells it. Lines give way to their neighbours: where a line is thick the lines beside it are shoved aside, the nearest the most, and thinned where they squeeze past, so the swelling fills the space and the field moves as one thing.
export function shapes(field: Field, time: number): Shape[] {
  const { rows, count } = field;
  const reach = PUSH.length - 1;
  const lo = rows[0]! - reach;
  const total = rows.length + 2 * reach;
  // A line's neighbours are worked out wherever it needs them, and the lines past either end borrow their nearest line's span.
  const span = (r: number): [number, number] => {
    let a = count;
    let b = 0;
    for (let d = -reach; d <= reach; d++) {
      const n = Math.min(rows.length - 1, Math.max(0, r + d - reach));
      a = Math.min(a, field.lo[n]!);
      b = Math.max(b, field.hi[n]!);
    }
    return [a, b];
  };
  const waving: number[][] = [];
  const thick: number[][] = [];
  const at = (k: number) => field.x0 + (k - 2) * XSTEP;
  for (let r = 0; r < total; r++) {
    const i = lo + r;
    const [from, to] = span(r);
    const a = GAP * (0.16 + seed(i, 1) * 0.1);
    const b = GAP * (0.04 + seed(i, 2) * 0.05);
    const la = 300 + seed(i, 7) * 200;
    const lb = 140 + seed(i, 8) * 120;
    const turn = ((seed(i, 5) > 0.5 ? 1 : -1) * time * TAU) / (100 + seed(i, 6) * 80);
    const p = seed(i, 3) * TAU + turn;
    const q = seed(i, 4) * TAU - turn;
    const wave = new Array<number>(count);
    const swells = new Array<number>(count);
    for (let k = from; k <= to; k++) {
      const x = at(k);
      // The big curves are shared: neighbouring lines are only a little out of step with each other, so the lines swing together in long sweeps and sit close, with their own small wave on top.
      const sweep = 16 * Math.sin((x / 520) * TAU + i * 0.14 + time * 0.045) + 10 * Math.sin((x / 250) * TAU - i * 0.22 - time * 0.06 + 1.7) + 5 * Math.sin((x / 130) * TAU + i * 0.35 + time * 0.08);
      wave[k] = sweep + a * Math.sin((x / la) * TAU + p) + b * Math.sin((x / lb) * TAU + q);
      swells[k] = swell(x, i, wave[k]!, time);
    }
    waving.push(wave);
    thick.push(swells);
  }

  return rows.map((i, n) => {
    const r = n + reach;
    const first = field.lo[n]!;
    const last = field.hi[n]!;
    const top = new Array<number>(count);
    const bottom = new Array<number>(count);
    for (let k = first; k <= last; k++) {
      let shove = 0;
      let squeeze = 1;
      for (let d = -reach; d <= reach; d++) {
        if (d === 0) continue;
        const other = thick[r + d]![k]!;
        shove -= Math.sign(d) * (other / 2) * PUSH[Math.abs(d)]!;
        if (Math.abs(d) === 1) squeeze *= 1 - 0.4 * Math.min(1, other / 12);
      }
      const centre = (i + 0.5) * GAP + waving[r]![k]! + shove;
      const t = Math.max(2, (THIN + thick[r]![k]!) * squeeze);
      top[k] = centre - t / 2;
      bottom[k] = centre + t / 2;
    }
    return { top, bottom, lo: first, hi: last };
  });
}

/** What can trace an outline: a canvas context, or the string builder behind `draw`. */
export interface Pen {
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  bezierCurveTo(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number): void;
  closePath(): void;
}

// Catmull-Rom through the samples, written as cubic curves; the samples at each end only steer the curve. The edge runs forward along the top, then back along the bottom.
export function outline(field: Field, shape: Shape, pen: Pen) {
  const { lo, hi } = shape;
  const clamp = (v: number) => Math.min(hi, Math.max(lo, v));
  const at = (k: number) => field.x0 + (clamp(k) - 2) * XSTEP;
  const edge = (ys: number[], forward: boolean) => {
    for (let m = 1; m <= hi - lo - 2; m++) {
      const [i0, i1, i2, i3] = forward ? [lo + m - 1, lo + m, lo + m + 1, lo + m + 2] : [hi + 1 - m, hi - m, hi - 1 - m, hi - 2 - m];
      const p0 = ys[clamp(i0)]!;
      const p1 = ys[clamp(i1)]!;
      const p2 = ys[clamp(i2)]!;
      const p3 = ys[clamp(i3)]!;
      const x1 = at(i1);
      const x2 = at(i2);
      pen.bezierCurveTo(x1 + (x2 - x1) / 3, p1 + (p2 - p0) / 6, x1 + ((x2 - x1) * 2) / 3, p2 - (p3 - p1) / 6, x2, p2);
    }
  };
  pen.moveTo(at(lo + 1), shape.top[lo + 1]!);
  edge(shape.top, true);
  pen.lineTo(at(hi - 1), shape.bottom[hi - 1]!);
  edge(shape.bottom, false);
  pen.closePath();
}

// Every line as the data of an SVG path, at `time` seconds.
export function draw(field: Field, time: number): string[] {
  const f = (v: number) => v.toFixed(1);
  return shapes(field, time).map((shape) => {
    let d = "";
    outline(field, shape, {
      moveTo: (x, y) => (d += `M${f(x)} ${f(y)}`),
      lineTo: (x, y) => (d += `L${f(x)} ${f(y)}`),
      bezierCurveTo: (a, b, c, e, x, y) => (d += `C${f(a)} ${f(b)} ${f(c)} ${f(e)} ${f(x)} ${f(y)}`),
      closePath: () => (d += "Z"),
    });
    return d;
  });
}
