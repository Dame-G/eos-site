<script setup lang="ts">
import { EHeading, EStack, EText } from "@eos-ui/vue";
</script>

<template>
  <EStack gap="section">
    <EStack gap="tight">
      <EHeading :level="3">Tight gap</EHeading>
      <EText tone="neutral">Gap 1 keeps related lines close.</EText>
    </EStack>
    <EStack>
      <EHeading :level="3">Default gap</EHeading>
      <EText tone="neutral">Space belongs to the parent, not the children.</EText>
    </EStack>
    <EStack align="center">
      <EText>Centred across the column</EText>
    </EStack>
    <EStack as="ul" gap="snug">
      <li>Statement of $162.40</li>
      <li>Receipt for Sep 3, 2026</li>
    </EStack>
  </EStack>
</template>
