<script setup lang="ts">
import { EAppHeader, EButton, ENavList } from "@eos-ui/vue";
</script>

<template>
  <EAppHeader brand="Elm Street Health" brand-href="#home">
    <template #actions><EButton variant="outline">Sign out</EButton></template>
    <ENavList
      label="Sections"
      orientation="horizontal"
      :items="[
        { label: 'Visits', href: '#visits' },
        { label: 'Statements', href: '#statements', count: 2, current: true },
        { label: 'Forms', href: '#forms' },
      ]"
    />
  </EAppHeader>
</template>
