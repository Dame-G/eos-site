<script setup lang="ts">
import { ref } from "vue";
import { ESegmented, EStack } from "@eos-ui/vue";

const range = ref("Month");
const view = ref("list");
</script>

<template>
  <EStack>
    <ESegmented v-model="range" label="Show statements for" :options="['Day', 'Week', 'Month']" />
    <p>Showing {{ range.toLowerCase() }} view.</p>
    <ESegmented
      v-model="view"
      label="View"
      :options="[
        { value: 'list', label: 'List', icon: 'list' },
        { value: 'grid', label: 'Grid' },
        { value: 'cal', label: 'Calendar', disabled: true },
      ]"
      hint="Remembered on this device."
    />
    <ESegmented label="Sort by" :options="['Date', 'Amount']" error="Choose how to sort before exporting." />
    <ESegmented label="Currency" :options="['USD', 'CAD']" disabled />
  </EStack>
</template>
