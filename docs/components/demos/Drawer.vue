<script setup lang="ts">
import { ref } from "vue";
import { EButton, EDrawer, EInline, ENotice, ESegmented, ESpinner, EStack, EText } from "@eos-ui/vue";

const right = ref(false);
const left = ref(false);
const bottom = ref(false);
const long = ref(false);
// The preview only switches the inline drawer below between its states.
const state = ref("Ready");
</script>

<template>
  <EStack>
    <EInline>
      <EButton variant="outline" @click="right = true">Open October statement</EButton>
      <EButton variant="outline" @click="left = true">Open from the left</EButton>
      <EButton variant="outline" @click="bottom = true">Open from the bottom</EButton>
      <EButton variant="outline" @click="long = true">Open a long statement</EButton>
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

    <EDrawer v-model:open="left" dismissible side="start" title="Filters">Show statements from the last 12 months.</EDrawer>

    <EDrawer v-model:open="bottom" dismissible side="bottom" title="Pay a bill">
      <EText>Total due Oct 22, 2026: $162.40</EText>
      <template #actions>
        <EButton>Pay now</EButton>
        <EButton variant="outline" @click="bottom = false">Close</EButton>
      </template>
    </EDrawer>

    <EDrawer v-model:open="long" dismissible title="Annual statement with a long list of visits, labs and imaging">
      <EText v-for="n in 20" :key="n">Visit {{ n }} on Oct {{ n }}, 2026: ${{ (n * 12.5).toFixed(2) }}</EText>
      <template #actions><EButton variant="outline" @click="long = false">Close</EButton></template>
    </EDrawer>

    <ESegmented v-model="state" label="Preview state" :options="['Ready', 'Paying', 'Failed']" />

    <EDrawer v-if="state === 'Ready'" inline :open="true" title="September receipt">Paid $98.00 on Sep 24, 2026.</EDrawer>

    <EDrawer v-else-if="state === 'Paying'" inline :open="true" title="Pay October statement">
      <ESpinner label="Waiting for your bank" />
      <template #actions>
        <EButton disabled>Pay now</EButton>
        <EButton variant="outline">Cancel</EButton>
      </template>
    </EDrawer>

    <EDrawer v-else inline :open="true" title="Pay October statement">
      <ENotice tone="danger" title="Payment failed">Check the card number and try again. You have not been charged.</ENotice>
      <template #actions>
        <EButton>Try again</EButton>
        <EButton variant="outline">Close</EButton>
      </template>
    </EDrawer>
  </EStack>
</template>
