<script setup lang="ts">
import { ref } from "vue";
import { EButton, EItemRow, EStack } from "@eos-ui/vue";

const signed = ref(false);
</script>

<template>
  <EStack>
    <EItemRow
      title="New client form"
      subtitle="Due Oct 22, 2026"
      icon="form"
      :status="signed ? 'signed' : 'action'"
    >
      <template #action>
        <EButton variant="outline" :disabled="signed" @click="signed = true">Sign form</EButton>
      </template>
    </EItemRow>
    <EItemRow title="October statement" subtitle="$162.40" icon="receipt" status="due" />
  </EStack>
</template>
