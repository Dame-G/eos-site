<script setup lang="ts">
import { ref } from "vue";
import { EButton, EInline, EStack, EStepper } from "@eos-ui/vue";

const names = ["Your details", "Insurance", "Sign the form", "Confirm"];
const current = ref(1);
const steps = () =>
  names.map((label, i) => ({
    label,
    state: i < current.value ? ("done" as const) : i === current.value ? ("current" as const) : ("upcoming" as const),
  }));
</script>

<template>
  <EStack>
    <EStepper label="Registration" :steps="steps()" />
    <EInline>
      <EButton variant="outline" :disabled="current === 0" @click="current--">Back</EButton>
      <EButton :disabled="current === names.length - 1" @click="current++">Next</EButton>
    </EInline>
  </EStack>
</template>
