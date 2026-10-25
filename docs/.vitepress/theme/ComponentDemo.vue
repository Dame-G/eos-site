<script setup lang="ts">
import { computed, defineAsyncComponent, hydrateOnVisible, ref } from "vue";
import { defineTheme, type Theme } from "@eos-ui/tokens";
import { EHighlight } from "@eos-ui/vue/components/EHighlight";
import { ESegmented } from "@eos-ui/vue/components/ESegmented";
import { ESelect } from "@eos-ui/vue/components/ESelect";
import { EConfigProvider } from "@eos-ui/vue/components/EConfigProvider";
import { DARK_INPUT } from "../scheme";
import { activeScheme } from "./site-theme";
import { stopPlaceholderLinks } from "./placeholder-links";

const demos = import.meta.glob("../../components/demos/*.vue");

const props = defineProps<{ name: string }>();
const loader = demos[`../../components/demos/${props.name}.vue`];
// The demo's markup is in the page, but it only becomes interactive once it scrolls into view, so a page with several demos does not hydrate them all at load.
const Demo = loader ? defineAsyncComponent({ loader: loader as () => Promise<{ default: object }>, hydrate: hydrateOnVisible() }) : null;

// The frame is the same for every demo: options that try the demo in the other scheme, direction and text size.
const scheme = ref<"light" | "dark" | "">("");
const dir = ref<"ltr" | "rtl">("ltr");
const size = ref("100");
const SIZES = [
  { value: "100", label: "100%" },
  { value: "125", label: "125%" },
  { value: "150", label: "150%" },
];
const shown = computed(() => scheme.value || activeScheme.value);

/** Nothing to override while the demo matches the site, so it then inherits the page's own tokens. */
const theme = computed<Theme | undefined>(() => {
  const scale = Number(size.value) / 100;
  if (shown.value === activeScheme.value && scale === 1) return undefined;
  return defineTheme({ ...(shown.value === "dark" ? DARK_INPUT : { name: "light" }), ...(scale === 1 ? {} : { textScale: scale }) });
});
</script>

<template>
  <div class="demo">
    <div v-if="Demo" class="demo-frame">
      <div class="demo-bar">
        <div class="demo-tools" role="group" aria-label="Preview options">
          <ESegmented
            label="Preview colour scheme"
            hide-label
            :model-value="shown"
            :options="[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]"
            @update:model-value="scheme = $event as 'light' | 'dark'"
          />
          <ESegmented v-model="dir" label="Preview direction" hide-label :options="[{ value: 'ltr', label: 'LTR' }, { value: 'rtl', label: 'RTL' }]" />
          <ESelect v-model="size" class="demo-size" bare label="Preview text size" :options="SIZES" />
        </div>
      </div>
      <!-- The demos link to stand-in addresses such as #statements: following one must not change the page's address. -->
      <EConfigProvider class="demo-stage vp-raw" :theme="theme" :dir="dir" @click="stopPlaceholderLinks"><component :is="Demo" /></EConfigProvider>
    </div>
    <p v-else class="demo-missing">
      There is no demo for E{{ name }} yet. Add <EHighlight code>docs/components/demos/{{ name }}.vue</EHighlight> to the site repository.
    </p>
  </div>
</template>
