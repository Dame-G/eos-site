<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { EVisuallyHidden } from "@eos-ui/vue";

const wide = ref(false);
let query: MediaQueryList | undefined;
const sync = () => (wide.value = !!query?.matches);
onMounted(() => {
  query = matchMedia("(min-width: 64rem)");
  sync();
  query.addEventListener("change", sync);
});
onBeforeUnmount(() => query?.removeEventListener("change", sync));
</script>

<template>
  <aside v-if="wide" class="dock" aria-labelledby="playground-customise">
    <EVisuallyHidden as="h2" id="playground-customise">Customise</EVisuallyHidden>
    <div class="dock-body"><slot /></div>
  </aside>
  <section v-else class="dock-narrow" aria-label="Customise">
    <slot />
  </section>
</template>

<style scoped>
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
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}
.dock-narrow {
  min-width: 0;
  overflow-x: clip;
}
</style>
