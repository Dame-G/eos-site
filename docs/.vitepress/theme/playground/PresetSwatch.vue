<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ tokens?: Record<string, string>; random?: boolean }>();

const vars = computed(() => ({
  "--g": props.tokens?.["background"] ?? "var(--e-background)",
  "--p": props.tokens?.["primary"] ?? "var(--e-primary)",
}));
</script>

<template>
  <span class="pt" :class="{ 'pt--random': random }" :style="vars" aria-hidden="true" />
</template>

<style scoped>
/* A theme as a small tile: its page ground, with a key of its primary colour standing on its slab, drawn as the library draws a button (an edge all round in the slab colour, the bottom one thicker). */
.pt {
  display: grid;
  flex: none;
  place-items: center;
  box-sizing: border-box;
  width: 1.5rem;
  height: 1.5rem;
  border: var(--e-stroke-hair) solid var(--e-border);
  border-radius: var(--e-radius-sm);
  background: var(--g);
}
.pt::before {
  --lift: var(--e-depth-thin);
  content: "";
  box-sizing: border-box;
  width: 0.875rem;
  height: 0.625rem;
  /* The library's primary-slab: the primary colour with 30% black. */
  border: var(--e-stroke-edge) solid color-mix(in srgb, var(--p), black 30%);
  border-bottom-width: calc(var(--e-stroke-edge) + var(--lift));
  border-radius: var(--e-radius-sm) / var(--e-radius-sm) var(--e-radius-sm) calc(var(--e-radius-sm) + var(--lift)) calc(var(--e-radius-sm) + var(--lift));
  background: var(--p);
}
/* Randomize has no colours of its own yet: an open tile, its edge dashed as the library marks a state that is not set. */
.pt--random {
  border-style: dashed;
  border-color: var(--e-border-strong);
  background: transparent;
}
.pt--random::before {
  --p: var(--e-muted);
}
</style>
