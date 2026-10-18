<script setup lang="ts">
import { EButton, EButtonGroup, EStack } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EButtonGroup label="Statement actions">
      <EButton variant="outline" icon="print">Print</EButton>
      <EButton variant="outline" icon="download">Download</EButton>
      <EButton variant="outline">Email a copy</EButton>
    </EButtonGroup>
    <EButtonGroup label="Payment options">
      <EButton>Pay $162.40</EButton>
      <EButton variant="secondary">Pay in installments</EButton>
      <EButton variant="quiet">Not now</EButton>
    </EButtonGroup>
  </EStack>
</template>
