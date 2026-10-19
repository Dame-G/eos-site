<script setup lang="ts">
import { EBreadcrumb } from "@eos-ui/vue";
</script>

<template>
  <EBreadcrumb
    :items="[
      { label: 'Home', href: '#home' },
      { label: 'Statements', href: '#statements' },
      { label: 'October statement' },
    ]"
  />
</template>
