<script setup lang="ts">
import { EButton, EPanel, EStack } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EPanel kicker="Account" title="Contact details">
      <template #action><EButton variant="outline">Edit</EButton></template>
      <p>Jordan Lee, jordan@example.com</p>
    </EPanel>

    <EPanel title="Balance" :heading-level="2">
      <p>You owe $162.40, due Oct 22, 2026.</p>
    </EPanel>

    <EPanel aria-label="Notes">
      <p>Bring your insurance card to the visit.</p>
    </EPanel>
  </EStack>
</template>
