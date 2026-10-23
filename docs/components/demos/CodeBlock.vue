<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { ECodeBlock, EStack } from "@eos-ui/vue";
import { highlight } from "../../.vitepress/theme/highlight";

const blocks = [
  { id: "install", lang: "bash", code: "npm install @eos-ui/vue", copyLabel: undefined },
  { id: "css", lang: "css", code: ":root {\n  --e-primary: #0b4f6c;\n  --e-radius-md: 12px;\n}", copyLabel: "Copy CSS" },
  {
    id: "long",
    lang: "ts",
    code: 'createApp(App).use(createEos({ locale: "en-CA", currency: "CAD", theme: { brand: "#2c95b4", accent: "#72c451" } })).mount("#app");',
    copyLabel: undefined,
  },
];

const html = reactive<Record<string, string>>({});
onMounted(async () => {
  for (const b of blocks) html[b.id] = await highlight(b.code, b.lang);
});
</script>

<template>
  <EStack gap="0">
    <ECodeBlock v-for="b in blocks" :key="b.id" :lang="b.lang" :code="b.code" :copy-label="b.copyLabel">
      <div v-if="html[b.id]" v-html="html[b.id]" />
    </ECodeBlock>
  </EStack>
</template>
