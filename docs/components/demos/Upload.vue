<script setup lang="ts">
import { onMounted, ref } from "vue";
import { EUpload, EStack } from "@eos-ui/vue";

const files = ref<File[]>([]);
// The insurance card starts out chosen: a picture of one, so the single-file zone shows it as a large preview.
const card = ref<File[]>([]);
// A file of the site's own (public/demos), not an imported asset: a small import is inlined as a data: URL, and the
// site's policy lets the page fetch only from its own origin.
onMounted(async () => {
  const image = await (await fetch("/demos/insurance-card.png")).blob();
  card.value = [new File([image], "insurance-card.png", { type: "image/png" })];
});
const signed = ref<File[]>([]);
const archived = [new File(["x".repeat(48000)], "records-2024.pdf", { type: "application/pdf" })];
</script>

<template>
  <EStack>
    <EUpload
      v-model="files"
      label="Referral letter"
      accept=".pdf,.jpg,.png"
      multiple
      :max-files="4"
      :max-size="5 * 1024 * 1024"
      hint="A scan or a photo of each page."
    />
    <EUpload v-model="card" label="Insurance card" accept=".png,.jpg" optional />
    <EUpload v-model="signed" label="Signed form" required :error="signed.length ? undefined : 'Attach the signed form to continue.'" />
    <EUpload :model-value="archived" label="Archived records" multiple disabled />
  </EStack>
</template>
