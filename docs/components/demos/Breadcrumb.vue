<script setup lang="ts">
import { EBreadcrumb } from "@eos-ui/vue";
</script>

<template>
  <!-- The last item is the current page, so it has no link -->
  <EBreadcrumb
    :items="[
      { label: 'Home', href: '#home' },
      { label: 'Statements', href: '#statements' },
      { label: 'October statement' },
    ]"
  />
</template>
