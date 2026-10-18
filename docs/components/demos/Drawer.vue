<script setup lang="ts">
import { ref } from "vue";
import { EButton, EDrawer, EInline, EStack } from "@eos-ui/vue";

const right = ref(false);
const left = ref(false);
</script>

<template>
  <EStack>
    <EInline>
      <EButton variant="outline" @click="right = true">Open October statement</EButton>
      <EButton variant="outline" @click="left = true">Open from the left</EButton>
    </EInline>

    <EDrawer v-model:open="right" title="October statement">
      <p>Visit on Oct 8, 2026: $120.00</p>
      <p>Lab work: $42.40</p>
      <p>Total due Oct 22, 2026: $162.40</p>
      <template #actions>
        <EButton>Pay now</EButton>
        <EButton variant="outline" @click="right = false">Close</EButton>
      </template>
    </EDrawer>

    <EDrawer v-model:open="left" side="left" title="Filters">Show statements from the last 12 months.</EDrawer>

    <!-- inline shows a drawer in the page without the backdrop or focus trap: only for a preview -->
    <EDrawer inline :open="true" title="September receipt">Paid $98.00 on Sep 24, 2026.</EDrawer>
  </EStack>
</template>
