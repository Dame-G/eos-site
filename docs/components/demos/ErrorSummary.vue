<script setup lang="ts">
import { ref } from "vue";
import { EButton, EErrorSummary, EStack, EText } from "@eos-ui/vue";

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
    <EErrorSummary :errors="errors" :auto-focus="false" />
    <EText v-if="!errors.length" variant="small" muted>Nothing is wrong, so nothing is shown.</EText>
    <EButton variant="outline" :disabled="!errors.length" @click="fix">Fix the form</EButton>
  </EStack>
</template>
