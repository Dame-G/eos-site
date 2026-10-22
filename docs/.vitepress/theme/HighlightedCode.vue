<script setup lang="ts">
import { ref, watch } from "vue";
import { ECodeBlock } from "@eos-ui/vue";
import { highlight } from "./highlight";

// `note` is shown after the code as a comment, but is not part of what the copy button copies.
const props = defineProps<{ code: string; lang: string; copyLabel?: string; note?: string }>();

const html = ref("");
let latest = 0;
watch(
  () => [props.code, props.lang] as const,
  async ([code, lang]) => {
    const run = ++latest;
    html.value = "";
    const out = await highlight(code, lang);
    if (run === latest) html.value = out;
  },
  { immediate: true },
);
</script>

<template>
  <ECodeBlock :lang="lang" :code="code" :copy-label="copyLabel">
    <div v-if="html" v-html="html" />
  </ECodeBlock>
</template>
