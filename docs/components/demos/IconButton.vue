<script setup lang="ts">
import { ref } from "vue";
import { EIconButton, EInline, EStack, EText } from "@eos-ui/vue";
const last = ref("Nothing pressed yet.");
</script>

<template>
  <EStack>
    <!-- The label is the accessible name: write it as an action -->
    <EInline>
      <EIconButton icon="download" label="Download receipt" @click="last = 'Receipt downloaded.'" />
      <EIconButton icon="print" label="Print statement" @click="last = 'Statement sent to the printer.'" />
      <EIconButton icon="mail" label="Email statement" @click="last = 'Statement emailed.'" />
      <EIconButton icon="trash" label="Remove saved card" disabled />
    </EInline>
    <EText muted role="status">{{ last }}</EText>
  </EStack>
</template>
