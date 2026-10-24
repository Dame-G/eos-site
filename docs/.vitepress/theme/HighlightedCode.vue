<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ECodeBlock } from "@eos-ui/vue";

// `note` is shown after the code as a comment, but is not part of what the copy button copies.
const props = defineProps<{ code: string; lang: string; copyLabel?: string; note?: string }>();

// The code is on the page as plain text from the first paint. Shiki and its grammars are only fetched once the browser is idle after the page has mounted, so the highlighter never competes with the first paint.
const html = ref("");
let latest = 0;
let idle = 0;
let mounted = false;

async function colour() {
  const run = ++latest;
  const { highlight } = await import("./highlight");
  const out = await highlight(props.code, props.lang);
  if (run === latest) html.value = out;
}

onMounted(() => {
  mounted = true;
  const start = () => void colour();
  if ("requestIdleCallback" in window) idle = window.requestIdleCallback(start, { timeout: 1500 });
  else idle = window.setTimeout(start, 200);
});
onBeforeUnmount(() => {
  latest++;
  if ("cancelIdleCallback" in window) window.cancelIdleCallback(idle);
  else clearTimeout(idle);
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
