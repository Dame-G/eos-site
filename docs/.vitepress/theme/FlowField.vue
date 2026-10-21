<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

// The flowing lines are a few dozen SVG paths whose shapes are re-computed about 20 times a second. The pattern never repeats: lines run across the whole window, and what swells them is one continuous field of slow waves that drifts through every line, so a bigger window just reveals more of the same endless thing.
const GAP = 48; // distance between lines
const TILT = -30; // degrees; the lines run across the page on a slant
const XSTEP = 32; // distance between sample points along a line
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

interface Field {
  rows: number[]; // the lines to draw
  x0: number;
  count: number; // samples along each line
}

// The lines for the window as it is now. The window is mapped back through the tilt so the lines cover its corners.
function fieldFor(): Field {
  const sw = innerWidth;
  const sh = innerHeight;
  const rad = (TILT * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const corners = [[0, 0], [sw, 0], [0, sh], [sw, sh]].map(([x, y]) => [x! * cos + y! * sin, -x! * sin + y! * cos] as const);
  const xs = corners.map((c) => c[0]);
  const ys = corners.map((c) => c[1]);
  const x0 = Math.min(...xs) - 3 * XSTEP;
  const x1 = Math.max(...xs) + 3 * XSTEP;
  const r0 = Math.floor(Math.min(...ys) / GAP) - 1;
  const r1 = Math.ceil(Math.max(...ys) / GAP) + 1;
  return { rows: Array.from({ length: r1 - r0 + 1 }, (_, k) => r0 + k), x0, count: Math.ceil((x1 - x0) / XSTEP) + 5 };
}

// Every line as a filled shape, at `time` seconds. Each line is two slow sine waves (no two alike, none repeating), thickened where the field swells it. Lines give way to their neighbours: where a line is thick the lines beside it are shoved aside, the nearest the most, and thinned where they squeeze past, so the swelling fills the space and the field moves as one thing.
function draw(field: Field, time: number): string[] {
  const { rows, count } = field;
  const reach = PUSH.length - 1;
  const lo = rows[0]! - reach;
  const total = rows.length + 2 * reach;
  const waving: number[][] = [];
  const thick: number[][] = [];
  const xs = Array.from({ length: count }, (_, k) => field.x0 + (k - 2) * XSTEP);
  for (let r = 0; r < total; r++) {
    const i = lo + r;
    const a = GAP * (0.16 + seed(i, 1) * 0.1);
    const b = GAP * (0.04 + seed(i, 2) * 0.05);
    const la = 300 + seed(i, 7) * 200;
    const lb = 140 + seed(i, 8) * 120;
    const turn = ((seed(i, 5) > 0.5 ? 1 : -1) * time * TAU) / (100 + seed(i, 6) * 80);
    const p = seed(i, 3) * TAU + turn;
    const q = seed(i, 4) * TAU - turn;
    // The big curves are shared: neighbouring lines are only a little out of step with each other, so the lines swing together in long sweeps and sit close, with their own small wave on top.
    const sweep = xs.map((x) => 16 * Math.sin((x / 520) * TAU + i * 0.14 + time * 0.045) + 10 * Math.sin((x / 250) * TAU - i * 0.22 - time * 0.06 + 1.7) + 5 * Math.sin((x / 130) * TAU + i * 0.35 + time * 0.08));
    const wave = xs.map((x, k) => sweep[k]! + a * Math.sin((x / la) * TAU + p) + b * Math.sin((x / lb) * TAU + q));
    waving.push(wave);
    thick.push(wave.map((w, k) => swell(xs[k]!, i, w, time)));
  }

  return rows.map((i, n) => {
    const r = n + reach;
    const top = new Array<number>(count);
    const bottom = new Array<number>(count);
    for (let k = 0; k < count; k++) {
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
    // Catmull-Rom through the samples, written as cubic curves; the samples at each end only steer the curve.
    const clamp = (v: number) => Math.min(count - 1, Math.max(0, v));
    const curve = (ys: number[], forward: boolean) => {
      const out: string[] = [];
      for (let k = 1; k < count - 2; k++) {
        const [i0, i1, i2, i3] = forward ? [k - 1, k, k + 1, k + 2] : [count - k, count - 1 - k, count - 2 - k, count - 3 - k];
        const p0 = ys[clamp(i0)]!;
        const p1 = ys[clamp(i1)]!;
        const p2 = ys[clamp(i2)]!;
        const p3 = ys[clamp(i3)]!;
        const x1 = xs[clamp(i1)]!;
        const x2 = xs[clamp(i2)]!;
        out.push(
          `C${(x1 + (x2 - x1) / 3).toFixed(1)} ${(p1 + (p2 - p0) / 6).toFixed(1)} ${(x1 + ((x2 - x1) * 2) / 3).toFixed(1)} ${(p2 - (p3 - p1) / 6).toFixed(1)} ${x2.toFixed(1)} ${p2.toFixed(1)}`,
        );
      }
      return out.join(" ");
    };
    const last = count - 2;
    return `M${xs[1]!.toFixed(1)} ${top[1]!.toFixed(1)}${curve(top, true)}L${xs[last]!.toFixed(1)} ${bottom[last]!.toFixed(1)}${curve(bottom, false)}Z`;
  });
}

const LINES = ref<{ i: number; d: string }[]>([]);

const root = ref<HTMLElement | null>(null);
const base = ref<SVGSVGElement | null>(null);
let cleanup: Array<() => void> = [];

onMounted(() => {
  let field = fieldFor();
  let paths: SVGPathElement[] = [];
  const layout = async () => {
    field = fieldFor();
    const shapes = draw(field, performance.now() / 1000);
    LINES.value = field.rows.map((i, n) => ({ i, d: shapes[n]! }));
    await nextTick();
    paths = [...(base.value?.querySelectorAll<SVGPathElement>(".fl") ?? [])];
  };
  void layout();

  const el = root.value;
  if (!el) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.classList.add("is-still");
    return;
  }

  // Every line is re-shaped about 20 times a second. A slow machine pays for each redraw, so the loop backs off when frames start arriving late and comes back when they don't.
  let last = 0;
  let prev = 0;
  let gap = 48;
  let alive = true;
  const flow = (now: number) => {
    if (!alive) return;
    requestAnimationFrame(flow);
    const frame = now - prev;
    prev = now;
    if (frame > 26) gap = Math.min(gap + 24, 500);
    else if (frame < 20) gap = Math.max(gap - 2, 48);
    if (now - last < gap || document.hidden || paths.length !== field.rows.length) return;
    last = now;
    const shapes = draw(field, now / 1000);
    paths.forEach((path, n) => path.setAttribute("d", shapes[n]!));
  };
  requestAnimationFrame(flow);

  // A bigger window brings more lines; a smaller one keeps what it has.
  let size = { w: innerWidth, h: innerHeight };
  const grow = () => {
    if (innerWidth > size.w || innerHeight > size.h) {
      size = { w: Math.max(size.w, innerWidth), h: Math.max(size.h, innerHeight) };
      void layout();
    }
  };
  addEventListener("resize", grow, { passive: true });
  cleanup.push(() => {
    alive = false;
    removeEventListener("resize", grow);
  });
});

onBeforeUnmount(() => {
  cleanup.forEach((fn) => fn());
  cleanup = [];
});
</script>

<template>
  <div ref="root" class="flow-field" aria-hidden="true">
    <svg ref="base" class="flow-layer flow-base" focusable="false">
      <g class="flow-lines" :transform="`rotate(${TILT})`">
        <path v-for="l in LINES" :key="l.i" class="fl" :d="l.d" />
      </g>
    </svg>
  </div>
</template>
