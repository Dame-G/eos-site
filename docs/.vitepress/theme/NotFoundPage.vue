<script setup lang="ts">
import { EButton, EEmptyState } from "@eos-ui/vue";
</script>

<template>
  <EEmptyState title="That page is not here" icon="file" :heading-level="1">
    It may have moved, or it was never written.
    <template #action><EButton href="/">Back to the home page</EButton></template>
  </EEmptyState>
</template>
