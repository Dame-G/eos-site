<script setup lang="ts">
import { ref } from "vue";
import { EButton, EStack, EToast } from "@eos-ui/vue";

// Toasts are normally shown with useToast() (see ToastProvider). EToast on its own is for previews.
const closable = ref(true);
</script>

<template>
  <EStack>
    <EToast title="Reminder set">We will message you on Oct 20, 2026.</EToast>
    <EToast tone="success" title="Payment received">A receipt for $162.40 was sent to your email.</EToast>
    <EToast tone="warning" title="Card expires soon">Your card ending 4242 expires in Nov 2026.</EToast>
    <EToast tone="danger" title="Payment failed">Check the card number and try again.</EToast>
    <EToast tone="success" title="Statement removed">
      You can bring it back for 30 days.
      <template #action><EButton variant="outline">Undo</EButton></template>
    </EToast>
    <!-- The dismiss button shows only when a close listener is attached -->
    <EToast v-if="closable" title="Saved" @close="closable = false">Your changes were saved.</EToast>
  </EStack>
</template>
