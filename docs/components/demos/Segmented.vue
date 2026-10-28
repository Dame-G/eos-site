<script setup lang="ts">
import { ref } from "vue";
import { ESegmented, EStack, EText } from "@eos-ui/vue";

const range = ref("Month");
const view = ref("list");
const speeds = ref<string[]>(["Blitz"]);
const month = ref("March");
</script>

<template>
  <EStack>
    <ESegmented v-model="range" label="Show statements for" hide-label :options="['Day', 'Week', 'Month']" />
    <EText size="sm" tone="muted">Showing {{ range.toLowerCase() }} view.</EText>
    <ESegmented
      v-model="view"
      label="View"
      :options="[
        { value: 'list', label: 'List', icon: 'menu' },
        { value: 'grid', label: 'Grid' },
        { value: 'cal', label: 'Calendar', disabled: true },
      ]"
      hint="Remembered on this device."
    />
    <ESegmented label="Sort by" :options="['Date', 'Amount']" error="Choose how to sort before exporting." />
    <ESegmented label="Currency" :options="['USD', 'CAD']" disabled />
    <ESegmented v-model="range" label="Full width" stretch :options="['Day', 'Week', 'Month']" />
    <ESegmented v-model:values="speeds" label="Speeds" multiple :options="['Bullet', 'Blitz', 'Rapid']" />
    <div style="max-width: 16rem">
      <ESegmented
        v-model="month"
        label="Month, becomes a select when it does not fit"
        collapse
        :options="['January', 'February', 'March', 'April', 'May', 'June']"
      />
    </div>
  </EStack>
</template>
