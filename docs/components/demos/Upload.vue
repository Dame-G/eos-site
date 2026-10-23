<script setup lang="ts">
import { ref } from "vue";
import { EUpload, EStack, EText } from "@eos-ui/vue";

const files = ref<File[]>([]);
const card = ref<File[]>([new File(["x".repeat(2048)], "insurance-card.pdf", { type: "application/pdf" })]);
</script>

<template>
  <EStack>
    <EUpload v-model="files" label="Referral letter" accept=".pdf,.jpg,.png" multiple hint="PDF or photo, up to 5 MB each." />
    <EText size="sm" tone="neutral">{{ files.length }} file(s) chosen.</EText>
    <EUpload v-model="card" label="Insurance card" accept=".pdf" optional />
    <EUpload label="Signed form" required error="Attach the signed form to continue." />
    <EUpload label="Archived records" disabled />
  </EStack>
</template>
