<script setup lang="ts">
import { ref } from "vue";
import { EButton, EInline, EProgress, EStack } from "@eos-ui/vue";
const step = ref(2);
</script>

<template>
  <EStack>
    <EProgress label="Upload of insurance card" :value="40" />
    <!-- Custom max, and your own text at the end of the row -->
    <EProgress label="Booking steps" :value="step" :max="4" :value-text="`${step} of 4`" />
    <EInline>
      <EButton variant="outline" :disabled="step <= 0" @click="step--">Back</EButton>
      <EButton :disabled="step >= 4" @click="step++">Next step</EButton>
    </EInline>
    <EProgress label="Statement paid" :value="162.4" :max="162.4" value-text="$162.40 of $162.40" />
  </EStack>
</template>
