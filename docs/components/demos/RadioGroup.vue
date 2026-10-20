<script setup lang="ts">
import { ref } from "vue";
import { ERadioGroup, ETextField, EStack, EText } from "@eos-ui/vue";

const amount = ref("part");
const other = ref("50.00");
const method = ref("card");
</script>

<template>
  <EStack>
    <ERadioGroup
      v-model="amount"
      label="How much would you like to pay?"
      hint="Your balance is $162.40."
      :options="[
        { value: 'full', label: 'Pay in full', description: '$162.40' },
        { value: 'part', label: 'Another amount' },
      ]"
    >
      <template #reveal="{ option }">
        <ETextField v-if="option.value === 'part'" v-model="other" label="Amount" prefix="$" hide-label inputmode="decimal" />
      </template>
    </ERadioGroup>
    <EText small muted>Choice: {{ amount }}</EText>
    <ERadioGroup
      v-model="method"
      label="Pay with"
      :options="['card', 'bank', { value: 'cash', label: 'cash', disabled: true }]"
    />
    <ERadioGroup label="Statement delivery" :options="['Email', 'Post']" required error="Choose how to receive statements." />
    <ERadioGroup label="Currency" :options="['USD', 'CAD']" disabled />
  </EStack>
</template>
