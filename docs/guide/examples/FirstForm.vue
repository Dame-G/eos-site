<script setup lang="ts">
import { computed, ref } from "vue";
import { EButton, EStack, EToastProvider, ETextField, useToast } from "@eos-ui/vue";

const toast = useToast();
const email = ref("");
const submitted = ref(false);

// Show an error only after the first submit, so nobody is told off for a field they have not reached.
const emailError = computed(() => {
  if (!submitted.value) return undefined;
  if (!email.value.trim()) return "Enter your email address";
  if (!/^\S+@\S+\.\S+$/.test(email.value)) return "Enter an email address like name@example.com";
  return undefined;
});

function submit() {
  submitted.value = true;
  if (emailError.value) return;
  toast.show({ title: "You are on the list", message: `We will write to ${email.value}.`, tone: "success" });
  email.value = "";
  submitted.value = false;
}
</script>

<template>
  <EToastProvider>
    <form novalidate @submit.prevent="submit">
      <EStack>
        <ETextField v-model="email" label="Email" type="email" autocomplete="email" required :error="emailError" />
        <EButton type="submit">Join the list</EButton>
      </EStack>
    </form>
  </EToastProvider>
</template>
