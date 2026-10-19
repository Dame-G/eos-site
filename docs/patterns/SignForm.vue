<script setup lang="ts">
import { computed, ref } from "vue";
import {
  EActions,
  EBackLink,
  EButton,
  EGrid,
  EHeading,
  EIconButton,
  EItemList,
  EItemRow,
  ENotice,
  ESignatureField,
  EStack,
  ESurface,
  EText,
  EUpload,
} from "@eos-ui/vue";
import type { SignatureValue } from "@eos-ui/vue";

const signature = ref<SignatureValue>({ method: "type", name: "", image: "", agreed: false });
const id = ref<File[]>([]);
const submitted = ref(false);
const signed = computed(() => signature.value.agreed && !!(signature.value.name || signature.value.image));
</script>

<template>
  <EGrid min="22rem" :gap="6" class="pattern-lg">
    <EStack :gap="3">
      <EHeading :level="2" kicker="Forms">To do before your visit</EHeading>
      <ENotice tone="warning" title="2 forms need your signature">Please finish them before Oct 22.</ENotice>
      <EItemList>
        <EItemRow icon="form" title="New client form" subtitle="Due before your visit on Oct 22" :status="submitted ? 'signed' : 'action'">
          <template #action><EButton variant="outline">Review and sign</EButton></template>
        </EItemRow>
        <EItemRow icon="shield" title="Privacy notice" subtitle="Due before your visit on Oct 22" status="action">
          <template #action><EButton variant="outline">Review and sign</EButton></template>
        </EItemRow>
        <EItemRow icon="form" title="Payment plan agreement" subtitle="Signed Oct 3" status="signed">
          <template #action><EIconButton icon="download" label="Download payment plan agreement" /></template>
        </EItemRow>
      </EItemList>
    </EStack>

    <ESurface pad="lg">
      <EStack :gap="4">
        <EBackLink href="#forms">Back to forms</EBackLink>
        <EHeading :level="2">New client form</EHeading>
        <EText muted>By signing, you confirm the details you gave us are correct and you agree to our payment policy.</EText>
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
