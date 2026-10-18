<script setup lang="ts">
import { EChip, EHeading, EInline, EStack, EText } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EInline>
      <EChip tone="success">Paid</EChip>
      <EChip tone="info">Scheduled</EChip>
      <EChip tone="danger">Overdue</EChip>
    </EInline>
    <!-- justify="between" pushes the ends apart -->
    <EInline justify="between">
      <EText as="span">October statement</EText>
      <EText as="span">$162.40</EText>
    </EInline>
    <EInline justify="end"><EText as="span" muted>Due Oct 31, 2026</EText></EInline>
    <!-- Baseline alignment lines up text of different sizes -->
    <EInline align="baseline" :gap="3">
      <EHeading :level="2">$162.40</EHeading>
      <EText as="span" variant="small" muted>balance</EText>
    </EInline>
  </EStack>
</template>
