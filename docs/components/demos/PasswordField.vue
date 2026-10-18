<script setup lang="ts">
import { ref } from "vue";
import { EPasswordField, EStack } from "@eos-ui/vue";

const rules = [
  { label: "At least 10 characters", test: (v: string) => v.length >= 10 },
  { label: "Includes a number", test: (v: string) => /\d/.test(v) },
];
const fresh = ref("sunrise2026");
const current = ref("");
</script>

<template>
  <EStack>
    <EPasswordField v-model="fresh" label="Choose a password" mode="new" :rules="rules" required />
    <EPasswordField v-model="current" mode="current" hint="The one you use to sign in." />
    <EPasswordField label="Password" error="That password is not right." model-value="wrong" />
    <EPasswordField label="Old password" disabled optional />
  </EStack>
</template>
