<script setup lang="ts">
import { ref } from "vue";
import { EButton, EDialog, ENotice, ESegmented, ESpinner, EStack, EText } from "@eos-ui/vue";

const open = ref(false);
const long = ref(false);
const cancelled = ref(false);
// The preview only switches the inline dialog below between its states.
const state = ref("Ready");

function cancel() {
  cancelled.value = true;
  open.value = false;
}
</script>

<template>
  <EStack>
    <EButton variant="outline" @click="open = true">Cancel appointment</EButton>
    <EText size="sm" tone="muted">{{ cancelled ? "Your Oct 22, 2026 visit was cancelled." : "Your visit on Oct 22, 2026 is booked." }}</EText>

    <EDialog v-model:open="open" dismissible title="Cancel this appointment?">
      You can book again at any time.
      <template #actions>
        <EButton variant="danger" @click="cancel">Cancel appointment</EButton>
        <EButton variant="outline" @click="open = false">Keep it</EButton>
      </template>
    </EDialog>

    <EButton variant="outline" @click="long = true">Remove every statement</EButton>
    <EDialog v-model:open="long" dismissible title="Remove all 3 statements from your account, including those marked paid, and their receipts?">
      This cannot be undone, so take a moment to be sure.
      <template #actions>
        <EButton variant="danger" @click="long = false">Remove statements</EButton>
        <EButton variant="outline" @click="long = false">Keep them</EButton>
      </template>
    </EDialog>

    <ESegmented v-model="state" label="Preview state" :options="['Ready', 'Paying', 'Failed']" />

    <EDialog v-if="state === 'Ready'" inline :open="true" title="Pay $162.40?">
      The amount is taken from your card ending 4242.
      <template #actions>
        <EButton>Pay now</EButton>
        <EButton variant="outline">Not now</EButton>
      </template>
    </EDialog>

    <EDialog v-else-if="state === 'Paying'" inline :open="true" title="Paying $162.40">
      <ESpinner label="Waiting for your bank" />
      <template #actions>
        <EButton disabled>Pay now</EButton>
        <EButton variant="outline">Cancel</EButton>
      </template>
    </EDialog>

    <EDialog v-else inline :open="true" role="alertdialog" title="Payment failed">
      <ENotice tone="danger" title="Card declined">Check the card number or use another card. You have not been charged.</ENotice>
      <template #actions>
        <EButton>Try again</EButton>
        <EButton variant="outline">Use another card</EButton>
      </template>
    </EDialog>
  </EStack>
</template>
