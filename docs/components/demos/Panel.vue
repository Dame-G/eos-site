<script setup lang="ts">
import { EButton, EPanel, EStack, EText } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EPanel kicker="Account" title="Contact details">
      <template #action><EButton variant="outline">Edit</EButton></template>
      <EText>Jordan Lee, jordan@example.com</EText>
    </EPanel>

    <EPanel title="Balance" :heading-level="2">
      <EText>You owe $162.40, due Oct 22, 2026.</EText>
    </EPanel>

    <EPanel aria-label="Notes">
      <EText>Bring your insurance card to the visit.</EText>
    </EPanel>
  </EStack>
</template>
