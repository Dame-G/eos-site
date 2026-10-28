<script setup lang="ts">
import { ref } from "vue";
import { EButton, EStack, EText, ETree } from "@eos-ui/vue";

const items = [
  { id: "g1", label: "You vs Dameless", description: "5+3, live" },
  {
    id: "visits",
    label: "October visits",
    description: "2 visits",
    children: [
      { id: "v1", label: "Oct 8, 2026", description: "Dr. Rivera, $120.00" },
      { id: "v2", label: "Oct 15, 2026", description: "Lab work, $42.40" },
    ],
  },
  {
    id: "statements",
    label: "Statements",
    description: "3 statements",
    children: [
      { id: "s10", label: "October", description: "$162.40 due" },
      { id: "s9", label: "September", description: "Paid" },
      { id: "s8", label: "August", description: "Archived", disabled: true },
    ],
  },
];

const selected = ref<string | null>("v1");
const expanded = ref<string[]>(["visits"]);
</script>

<template>
  <EStack>
    <ETree v-model="selected" v-model:expanded="expanded" label="Account records" :items="items" />
    <ETree v-model="selected" label="Records, the chevron opens and the row selects" toggle-on="chevron" dense indent="sm" :items="items">
      <template #trailing="{ item }">
        <EButton size="xs" variant="outline" @click="selected = null">Clear {{ item.label }}</EButton>
      </template>
    </ETree>
    <EText size="sm" tone="muted">Selected: {{ selected ?? "nothing" }}. Open: {{ expanded.join(", ") || "none" }}.</EText>
  </EStack>
</template>
