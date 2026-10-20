<script setup lang="ts">
import { EButton, EInline, EStack, EText, EVisuallyHidden } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EInline>
      <EButton icon="download" variant="outline">Download <EVisuallyHidden>receipt 8842</EVisuallyHidden></EButton>
      <EButton icon="download" variant="outline">Download <EVisuallyHidden>receipt 8843</EVisuallyHidden></EButton>
    </EInline>
    <EText>Step 1: Sign the form<EVisuallyHidden> (done)</EVisuallyHidden></EText>
    <EText muted small>Inspect the buttons: the extra words are in the accessible name only.</EText>
  </EStack>
</template>
