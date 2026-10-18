<script setup lang="ts">
import { ref } from "vue";
import { EButton, EInline, EStack } from "@eos-ui/vue";
const busy = ref(false);
function pay() {
  busy.value = true;
  setTimeout(() => (busy.value = false), 1200);
}
</script>

<template>
  <EStack>
    <EInline>
      <EButton icon="lock" @click="pay">Pay $162.40</EButton>
      <EButton variant="secondary">Confirm</EButton>
      <EButton variant="outline">Cancel</EButton>
      <EButton variant="danger">Remove card</EButton>
      <EButton variant="quiet">Skip this step</EButton>
    </EInline>
    <EInline>
      <EButton disabled>Disabled</EButton>
      <EButton variant="outline" disabled>Disabled outline</EButton>
    </EInline>
    <EButton block>Full width</EButton>
  </EStack>
</template>
