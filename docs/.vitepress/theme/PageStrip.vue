<script setup lang="ts">
import { EKicker } from "@eos-ui/vue";
import { draw, fieldFor, TILT } from "./flow";

// A thin band above an inner page: the home page's flowing lines, drawn once and left still, with the area the page belongs to as a kicker.
// The lines are one fixed set of paths made at a fixed moment, so the band costs nothing after it is drawn: no loop, no resize handler, nothing to pause for reduced motion.
defineProps<{ label: string }>();

const field = fieldFor(1400, 200);
const LINES = draw(field, 24).map((d, n) => ({ i: field.rows[n]!, d }));
</script>

<template>
  <div class="page-strip">
    <svg class="page-strip-lines" aria-hidden="true" focusable="false">
      <g :transform="`rotate(${TILT})`"><path v-for="l in LINES" :key="l.i" class="fl" :d="l.d" /></g>
    </svg>
    <EKicker class="page-strip-label">{{ label }}</EKicker>
  </div>
</template>
