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
/* A pebble in the theme background with a leaf of its primary colour growing across it. */
.pt {
  position: relative;
  display: block;
  flex: none;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 58% 42% 52% 48% / 46% 56% 44% 54%;
  background: var(--g);
  box-shadow: inset 0 0 0 var(--e-stroke-hair) color-mix(in srgb, var(--e-ink) 28%, transparent);
  transform: rotate(-8deg);
}
.pt::before {
  content: "";
  position: absolute;
  inset: 22% 18% 18% 24%;
  border-radius: 0 100% 0 100%;
  background: var(--p);
  transform: rotate(8deg);
}
.pt--random {
  background: conic-gradient(hsl(0 80% 55%), hsl(60 85% 50%), hsl(130 60% 45%), hsl(200 80% 50%), hsl(280 70% 55%), hsl(340 80% 55%), hsl(0 80% 55%));
}
.pt--random::before {
  background: var(--e-surface);
  border-radius: 100% 0 100% 0;
  inset: 30% 30% 30% 30%;
}
</style>
