<script setup lang="ts">
import { EBreadcrumb, EButton, EPageHeader, EStamp } from "@eos-ui/vue";
</script>

<template>
  <EPageHeader title="October statement" description="Oct 1 to Oct 31, 2026">
    <template #breadcrumb>
      <EBreadcrumb :items="[{ label: 'Statements', href: '#statements' }, { label: 'October' }]" />
    </template>
    <template #status><EStamp status="due" detail="Oct 22" /></template>
    <template #actions>
      <EButton>Pay $162.40</EButton>
      <EButton variant="outline">Download</EButton>
    </template>
  </EPageHeader>
</template>
