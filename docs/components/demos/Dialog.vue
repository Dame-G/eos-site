<script setup lang="ts">
import { ref } from "vue";
import { EButton, EDialog, EStack } from "@eos-ui/vue";

const open = ref(false);
const cancelled = ref(false);

function cancel() {
  cancelled.value = true;
  open.value = false;
}
</script>

<template>
  <EStack>
    <EButton variant="outline" @click="open = true">Cancel appointment</EButton>
    <p>{{ cancelled ? "Your Oct 22, 2026 visit was cancelled." : "Your visit on Oct 22, 2026 is booked." }}</p>

    <EDialog v-model:open="open" title="Cancel this appointment?">
      You can book again at any time.
      <template #actions>
        <EButton variant="danger" @click="cancel">Cancel appointment</EButton>
        <EButton variant="outline" @click="open = false">Keep it</EButton>
      </template>
    </EDialog>

    <!-- inline shows a dialog in the page without the backdrop or focus trap: only for a preview -->
    <EDialog inline :open="true" title="Pay $162.40?">
      The amount is taken from your card ending 4242.
      <template #actions>
        <EButton>Pay now</EButton>
        <EButton variant="outline">Not now</EButton>
      </template>
    </EDialog>
  </EStack>
</template>
