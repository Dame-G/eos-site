<script setup lang="ts">
import { EHeading, EStack, EText } from "@eos-ui/vue";
</script>

<template>
  <EStack :gap="6">
    <EStack :gap="1">
      <EHeading :level="3">Tight gap</EHeading>
      <EText muted>Gap 1 keeps related lines close.</EText>
    </EStack>
    <EStack>
      <EHeading :level="3">Default gap</EHeading>
      <EText muted>Space belongs to the parent, not the children.</EText>
    </EStack>
    <EStack align="center">
      <EText>Centred across the column</EText>
    </EStack>
    <!-- as="ul" gives real list semantics -->
    <EStack as="ul" :gap="2">
      <li>Statement of $162.40</li>
      <li>Receipt for Sep 3, 2026</li>
    </EStack>
  </EStack>
</template>
