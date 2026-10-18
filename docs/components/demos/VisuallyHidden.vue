<script setup lang="ts">
import { EButton, EInline, EStack, EText, EVisuallyHidden } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <!-- Screen readers hear "Download receipt 8842"; sighted people see "Download" -->
    <EInline>
      <EButton icon="download" variant="outline">Download <EVisuallyHidden>receipt 8842</EVisuallyHidden></EButton>
      <EButton icon="download" variant="outline">Download <EVisuallyHidden>receipt 8843</EVisuallyHidden></EButton>
    </EInline>
    <EText>Step 1: Sign the form<EVisuallyHidden> (done)</EVisuallyHidden></EText>
    <EText muted variant="small">Inspect the buttons: the extra words are in the accessible name only.</EText>
  </EStack>
</template>
