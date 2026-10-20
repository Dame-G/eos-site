<script setup lang="ts">
import { EExpandableRow, EStack, EStamp, EButton } from "@eos-ui/vue";
</script>

<template>
  <EStack :gap="2">
    <EExpandableRow title="Lab work" subtitle="Oct 3, 2026" open>
      <template #leading><EStamp status="paid" size="sm" /></template>
      <template #trailing>$42.40</template>
      Blood panel and urinalysis.
      <template #actions><EButton>Download</EButton></template>
    </EExpandableRow>
    <EExpandableRow title="Office visit" subtitle="Oct 1, 2026">
      <template #leading><EStamp status="due" size="sm" /></template>
      <template #trailing>$120.00</template>
      Follow-up with Dr. Rivera.
    </EExpandableRow>
    <EExpandableRow title="Notes without a value">Rows work without a leading item or a value.</EExpandableRow>
  </EStack>
</template>
