<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ECodeBlock } from "@eos-ui/vue/components/ECodeBlock";
import { whenIdle } from "./idle";

const props = defineProps<{ code: string; lang: string; copyLabel?: string }>();

// The code is on the page as plain text from the first paint. Shiki and its grammars are only fetched once the browser is idle after the page has mounted, so the highlighter never competes with the first paint.
const html = ref("");
let latest = 0;
let cancelIdle = () => {};
let mounted = false;

async function colour() {
  const run = ++latest;
  const { highlight } = await import("./highlight");
  const out = await highlight(props.code, props.lang);
  if (run === latest) html.value = out;
}

onMounted(() => {
  mounted = true;
  cancelIdle = whenIdle(() => void colour(), 1500, 200);
});
onBeforeUnmount(() => {
  latest++;
  cancelIdle();
});
watch(
  () => [props.code, props.lang] as const,
  () => {
    if (!mounted) return;
    html.value = "";
    void colour();
  },
);
</script>

<template>
  <ECodeBlock :lang="lang" :code="code" :copy-label="copyLabel">
    <div v-if="html" v-html="html" />
  </ECodeBlock>
</template>
