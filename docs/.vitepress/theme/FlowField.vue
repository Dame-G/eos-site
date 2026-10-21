<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

// Nothing here is drawn per frame. The flowing lines are an SVG pattern whose few tile-sized curves slowly morph.
const W = 360; // tile width, px
const GAP = 40; // distance between lines
const LINES = 6;
const H = GAP * LINES;
const TILT = -16; // degrees; the lines run across the page on a slant
const STEPS = 16; // sample points along a line

function seed(i: number, n: number) {
  const s = Math.sin((i + 1) * 12.9898 + n * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

// A line is two slow sine waves drawn as smooth curves. Every wave fits the tile exactly, so the tile repeats without a seam, and the lines never cross. `shift` (0 to 1) is how far through its loop the line is: the big wave travels one way, the small one the other way, so the line slowly rolls and swells like wax in a lamp.
function line(i: number, shift: number) {
  const a = GAP * (0.22 + seed(i, 1) * 0.12);
  const b = GAP * (0.05 + seed(i, 2) * 0.06);
  const dir = seed(i, 5) > 0.5 ? 1 : -1;
  const p = seed(i, 3) * Math.PI * 2 + dir * shift * Math.PI * 2;
  const q = seed(i, 4) * Math.PI * 2 - dir * shift * Math.PI * 2;
  const y = (x: number) => (i + 0.5) * GAP + a * Math.sin((x / W) * Math.PI * 2 + p) + b * Math.sin((x / W) * Math.PI * 4 + q);
  const step = W / STEPS;
  let d = `M0 ${y(0).toFixed(1)}`;
  for (let k = 0; k < STEPS; k++) {
    const x = k * step;
    // Catmull-Rom through the samples, written as cubic curves
    const p0 = y(x - step), p1 = y(x), p2 = y(x + step), p3 = y(x + 2 * step);
    const c1 = p1 + (p2 - p0) / 6;
    const c2 = p2 - (p3 - p1) / 6;
    d += ` C${(x + step / 3).toFixed(1)} ${c1.toFixed(1)} ${(x + (2 * step) / 3).toFixed(1)} ${c2.toFixed(1)} ${(x + step).toFixed(1)} ${p2.toFixed(1)}`;
  }
  return d;
}

// Each line has its own loop length, so they never move in step. The loop is seamless: a full turn of the phases is the shape it started in.
const FLOW = Array.from({ length: LINES }, (_, i) => ({ rest: line(i, 0), seconds: 46 + seed(i, 6) * 40 }));
// Copies of the tile cover the slanted area the window shows; a bigger window brings more.
function tilesFor() {
  const sw = innerWidth;
  const sh = innerHeight;
  const rad = (-TILT * Math.PI) / 180;
  const xs = [-sh * Math.sin(rad) - W, sw * Math.cos(rad) + W];
  const ys = [-W, sw * Math.sin(rad) + sh * Math.cos(rad) + W];
  const out: { k: string; x: number; y: number }[] = [];
  for (let x = Math.floor(xs[0] / W) * W; x < xs[1]; x += W) for (let y = Math.floor(ys[0] / H) * H; y < ys[1]; y += H) out.push({ k: `${x},${y}`, x, y });
  return out;
}
const TILES = ref<{ k: string; x: number; y: number }[]>([]);

const root = ref<HTMLElement | null>(null);
const base = ref<SVGSVGElement | null>(null);
let cleanup: Array<() => void> = [];

onMounted(() => {
  TILES.value = tilesFor();
  const el = root.value;
  if (!el) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.classList.add("is-still");
    return;
  }

  // The lines are re-shaped about 30 times a second: only six tile-sized curves, which every copy of the tile follows.
  const paths = [...base.value!.querySelectorAll<SVGPathElement>("#flow-tile path")];
  // A slow machine pays for each redraw, so the loop backs off when frames start arriving late and comes back when they don't.
  let last = 0;
  let prev = 0;
  let gap = 32;
  let alive = true;
  const flow = (now: number) => {
    if (!alive) return;
    requestAnimationFrame(flow);
    const frame = now - prev;
    prev = now;
    if (frame > 26) gap = Math.min(gap + 24, 400);
    else if (frame < 20) gap = Math.max(gap - 2, 32);
    if (now - last < gap || document.hidden) return;
    last = now;
    paths.forEach((path, i) => path.setAttribute("d", line(i, (now / 1000 / FLOW[i]!.seconds) % 1)));
  };
  requestAnimationFrame(flow);
  const grow = () => {
    if (innerWidth > size.w || innerHeight > size.h) {
      size = { w: innerWidth, h: innerHeight };
      TILES.value = tilesFor();
    }
  };
  let size = { w: innerWidth, h: innerHeight };
  addEventListener("resize", grow, { passive: true });
  cleanup.push(() => {
    alive = false;
    removeEventListener("resize", grow);
  });
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
      <defs>
        <g id="flow-tile">
          <path v-for="(f, n) in FLOW" :key="n" class="fl" :d="f.rest" />
        </g>
      </defs>
      <g :transform="`rotate(${TILT})`">
        <use v-for="t in TILES" :key="t.k" href="#flow-tile" :x="t.x" :y="t.y" />
      </g>
    </svg>
  </div>
</template>
