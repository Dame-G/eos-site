<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, reactive, ref, watch } from "vue";
import { CONFIG_KEY, type EosConfig } from "@eos-ui/vue";

const props = defineProps<{ tokens: Record<string, string>; locale: string; currency: string }>();

const dir = computed(() => (props.locale.startsWith("ar") ? "rtl" : "ltr"));
const config = reactive<EosConfig>({ locale: props.locale, currency: props.currency, dir: null, messages: {}, icons: {}, portalTarget: "body" });
provide(CONFIG_KEY, config);
watch(
  () => [props.locale, props.currency],
  () => {
    config.locale = props.locale;
    config.currency = props.currency;
  },
);
const scope = ref<HTMLElement | null>(null);
onMounted(() => (config.portalTarget = scope.value!));
onBeforeUnmount(() => (config.portalTarget = "body"));
</script>

<template>
  <div ref="scope" class="scope e-root" data-e-theme="preview" :style="tokens" :dir="dir"><slot /></div>
</template>

<style scoped>
.scope {
  display: grid;
  gap: var(--e-space-4);
  min-width: 0;
  color: var(--e-ink);
  font-family: var(--e-font-sans);
}
</style>
