<script setup lang="ts">
import { EStack, EText } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EText size="lg">You paid $162.40 in full on Sep 3, 2026.</EText>
    <EText>Your October statement covers the visit on Oct 22, 2026. Pay online, by phone or at the front desk.</EText>
    <EText size="sm">Questions about a charge? Call us on weekdays.</EText>
    <EText size="sm" tone="muted">Receipts are kept for seven years.</EText>
    <EText as="span" tone="muted">Rendered as a span.</EText>
  </EStack>
</template>
