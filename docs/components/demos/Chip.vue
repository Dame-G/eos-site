<script setup lang="ts">
import { EChip, EInline, EStack } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EInline>
      <EChip>Neutral</EChip>
      <EChip tone="ink">Ink</EChip>
      <EChip tone="success">Paid</EChip>
      <EChip tone="info">Due Oct 31</EChip>
      <EChip tone="warning">Needs your attention</EChip>
      <EChip tone="danger">Overdue</EChip>
    </EInline>
    <!-- Write sentence case; the chip sets it in capitals -->
    <EInline>
      <EChip tone="success">Signed</EChip>
      <EChip tone="info">Scheduled</EChip>
      <EChip tone="danger">Cancelled</EChip>
    </EInline>
  </EStack>
</template>
