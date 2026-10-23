<script setup lang="ts">
import type { ContrastIssue } from "@eos-ui/tokens";
import { EDisclosure, EIcon, EInline, EText } from "@eos-ui/vue";
import { computed } from "vue";
import { contrastSummary, describeIssue } from "./contrast";

const props = defineProps<{
  issues: ContrastIssue[];
  /** Fold the failing pairs under their count, for the narrow controls bar. */
  compact?: boolean;
}>();

const summary = computed(() => contrastSummary(props.issues));
const lines = computed(() => props.issues.map(describeIssue));
</script>

<template>
  <div class="contrast-status" role="status">
    <EInline v-if="!issues.length" :gap="2" class="ok">
      <EIcon name="check" />
      <EText small as="span">{{ summary }}</EText>
    </EInline>
    <EDisclosure v-else-if="compact" :title="summary" class="bad">
      <ul class="pairs">
        <li v-for="line in lines" :key="line">{{ line }}</li>
      </ul>
    </EDisclosure>
    <div v-else class="bad">
      <EInline :gap="2">
        <EIcon name="warning" />
        <EText small as="span" class="count">{{ summary }}</EText>
      </EInline>
      <ul class="pairs">
        <li v-for="line in lines" :key="line">{{ line }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.contrast-status {
  min-width: 0;
}
.ok {
  color: var(--e-muted);
}
.count {
  color: var(--e-danger);
  font-weight: 600;
}
.pairs {
  display: grid;
  gap: var(--e-space-1);
  margin: var(--e-space-2) 0 0;
  padding: 0;
  list-style: none;
  font-size: var(--e-text-sm);
  color: var(--e-ink);
}
</style>
