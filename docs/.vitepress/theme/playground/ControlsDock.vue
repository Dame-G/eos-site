<script setup lang="ts">
import { EVisuallyHidden } from "@eos-ui/vue";
</script>

<template>
  <aside class="dock" aria-labelledby="playground-customise" tabindex="-1">
    <EVisuallyHidden as="h2" id="playground-customise">Customise</EVisuallyHidden>
    <div class="dock-body"><slot /></div>
  </aside>
</template>

<style scoped>
.dock {
  min-width: 0;
  overflow-x: clip;
}
.dock:focus {
  outline: none;
}
.dock-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
/* From 64rem the controls sit beside the result and stay in view while the page scrolls. */
@media (min-width: 64rem) {
  .dock {
    display: flex;
    flex-direction: column;
    min-height: 0;
    max-height: calc(100dvh - var(--site-header) - var(--e-space-8));
    position: sticky;
    top: calc(var(--site-header) + var(--e-space-4));
    padding-block-end: var(--e-space-4);
  }
  .dock-body {
    flex: 1;
    min-height: 0;
  }
}
</style>
