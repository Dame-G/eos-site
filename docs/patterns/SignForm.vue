<script setup lang="ts">
import { computed, ref } from "vue";
import {
  EActions,
  EButton,
  EGrid,
  EHeading,
  ELink,
  EIcon,
  ENotice,
  EStack,
  EStamp,
  ESurface,
  EText,
  EUpload,
  ESignatureField,
} from "@eos-ui/vue";
import type { SignatureValue } from "@eos-ui/vue";

const signature = ref<SignatureValue>({ method: "type", name: "", image: "", agreed: false });
const id = ref<File[]>([]);
const submitted = ref(false);
const forms = computed(() => [
  { label: "New client form", text: "Due before your visit on Oct 22", icon: "form", status: submitted.value ? "signed" : "action" },
  { label: "Privacy notice", text: "Due before your visit on Oct 22", icon: "shield", status: "action" },
  { label: "Payment plan agreement", text: "Signed Oct 3", icon: "form", status: "signed" },
] as const);
const signed = computed(() => signature.value.agreed && !!(signature.value.name || signature.value.image));
</script>

<template>
  <EGrid min="22rem" gap="section" class="pattern-lg">
    <EStack gap="base">
      <EHeading :level="2" kicker="Forms">To do before your visit</EHeading>
      <ENotice tone="warning" title="2 forms need your signature">Please finish them before Oct 22.</ENotice>
      <ul class="sign-list">
        <li v-for="f in forms" :key="f.label" class="sign-row">
          <EIcon :name="f.icon" />
          <div class="sign-main">
            <p class="sign-title">{{ f.label }}</p>
            <p class="sign-text">{{ f.text }}</p>
          </div>
          <EStamp class="sign-stamp" :status="f.status" size="sm" />
          <div class="sign-action">
            <EButton v-if="f.status === 'signed'" variant="quiet" icon="download">Download</EButton>
            <EButton v-else variant="outline">Review and sign</EButton>
          </div>
        </li>
      </ul>
    </EStack>

    <ESurface padding="section">
      <EStack gap="loose">
        <ELink href="#forms" icon="arrow-left">Back to forms</ELink>
        <EHeading :level="2">New client form</EHeading>
        <EText tone="muted">By signing, you confirm the details you gave us are correct and you agree to our payment policy.</EText>
        <ESignatureField v-model="signature" mode="both" :date="new Date(2026, 9, 18, 12)" />
        <EUpload v-model="id" label="Photo ID" optional accept=".jpg,.png,.pdf" hint="A photo of your driver licence or passport." />
        <ENotice v-if="submitted" tone="success" title="Form submitted">Thank you. We have your signed form.</ENotice>
        <EActions>
          <EButton :disabled="!signed" @click="submitted = true">Submit signed form</EButton>
          <EButton variant="outline">Save for later</EButton>
        </EActions>
      </EStack>
    </ESurface>
  </EGrid>
</template>

<style scoped>
.sign-list {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sign-row {
  display: grid;
  /* The stamp's column is as wide as the stamp, so a longer status never runs out of it. */
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--e-space-1) var(--e-space-3);
  padding: var(--e-space-3) 0;
}

.sign-stamp {
  justify-self: end;
}

.sign-action {
  grid-column: 2 / -1;
  margin-top: var(--e-space-1);
}

.sign-row + .sign-row {
  border-top: var(--e-stroke-hair) solid var(--e-border);
}

.sign-main {
  flex: 1 1 10rem;
  min-width: 0;
}

.sign-title {
  margin: 0;
  font: 500 var(--e-text-md) / 1.3 var(--e-font-sans);
}

.sign-text {
  margin: var(--e-space-1) 0 0;
  color: var(--e-muted);
  font: 400 var(--e-text-sm) / 1.4 var(--e-font-sans);
}
</style>
