<script setup lang="ts">
import { EAppHeader, EButton, ENavList } from "@eos-ui/vue";
</script>

<template>
  <EAppHeader>
    <template #logo><a href="#home">Elm Street Health</a></template>
    <template #actions><EButton variant="outline">Sign out</EButton></template>
    <ENavList
      label="Sections"
      :items="[
        { label: 'Visits', href: '#visits' },
        { label: 'Statements', href: '#statements', count: 2, current: true },
        { label: 'Forms', href: '#forms' },
      ]"
    />
  </EAppHeader>
</template>
