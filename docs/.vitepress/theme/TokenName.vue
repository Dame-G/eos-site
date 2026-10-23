<script setup lang="ts">
import { ECopyButton, EHighlight } from "@eos-ui/vue";

// A token's CSS name with a button that copies it, so it can be pasted straight into a stylesheet.
defineProps<{ name: string }>();
</script>

<template>
  <span class="token-name">
    <EHighlight code>--e-{{ name }}</EHighlight>
    <ECopyButton :text="`--e-${name}`" :label="`Copy --e-${name}`" class="token-copy" />
  </span>
</template>

<style scoped>
.token-name {
  display: inline-flex;
  align-items: center;
  gap: var(--e-space-1);
}
.token-copy {
  --e-control-height: 1.75rem;
}
</style>
