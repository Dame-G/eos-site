<script setup lang="ts">
import { ref } from "vue";
import { EButton, EDrawer, EInline, EStack, EText } from "@eos-ui/vue";

const right = ref(false);
const left = ref(false);
const bottom = ref(false);
</script>

<template>
  <EStack>
    <EInline>
      <EButton variant="outline" @click="right = true">Open October statement</EButton>
      <EButton variant="outline" @click="left = true">Open from the left</EButton>
      <EButton variant="outline" @click="bottom = true">Open from the bottom</EButton>
    </EInline>

    <EDrawer v-model:open="right" dismissible title="October statement">
      <EText>Visit on Oct 8, 2026: $120.00</EText>
      <EText>Lab work: $42.40</EText>
      <EText>Total due Oct 22, 2026: $162.40</EText>
      <template #actions>
        <EButton>Pay now</EButton>
        <EButton variant="outline" @click="right = false">Close</EButton>
      </template>
    </EDrawer>

    <EDrawer v-model:open="left" dismissible side="left" title="Filters">Show statements from the last 12 months.</EDrawer>

    <EDrawer v-model:open="bottom" dismissible side="bottom" title="Pay a bill">
      <EText>Total due Oct 22, 2026: $162.40</EText>
      <template #actions>
        <EButton>Pay now</EButton>
        <EButton variant="outline" @click="bottom = false">Close</EButton>
      </template>
    </EDrawer>

    <EDrawer inline :open="true" title="September receipt">Paid $98.00 on Sep 24, 2026.</EDrawer>
  </EStack>
</template>
