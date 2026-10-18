<script setup lang="ts">
import { ref } from "vue";
import { EButton, EText } from "@eos-ui/vue";

const props = defineProps<{
  /** The text to show and copy. */
  code: string;
  /** What the copy button copies, in the words of its label: "code", "CSS". */
  what: string;
}>();

const status = ref("");
async function copy() {
  try {
    await navigator.clipboard.writeText(props.code);
    status.value = `${props.what} copied`;
  } catch {
    status.value = `Select the ${props.what} and copy it`;
  }
  setTimeout(() => (status.value = ""), 2500);
}
</script>

<template>
  <div class="code-block">
    <pre class="code" tabindex="0" :aria-label="what"><code>{{ code }}</code></pre>
    <div class="code-foot">
      <EButton variant="outline" @click="copy">Copy {{ what }}</EButton>
      <EText variant="small" muted role="status">{{ status }}</EText>
    </div>
  </div>
</template>

<style scoped>
.code-block {
  display: grid;
  gap: var(--e-space-3);
}
.code {
  margin: 0;
  padding: var(--e-space-4);
  overflow-x: auto;
  border: var(--e-stroke-hair) solid var(--e-border);
  border-radius: var(--e-radius-md);
  background: var(--e-surface);
  font: 400 var(--e-text-sm) / 1.6 var(--e-font-mono);
  white-space: pre;
}
.code-foot {
  display: flex;
  flex-wrap: wrap;
  gap: var(--e-space-3);
  align-items: center;
}
</style>
