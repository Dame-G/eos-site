<script setup lang="ts">
import { ESkeleton } from "@eos-ui/vue/components/ESkeleton";
</script>

<template>
  <!-- The playground's shape while its code loads after a link inside the site, so the page is never empty. -->
  <div class="playground-skeleton">
    <ESkeleton :height="44" width="min(100%, 32rem)" label="Loading the playground" />
    <div class="playground-skeleton-work">
      <ESkeleton height="32rem" />
      <ESkeleton height="32rem" />
    </div>
  </div>
</template>

<style scoped>
.playground-skeleton {
  display: grid;
  gap: var(--e-space-6);
  padding-block: var(--e-space-2) var(--e-space-4);
}
.playground-skeleton-work {
  display: grid;
  gap: var(--e-space-4);
}
@media (min-width: 64rem) {
  .playground-skeleton-work {
    grid-template-columns: minmax(22rem, 26rem) minmax(0, 1fr);
    gap: calc(var(--e-space-8) * 1.5);
  }
}
</style>
