<script setup lang="ts">
import { EButton, EEmptyState, EStack } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EEmptyState icon="file" title="No statements yet">
      They appear here after your first visit.
      <template #action><EButton>Book a visit</EButton></template>
    </EEmptyState>

    <!-- Without the dashed outline, for use inside a panel or table -->
    <EEmptyState bare icon="search" :heading-level="4" title="No matches for &quot;lab&quot;">
      Try a shorter word or clear the search.
    </EEmptyState>

    <!-- Title only -->
    <EEmptyState title="Nothing to pay" />
  </EStack>
</template>
