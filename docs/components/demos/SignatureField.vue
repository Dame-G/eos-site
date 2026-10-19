<script setup lang="ts">
import { ref } from "vue";
import { ESignatureField, EStack, EText } from "@eos-ui/vue";
import type { SignatureValue } from "@eos-ui/vue";

const signed = ref<SignatureValue>({ method: "type", name: "Ana Ruiz", image: "", agreed: true });
const day = new Date(2026, 9, 22, 12);
</script>

<template>
  <EStack>
    <ESignatureField v-model="signed" mode="both" label="Sign the consent form" :date="day" />
    <EText variant="small" muted>{{ signed.agreed ? "Agreed" : "Not yet agreed" }} by {{ signed.name || "no name" }} ({{ signed.method }})</EText>
    <ESignatureField label="Sign the payment plan" mode="draw" agreement="I agree to pay $54.13 a month." :date="day" />
    <ESignatureField label="Signature" disabled :date="day" />
  </EStack>
</template>
