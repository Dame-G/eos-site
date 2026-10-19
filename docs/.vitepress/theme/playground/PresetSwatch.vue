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
.pt {
  display: block;
  flex: none;
  width: calc(var(--e-space-4) + var(--e-space-1));
  height: calc(var(--e-space-4) + var(--e-space-1));
  border-radius: var(--e-radius-pill);
  background: linear-gradient(90deg, var(--g) 50%, var(--p) 50%);
}
.pt--random {
  background: conic-gradient(hsl(0 80% 55%), hsl(60 85% 50%), hsl(130 60% 45%), hsl(200 80% 50%), hsl(280 70% 55%), hsl(340 80% 55%), hsl(0 80% 55%));
}
</style>
