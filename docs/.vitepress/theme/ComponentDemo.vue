<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from "vue";
import { defineTheme } from "@eos-ui/tokens";
import { EHighlight, ESegmented } from "@eos-ui/vue";
import { DARK_INPUT } from "../scheme";
import ThemedScope from "./playground/ThemedScope.vue";
import { activeScheme } from "./site-theme";

const demos = import.meta.glob("../../components/demos/*.vue");

const props = defineProps<{ name: string }>();
const loader = demos[`../../components/demos/${props.name}.vue`];
const Demo = loader ? defineAsyncComponent(loader as () => Promise<{ default: object }>) : null;

// The frame is the same for every demo: options that try the demo in the other scheme, direction and text size.
const scheme = ref<"light" | "dark" | "">("");
const dir = ref<"ltr" | "rtl">("ltr");
const size = ref("100");
const shown = computed(() => scheme.value || activeScheme.value);

/** Nothing to override while the demo matches the site, so it then inherits the page's own tokens. */
const tokens = computed<Record<string, string>>(() => {
  const scale = Number(size.value) / 100;
  if (shown.value === activeScheme.value && scale === 1) return {};
  const theme = defineTheme({ ...(shown.value === "dark" ? DARK_INPUT : { name: "light" }), ...(scale === 1 ? {} : { textScale: scale }) });
  return { colorScheme: shown.value, ...Object.fromEntries(Object.entries(theme.tokens).map(([k, v]) => [`--e-${k}`, v])) };
});
</script>

<template>
  <div class="demo">
    <div v-if="Demo" class="demo-frame">
      <div class="demo-bar">
        <div class="demo-tools" role="group" aria-label="Preview options">
          <ESegmented
            label="Preview colour scheme"
            :model-value="shown"
            :options="[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]"
            @update:model-value="scheme = $event as 'light' | 'dark'"
          />
          <ESegmented v-model="dir" label="Preview direction" :options="[{ value: 'ltr', label: 'LTR' }, { value: 'rtl', label: 'RTL' }]" />
          <ESegmented
            v-model="size"
            label="Preview text size"
            :options="[{ value: '100', label: '100%' }, { value: '125', label: '125%' }, { value: '150', label: '150%' }]"
          />
        </div>
      </div>
      <ThemedScope class="demo-stage" :tokens="tokens" locale="en-US" currency="USD" :dir="dir"><component :is="Demo" /></ThemedScope>
    </div>
    <p v-else class="demo-missing">
      There is no demo for E{{ name }} yet. Add <EHighlight code>docs/components/demos/{{ name }}.vue</EHighlight> to the site repository.
    </p>
  </div>
</template>
