<script setup lang="ts">
import { ref } from "vue";
import { EButton, EInline, EPopover, EStack, EText } from "@eos-ui/vue";

const open = ref(true);
</script>

<template>
  <EStack>
    <EInline>
      <EPopover label="About payment plans" title="Payment plan">
        <template #trigger>What is a payment plan?</template>
        Split your balance of $162.40 into equal monthly payments. There is no interest and no fee.
        <template #actions><EButton variant="outline">Set up a plan</EButton></template>
      </EPopover>

      <EPopover label="Explains the due date">
        <template #trigger>Due date</template>
        Payment is due 14 days after the statement date, Oct 22, 2026.
      </EPopover>
    </EInline>

    <EPopover v-model="open" label="About late fees" title="Late fees">
      <template #trigger>Late fees</template>
      A $10.00 fee applies to balances paid after the due date.
    </EPopover>
    <EText variant="small" muted>The late fees panel is {{ open ? "open" : "closed" }}.</EText>
  </EStack>
</template>
