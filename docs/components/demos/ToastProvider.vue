<script setup lang="ts">
import { h, provide } from "vue";
import { createToasts, EButton, EInline, EStack, EToastProvider, TOAST_KEY } from "@eos-ui/vue";

// A provider normally wraps the whole app and components call useToast() below it.
// This demo is the component that holds the provider, so it creates the store itself.
const toasts = createToasts();
provide(TOAST_KEY, toasts);

function paid() {
  toasts.show({ title: "Payment received", message: "A receipt for $162.40 was sent to your email.", tone: "success" });
}
function failed() {
  toasts.show({ title: "Payment failed", message: "Check the card number and try again.", tone: "danger" });
}
function undo() {
  toasts.show({
    title: "Statement removed",
    tone: "info",
    action: () => h(EButton, { variant: "outline", onClick: () => toasts.clear() }, () => "Undo"),
  });
}
</script>

<template>
  <EToastProvider>
    <EStack>
      <EInline>
        <EButton @click="paid">Pay $162.40</EButton>
        <EButton variant="outline" @click="failed">Decline the card</EButton>
        <EButton variant="outline" @click="undo">Remove statement</EButton>
        <EButton variant="quiet" @click="toasts.clear()">Clear all</EButton>
      </EInline>
      <p>Success and information go after five seconds. Errors and toasts with an action stay until dismissed.</p>
    </EStack>
  </EToastProvider>
</template>
