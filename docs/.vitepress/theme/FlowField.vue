<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { TILT, fieldFor, outline, shapes } from "./flow";
import type { Field } from "./flow";

// The lines are shaped by flow.ts; this component paints them on a canvas and keeps them moving.

const root = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
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

  const paint = (time: number) => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.rotate((TILT * Math.PI) / 180);
    ctx.fillStyle = ink;
    // One path for every line, so where two overlap the ink is not darker.
    ctx.beginPath();
    for (const shape of shapes(field, time)) outline(field, shape, ctx);
    ctx.fill();
  };

  // The canvas is one pixel per CSS pixel: the lines are faint and soft-edged, so more would only cost more.
  const fit = () => {
    cv.width = el.clientWidth;
    cv.height = el.clientHeight;
  };
  fit();
  paint(performance.now() / 1000);

  // A bigger window brings more lines; a smaller one keeps what it has.
  let size = { w: innerWidth, h: innerHeight };
  const resized = () => {
    if (innerWidth > size.w || innerHeight > size.h) {
      size = { w: Math.max(size.w, innerWidth), h: Math.max(size.h, innerHeight) };
      field = area(size.w, size.h);
    }
    fit();
    paint(performance.now() / 1000);
  };
  addEventListener("resize", resized, { passive: true });
  cleanup.push(() => removeEventListener("resize", resized));

  // The ink changes with the colour scheme.
  const rescheme = () => {
    readInk();
    paint(performance.now() / 1000);
  };
  const observer = new MutationObserver(rescheme);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-scheme"] });
  cleanup.push(() => observer.disconnect());

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.classList.add("is-still");
    return;
  }

  // The lines are re-shaped about 15 times a second, which is as often as the slow drift needs. The wait between redraws is four times how long the last one took, so a slow machine spends at most a fifth of its time here, and it comes back as the machine speeds up. Nothing is drawn while the tab is hidden or the lines are scrolled out of view.
  let visible = true;
  const watch = new IntersectionObserver(([entry]) => (visible = entry?.isIntersecting ?? true));
  watch.observe(el);
  cleanup.push(() => watch.disconnect());

  let last = 0;
  let gap = 66;
  let alive = true;
  const flow = (now: number) => {
    if (!alive) return;
    requestAnimationFrame(flow);
    if (now - last < gap || document.hidden || !visible) return;
    last = now;
    const start = performance.now();
    paint(now / 1000);
    gap = Math.min(500, Math.max(66, (performance.now() - start) * 4));
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
