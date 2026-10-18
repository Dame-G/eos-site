<script setup lang="ts">
import { ref } from "vue";
import { EButton, EErrorSummary, EStack } from "@eos-ui/vue";

const errors = ref([
  { field: "Email", message: "Enter an email address" },
  { message: "Choose a date for your visit" },
]);

function fix() {
  errors.value = [];
}
</script>

<template>
  <EStack>
    <!-- autoFocus is off here so the demo does not pull focus on load -->
    <EErrorSummary :errors="errors" :auto-focus="false" />
    <p v-if="!errors.length">Nothing is wrong, so nothing is shown.</p>
    <EButton variant="outline" :disabled="!errors.length" @click="fix">Fix the form</EButton>
  </EStack>
</template>
