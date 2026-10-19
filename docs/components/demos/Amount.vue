<script setup lang="ts">
import { EAmount, EGrid } from "@eos-ui/vue";
</script>

<template>
  <EGrid>
    <EAmount label="You owe" :amount="162.4" />
    <EAmount
      label="Balance"
      :amount="42.5"
      :details="[
        { label: 'Insurance paid', value: 120 },
        { label: 'Due', value: 'Oct 22, 2026' },
      ]"
    />
    <EAmount label="Paid" :amount="1280" currency="EUR" locale="de-DE" />
  </EGrid>
</template>
