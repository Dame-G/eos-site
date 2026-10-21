<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { TILT, draw, fieldFor } from "./flow";

// The lines are shaped by flow.ts; this component puts them on the page and keeps them moving.

const LINES = ref<{ i: number; d: string }[]>([]);

const root = ref<HTMLElement | null>(null);
const base = ref<SVGSVGElement | null>(null);
let cleanup: Array<() => void> = [];

onMounted(() => {
  let field = fieldFor(innerWidth, innerHeight);
  let paths: SVGPathElement[] = [];
  const layout = async () => {
    field = fieldFor(innerWidth, innerHeight);
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
