<script setup lang="ts">
import { EDescriptionList } from "@eos-ui/vue";
</script>

<template>
  <EDescriptionList
    :items="[
      { label: 'Covers', text: 'Visit on Sep 12, 2026' },
      { label: 'Amount', text: '$162.40' },
      { label: 'Due', text: 'Oct 31, 2026' },
      { label: 'Pay by', text: 'Card, bank transfer or at the front desk' },
    ]"
  />
</template>
