<script setup lang="ts">
import { EAccordion, EStack } from "@eos-ui/vue";

const items = [
  { id: "billing", title: "Billing", meta: "3 items", defaultOpen: true },
  { id: "privacy", title: "Privacy" },
  { id: "reminders", title: "Reminders", meta: "Off" },
];
</script>

<template>
  <EStack>
    <EAccordion :items="items">
      <template #billing>Your October statement of $162.40 is due on Oct 22, 2026.</template>
      <template #privacy>Choose who can see your visit history.</template>
      <template #reminders>Get a message two days before each visit.</template>
    </EAccordion>

    <EAccordion
      multiple
      :items="[
        { id: 'a', title: 'Opening hours', defaultOpen: true },
        { id: 'b', title: 'Parking', defaultOpen: true },
        { id: 'c', title: 'Getting there' },
      ]"
    >
      <template #a>Monday to Friday, 8:00 to 17:00.</template>
      <template #b>Free for the first two hours.</template>
      <template #c>Take the number 12 bus to Elm Street.</template>
    </EAccordion>
  </EStack>
</template>
