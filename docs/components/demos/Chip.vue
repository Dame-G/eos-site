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
    <EInline>
      <EChip tone="success">Signed</EChip>
      <EChip tone="info">Scheduled</EChip>
      <EChip tone="danger">Cancelled</EChip>
    </EInline>
    <EInline>
      <EChip tone="success" variant="subtle">Signed</EChip>
      <EChip tone="info" variant="subtle">Scheduled</EChip>
      <EChip tone="warning" variant="subtle">Review</EChip>
      <EChip tone="danger" variant="subtle">Cancelled</EChip>
    </EInline>
  </EStack>
</template>
