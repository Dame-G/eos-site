<script setup lang="ts">
import { ref } from "vue";
import { ESlotPicker, EStack } from "@eos-ui/vue";

const time = ref<string | null>("9:30 am");
const slots = [
  "9:00 am",
  "9:30 am",
  { value: "10:00 am", label: "10:00 am", disabled: true },
  "10:30 am",
  "11:00 am",
  { value: "11:30 am", label: "11:30 am", disabled: true },
  "1:00 pm",
  "1:30 pm",
];
</script>

<template>
  <EStack>
    <ESlotPicker v-model="time" label="Thursday, Oct 22, 2026" :slots="slots" hint="Taken times are struck through." />
    <p>Chosen: {{ time ?? "none" }}</p>
    <ESlotPicker label="Friday, Oct 23, 2026" :slots="['9:00 am', '9:30 am']" required error="Choose a time to book." />
    <ESlotPicker label="Saturday, Oct 24, 2026" :slots="[]" />
    <ESlotPicker label="Monday, Oct 26, 2026" :slots="['9:00 am', '9:30 am']" disabled />
  </EStack>
</template>
