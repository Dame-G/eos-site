<script setup lang="ts">
import { EButton, EGrid, EHeading, EInline, EStack, EStamp, ESurface, EText } from "@eos-ui/vue";

const visits = [
  { id: 1, title: "Annual check-up", when: "Oct 22, 2026", status: "due" },
  { id: 2, title: "Lab work", when: "Sep 24, 2026", status: "paid" },
  { id: 3, title: "A visit with a much longer name than the others, to show wrapping", when: "Aug 12, 2026", status: "paid" },
] as const;
</script>

<template>
  <EStack :gap="6">
    <EInline justify="between">
      <EHeading :level="3" as="h2">Visits</EHeading>
      <EInline>
        <EButton variant="outline">Export</EButton>
        <EButton>Book a visit</EButton>
      </EInline>
    </EInline>

    <EGrid min="14rem" as="ul" class="layout-list">
      <ESurface v-for="v in visits" :key="v.id" as="li">
        <EStack :gap="2">
          <EStamp :status="v.status" size="sm" />
          <EText>{{ v.title }}</EText>
          <EText size="sm" tone="neutral">{{ v.when }}</EText>
        </EStack>
      </ESurface>
    </EGrid>
  </EStack>
</template>

<style scoped>
.layout-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
