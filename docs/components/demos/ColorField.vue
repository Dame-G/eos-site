<script setup lang="ts">
import { ref } from "vue";
import { EColorField, EStack, EText } from "@eos-ui/vue";

const brand = ref("#bfa8f5");
</script>

<template>
  <EStack>
    <EColorField v-model="brand" label="Brand colour" hint="Pick a colour or type a hex value." />
    <EText size="sm" tone="neutral">Chosen: {{ brand }}</EText>
    <EColorField label="Accent colour" model-value="#9ad9b4" optional />
    <EColorField label="Card edge" model-value="#7f8f96" error="This pair does not reach 3:1 on white." />
    <EColorField label="Locked colour" model-value="#624b90" disabled />
  </EStack>
</template>
