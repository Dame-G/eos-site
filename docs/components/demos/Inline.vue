<script setup lang="ts">
import { EStamp, EHeading, EInline, EStack, EText } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EInline>
      <EStamp tone="success" size="sm">Paid</EStamp>
      <EStamp tone="info" size="sm">Scheduled</EStamp>
      <EStamp tone="danger" size="sm">Overdue</EStamp>
    </EInline>
    <EInline justify="between">
      <EText as="span">October statement</EText>
      <EText as="span">$162.40</EText>
    </EInline>
    <EInline justify="end"><EText as="span" tone="neutral">Due Oct 31, 2026</EText></EInline>
    <EInline align="baseline" gap="base">
      <EHeading :level="2">$162.40</EHeading>
      <EText as="span" size="sm" tone="neutral">balance</EText>
    </EInline>
  </EStack>
</template>
