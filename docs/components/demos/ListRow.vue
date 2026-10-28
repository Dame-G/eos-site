<script setup lang="ts">
import { ref } from "vue";
import { EIconButton, EList, EListRow, EStack, EStamp, EText } from "@eos-ui/vue";

const current = ref<string | number | null>("visit");
</script>

<template>
  <EStack>
    <EList v-model="current" label="Account">
      <EListRow value="visit" title="Visit on Oct 8, 2026" subtitle="Dr. Rivera, 30 minutes">
        <template #trailing><EText>$120.00</EText></template>
      </EListRow>
      <EListRow value="labs" title="Lab work" subtitle="Oct 8, 2026" live live-tone="danger">
        <template #trailing><EText>$42.40</EText></template>
      </EListRow>
      <EListRow value="statement" href="#statement" title="October statement" subtitle="Opens the statement">
        <template #leading><EStamp status="due" /></template>
        <template #trailing><EText>$162.40</EText></template>
      </EListRow>
      <EListRow value="old" title="September receipt" subtitle="Paid Sep 24, 2026" disabled />
    </EList>
    <EList v-model="current" label="Games, with the live mark's place kept">
      <EListRow value="a" title="You – Dameless" subtitle="5+3 · rated" live live-tone="danger" trailing-stack>
        <template #trailing><span>1–0</span><span>now</span></template>
        <template #actions><EIconButton icon="trash" label="Delete game" size="xs" /></template>
      </EListRow>
      <EListRow value="b" title="You – cutemouse83" subtitle="10+0 · casual" :live="false" trailing-stack expanded>
        <template #trailing><span>½–½</span><span>2 min ago</span></template>
        <template #actions><EIconButton icon="trash" label="Delete older game" size="xs" /></template>
      </EListRow>
    </EList>
    <EText size="sm" tone="muted">Current row: {{ current }}.</EText>
  </EStack>
</template>
