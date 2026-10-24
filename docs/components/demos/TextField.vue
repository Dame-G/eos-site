<script setup lang="ts">
import { ref } from "vue";
import { ETextField, EStack, EText } from "@eos-ui/vue";

const email = ref("");
const amount = ref("162.40");
</script>

<template>
  <EStack>
    <ETextField
      v-model="email"
      label="Email"
      type="email"
      autocomplete="email"
      placeholder="name@example.com"
      hint="We send receipts here."
      required
    />
    <EText size="sm" tone="neutral">You typed: {{ email || "nothing yet" }}</EText>
    <ETextField v-model="amount" label="Payment amount" prefix="$" suffix="USD" inputmode="decimal" optional />
    <ETextField label="Card number" model-value="4242 42" error="Enter all 16 digits." autocomplete="cc-number" />
    <ETextField label="Account number" model-value="Not editable" disabled />
    <ETextField label="Reference" model-value="INV-2026-1022" readonly />
  </EStack>
</template>
