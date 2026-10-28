<script setup lang="ts">
import { EButton, EEmptyState, EStack } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EEmptyState icon="file" title="No statements yet">
      They appear here after your first visit.
      <template #action><EButton>Book a visit</EButton></template>
    </EEmptyState>

    <EEmptyState bare icon="search" :heading-level="4" title="No matches for &quot;lab&quot;">
      Try a shorter word or clear the search.
    </EEmptyState>

    <EEmptyState title="Nothing to pay" />

    <div style="display: grid; block-size: 14rem">
      <EEmptyState bare align="start" icon="file" title="No games yet">Play one and it shows here.</EEmptyState>
    </div>

    <EEmptyState icon="alert" title="We could not load your statements">
      Check your connection and try again. Nothing you entered has been lost.
      <template #action><EButton variant="outline">Try again</EButton></template>
    </EEmptyState>

    <EEmptyState icon="file" title="No statements match the filters you chose, even with every date range turned on">
      Remove a filter, or search for a different visit, to see more of your statements and receipts from earlier years.
      <template #action><EButton variant="outline">Clear filters</EButton></template>
    </EEmptyState>
  </EStack>
</template>
