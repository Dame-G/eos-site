<script setup lang="ts">
import { ref } from "vue";
import { ESelect, EStack, EText } from "@eos-ui/vue";

const method = ref("");
const plan = ref("pro");
const filter = ref("all");
</script>

<template>
  <EStack>
    <ESelect v-model="method" label="Pay with" :options="['Visa ending 4242', 'Bank account', 'Cash']" required />
    <EText size="sm" tone="muted">Chosen: {{ method || "nothing yet" }}</EText>
    <ESelect
      v-model="plan"
      label="Plan"
      hint="You can change it later."
      :options="[
        { value: 'basic', label: 'Basic', description: 'Free, forever', group: 'Personal' },
        { value: 'pro', label: 'Pro', description: '$12 a month', icon: 'check', group: 'Personal' },
        { value: 'team', label: 'Team', description: 'Not available yet', disabled: true, group: 'Business' },
      ]"
    />
    <ESelect label="Statement" :options="['Sep 2026', 'Aug 2026']" error="Choose a statement to download." />
    <ESelect label="Branch" :options="['Downtown']" disabled optional />
    <ESelect v-model="filter" bare aria-label="Show" :options="[{ value: 'all', label: 'All visits' }, { value: 'paid', label: 'Paid only' }]" />
  </EStack>
</template>
