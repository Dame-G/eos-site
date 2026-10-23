<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, reactive, ref, watch } from "vue";
import { CONFIG_KEY, type EosConfig } from "@eos-ui/vue";

// The direction follows the locale (Arabic runs right to left) unless `dir` says otherwise.
const props = defineProps<{ tokens: Record<string, string>; locale: string; currency: string; dir?: "ltr" | "rtl" }>();

const direction = computed(() => props.dir ?? (props.locale.startsWith("ar") ? "rtl" : "ltr"));
const config = reactive<EosConfig>({ locale: props.locale, currency: props.currency, dir: props.dir ?? null, messages: {}, icons: {}, portalTarget: "body" });
provide(CONFIG_KEY, config);
watch(
  () => [props.locale, props.currency, props.dir] as const,
  () => {
    config.locale = props.locale;
    config.currency = props.currency;
    config.dir = props.dir ?? null;
  },
);
const scope = ref<HTMLElement | null>(null);
onMounted(() => (config.portalTarget = scope.value!));
onBeforeUnmount(() => (config.portalTarget = "body"));
</script>

<template>
  <div ref="scope" class="scope e-root" data-e-theme="preview" :style="tokens" :dir="direction"><slot /></div>
</template>

<style scoped>
.scope {
  /* Block flow, not a grid with a gap: every popover portals in here and leaves an empty wrapper behind, and each one would add a gap row. */
  display: flow-root;
  min-width: 0;
  color: var(--e-ink);
  font-family: var(--e-font-sans);
}
</style>
