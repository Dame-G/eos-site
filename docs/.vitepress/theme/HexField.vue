<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

// Nothing here is drawn per frame. The honeycomb is an SVG pattern the browser rasterises once; the pointer's light is a masked copy of it that the compositor slides around with transforms (the copy inside is moved the opposite way, so the pattern itself stays put).
const R = 20; // hexagon circumradius, px
const W = Math.sqrt(3) * R;
const H = 3 * R;
const HEX = `M${W / 2} ${R / 2} L${W} ${R} V${2 * R} L${W / 2} ${2.5 * R} L0 ${2 * R} V${R} Z`;
const STUBS = `M${W / 2} 0 V${R / 2} M${W / 2} ${2.5 * R} V${H}`;
const SPOT = 340; // px across the pointer's light

const root = ref<HTMLElement | null>(null);
const spot = ref<HTMLElement | null>(null);
const spotIn = ref<HTMLElement | null>(null);

let box = { left: 0, top: 0, w: 0, h: 0 };
let boxDirty = true;
let pending = false;
let px = 0;
let py = 0;
let cleanup: Array<() => void> = [];

function measure() {
  const r = root.value!.getBoundingClientRect();
  box = { left: r.left, top: r.top, w: r.width, h: r.height };
  boxDirty = false;
}

function place() {
  pending = false;
  const x = px - SPOT / 2;
  const y = py - SPOT / 2;
  spot.value!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  spotIn.value!.style.transform = `translate3d(${-x}px, ${-y}px, 0)`;
}

onMounted(() => {
  const el = root.value;
  if (!el) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.classList.add("is-still");
    return;
  }
  const flag = (on: boolean) => el.classList.toggle("is-live", on);

  const move = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    if (boxDirty) measure();
    px = e.clientX - box.left;
    py = e.clientY - box.top;
    const near = px > -SPOT / 2 && py > -SPOT / 2 && px < box.w + SPOT / 2 && py < box.h + SPOT / 2;
    flag(near);
    if (near && !pending) {
      pending = true;
      requestAnimationFrame(place);
    }
  };
  const down = () => el.classList.add("is-press");
  const up = () => el.classList.remove("is-press");
  const leave = () => {
    flag(false);
    up();
  };
  const dirty = () => (boxDirty = true);

  addEventListener("pointermove", move, { passive: true });
  addEventListener("pointerdown", down, { passive: true });
  addEventListener("pointerup", up, { passive: true });
  addEventListener("pointercancel", up, { passive: true });
  addEventListener("scroll", dirty, { passive: true });
  addEventListener("resize", dirty, { passive: true });
  document.documentElement.addEventListener("pointerleave", leave);
  cleanup.push(() => {
    removeEventListener("pointermove", move);
    removeEventListener("pointerdown", down);
    removeEventListener("pointerup", up);
    removeEventListener("pointercancel", up);
    removeEventListener("scroll", dirty);
    removeEventListener("resize", dirty);
    document.documentElement.removeEventListener("pointerleave", leave);
  });
});

onBeforeUnmount(() => {
  cleanup.forEach((fn) => fn());
  cleanup = [];
});
</script>

<template>
  <div ref="root" class="hex-field" aria-hidden="true">
    <svg class="hex-defs" width="0" height="0" focusable="false">
      <defs>
        <pattern v-for="kind in ['base', 'lit']" :id="`hex-${kind}`" :key="kind" :width="W" :height="H" patternUnits="userSpaceOnUse">
          <path :class="`hx hx-${kind}`" :d="HEX" />
          <path :class="`hx hx-${kind} hx-open`" :d="STUBS" />
        </pattern>
      </defs>
    </svg>

    <svg class="hex-layer hex-base"><rect width="100%" height="100%" fill="url(#hex-base)" /></svg>

    <div ref="spot" class="hex-spot" :style="{ width: `${SPOT}px`, height: `${SPOT}px` }">
      <div ref="spotIn" class="hex-spot-in">
        <svg class="hex-layer hex-lit"><rect width="100%" height="100%" fill="url(#hex-lit)" /></svg>
      </div>
    </div>
  </div>
</template>
