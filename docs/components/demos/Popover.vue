<script setup lang="ts">
import { ref } from "vue";
import { EButton, EInline, EPopover, EStack, EText } from "@eos-ui/vue";

const open = ref(false);
</script>

<template>
  <EStack>
    <EInline>
      <EPopover v-model="open" label="Upcoming visits" title="Upcoming visits">
        <template #trigger><EButton variant="outline">2 upcoming visits</EButton></template>
        <EStack gap="tight">
          <EText>Oct 29, 2026: Dr. Rivera</EText>
          <EText>Nov 12, 2026: Lab work</EText>
        </EStack>
        <template #actions>
          <EButton>Book a visit</EButton>
          <EButton variant="outline" @click="open = false">Not now</EButton>
        </template>
      </EPopover>

      <EPopover label="Statement filter" side="end" align="center">
        <template #trigger><EButton variant="outline">Filter</EButton></template>
        <EText>Show statements from the last 12 months.</EText>
      </EPopover>
    </EInline>
    <EText size="sm" tone="muted">The visits panel is {{ open ? "open" : "closed" }}.</EText>
  </EStack>
</template>
