<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { TILT, fieldFor, outline, shapes } from "./flow";
import type { Field } from "./flow";

// The lines are shaped by flow.ts; this component paints them on a canvas and keeps them moving.

const root = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
/** The pattern's clock, in seconds: a little faster than real time, so the drift reads as motion at a glance. */
const SPEED = 1.35;
/** The shortest wait between redraws, ms: the screen's own frame rate, up to about 60. */
const MIN_GAP = 15;
const clock = () => (performance.now() / 1000) * SPEED;
let cleanup: Array<() => void> = [];

onMounted(() => {
  const el = root.value;
  const cv = canvas.value;
  const ctx = cv?.getContext("2d");
  if (!el || !cv || !ctx) return;

  // The lines cover the page, which can be taller or wider than the window.
  const area = (w: number, h: number): Field => fieldFor(Math.max(w, el.clientWidth), Math.max(h, el.clientHeight));
  let field: Field = area(innerWidth, innerHeight);
  let ink = "";
  const readInk = () => (ink = getComputedStyle(cv).color);
  readInk();
  // One canvas pixel per device pixel, up to two: the lines are soft at a higher density otherwise. Past 2 the extra sharpness is not worth the fill cost.
  let scale = Math.min(2, devicePixelRatio || 1);

  const paint = (time: number) => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.scale(scale, scale);
    ctx.rotate((TILT * Math.PI) / 180);
    ctx.fillStyle = ink;
    // One path for every line, so where two overlap the ink is not darker.
    ctx.beginPath();
    for (const shape of shapes(field, time)) outline(field, shape, ctx);
    ctx.fill();
  };

  const fit = () => {
    scale = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.round(el.clientWidth * scale);
    cv.height = Math.round(el.clientHeight * scale);
  };
  fit();
  paint(clock());

  // A bigger window brings more lines; a smaller one keeps what it has.
  let size = { w: innerWidth, h: innerHeight };
  const resized = () => {
    if (innerWidth > size.w || innerHeight > size.h) {
      size = { w: Math.max(size.w, innerWidth), h: Math.max(size.h, innerHeight) };
      field = area(size.w, size.h);
    }
    fit();
    paint(clock());
  };
  addEventListener("resize", resized, { passive: true });
  cleanup.push(() => removeEventListener("resize", resized));

  // The ink changes with the colour scheme.
  const rescheme = () => {
    readInk();
    paint(clock());
  };
  const observer = new MutationObserver(rescheme);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-scheme"] });
  cleanup.push(() => observer.disconnect());

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.classList.add("is-still");
    return;
  }

  // The lines are re-shaped every frame (a redraw costs a millisecond or two). The wait between redraws is four times how long the last one took, so a slow machine spends at most a fifth of its time here and falls back to a few frames a second, and it comes back as the machine speeds up. Nothing is drawn while the tab is hidden or the lines are scrolled out of view.
  let visible = true;
  const watch = new IntersectionObserver(([entry]) => (visible = entry?.isIntersecting ?? true));
  watch.observe(el);
  cleanup.push(() => watch.disconnect());

  let last = 0;
  let gap = MIN_GAP;
  let alive = true;
  const flow = (now: number) => {
    if (!alive) return;
    requestAnimationFrame(flow);
    if (now - last < gap || document.hidden || !visible) return;
    last = now;
    const start = performance.now();
    // The same clock as every other paint: a redraw for a new scheme or size must land on the frame the loop would have drawn, or the lines jump.
    paint(clock());
    gap = Math.min(500, Math.max(MIN_GAP, (performance.now() - start) * 4));
  };
  requestAnimationFrame(flow);
  cleanup.push(() => {
    alive = false;
  });
});

onBeforeUnmount(() => {
  cleanup.forEach((fn) => fn());
  cleanup = [];
});
</script>

<template>
  <div ref="root" class="flow-field" aria-hidden="true">
    <canvas ref="canvas" class="flow-layer flow-base" />
  </div>
</template>
