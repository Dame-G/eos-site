<script setup lang="ts">
import { EVisuallyHidden } from "@eos-ui/vue/components/EVisuallyHidden";
</script>

<template>
  <aside class="dock" aria-labelledby="playground-customise" tabindex="-1">
    <EVisuallyHidden as="h2" id="playground-customise">Customise</EVisuallyHidden>
    <div class="dock-body"><slot /></div>
  </aside>
</template>

<style scoped>
/* The dock clips what overflows sideways. The panel inside reaches a little past the column so a focused field's outline is not cut, so the dock has that much room on its sides too, taken back with the margin so it still lines up with the page. */
.dock {
  min-width: 0;
  overflow-x: clip;
  padding-inline: calc(2 * var(--e-stroke-focus));
  margin-inline: calc(-2 * var(--e-stroke-focus));
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
    /* A set height, not a cap: the tabs inside stretch to it, which needs a height to fill. */
    height: calc(100dvh - var(--site-header) - var(--e-space-8));
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
