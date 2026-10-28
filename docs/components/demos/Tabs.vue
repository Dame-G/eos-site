<script setup lang="ts">
import { ref } from "vue";
import { ETabs, EStack, EText } from "@eos-ui/vue";

const tab = ref("open");
const items = [
  { id: "open", label: "Open", count: 3 },
  { id: "paid", label: "Paid" },
  { id: "all", label: "All statements", count: "New" },
];
</script>

<template>
  <EStack>
    <ETabs v-model="tab" label="Statements" :items="items">
      <template #open>Three statements are waiting. The largest is $162.40, due Oct 22, 2026.</template>
      <template #paid>Statements you have paid show here.</template>
      <template #panel="{ item }">Every statement, newest first ({{ item.label }}).</template>
    </ETabs>
    <EText size="sm" tone="muted">Selected: {{ tab }}</EText>
    <ETabs v-model="tab" flush label="Statements, flush on a rule" :items="items">
      <template #open>Flush: square tabs on a rule that runs the full width.</template>
      <template #panel="{ item }">{{ item.label }}</template>
    </ETabs>
  </EStack>
</template>
