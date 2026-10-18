<script setup lang="ts">
import { EActions, EButton, EStack, ESurface, EText } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <!-- Inline: the next step in a flow, main action first -->
    <EActions>
      <EButton>Pay $162.40</EButton>
      <EButton variant="outline">View details</EButton>
      <EButton variant="quiet">Skip</EButton>
    </EActions>
    <!-- Bar: ends a card, edge to edge. The card's actions slot makes the bar. -->
    <ESurface as="article" pad="md" aria-label="October statement">
      <EText>October statement, due Oct 31, 2026.</EText>
      <template #actions>
        <EButton>Pay</EButton>
        <EButton variant="outline">Download</EButton>
      </template>
    </ESurface>
  </EStack>
</template>
