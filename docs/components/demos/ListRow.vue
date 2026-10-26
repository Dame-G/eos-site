<script setup lang="ts">
import { ref } from "vue";
import { EList, EListRow, EStack, EStamp, EText } from "@eos-ui/vue";

const current = ref<string | number | null>("visit");
</script>

<template>
  <EStack>
    <EList v-model="current" label="Account">
      <EListRow value="visit" title="Visit on Oct 8, 2026" subtitle="Dr. Rivera, 30 minutes">
        <template #trailing><EText>$120.00</EText></template>
      </EListRow>
      <EListRow value="labs" title="Lab work" subtitle="Oct 8, 2026" live>
        <template #trailing><EText>$42.40</EText></template>
      </EListRow>
      <EListRow value="statement" href="#statement" title="October statement" subtitle="Opens the statement">
        <template #leading><EStamp status="due" /></template>
        <template #trailing><EText>$162.40</EText></template>
      </EListRow>
      <EListRow value="old" title="September receipt" subtitle="Paid Sep 24, 2026" disabled />
    </EList>
    <EText size="sm" tone="muted">Current row: {{ current }}.</EText>
  </EStack>
</template>
