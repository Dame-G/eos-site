<script setup lang="ts">
import { ref } from "vue";
import { EDatePicker, EStack, EText } from "@eos-ui/vue";

const visit = ref<Date | null>(new Date(2026, 10, 3, 12));
const born = ref<Date | null>(null);
</script>

<template>
  <EStack>
    <EDatePicker
      v-model="visit"
      label="Visit date"
      name="visit"
      hint="Choose a day in November."
      :min="new Date(2026, 10, 1, 12)"
      :max="new Date(2026, 10, 30, 12)"
    />
    <EText size="sm" tone="muted">Chosen: {{ visit ? visit.toDateString() : "none" }}</EText>
    <EDatePicker v-model="born" label="Date of birth" required :max="new Date(2026, 9, 18, 12)" />
    <EDatePicker label="Statement date" optional error="Choose the date on your statement." />
    <EDatePicker label="Due date" disabled :model-value="new Date(2026, 10, 3, 12)" />
  </EStack>
</template>
