<script setup lang="ts">
import { EActions, EButton, EStack, ESurface, EText } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EActions>
      <EButton>Pay $162.40</EButton>
      <EButton variant="outline">View details</EButton>
      <EButton variant="quiet">Skip</EButton>
    </EActions>
    <EActions label="Show">
      <EButton variant="outline" aria-pressed="true">All</EButton>
      <EButton variant="outline" aria-pressed="false">Needs payment</EButton>
      <EButton variant="outline" aria-pressed="false">Paid</EButton>
    </EActions>
    <div style="max-width: 18rem">
      <EActions bar stack="never">
        <EButton>Save</EButton>
        <EButton variant="outline">Cancel</EButton>
      </EActions>
    </div>
    <ESurface as="article" aria-label="October statement">
      <EText>October statement, due Oct 31, 2026.</EText>
      <template #actions>
        <EButton>Pay</EButton>
        <EButton variant="outline">Download</EButton>
      </template>
    </ESurface>
  </EStack>
</template>
