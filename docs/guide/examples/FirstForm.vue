<script setup lang="ts">
import { computed, ref } from "vue";
import { EButton, EForm, ETextField, EToastProvider, useToast } from "@eos-ui/vue";

const toast = useToast();
const email = ref("");
// Set by the first failed submit, so nobody is told off for a field they have not reached.
const tried = ref(false);

const emailError = computed(() => {
  if (!tried.value) return undefined;
  if (!email.value.trim()) return "Enter your email address";
  if (!/^[^\s@]+@[^\s@]+$/.test(email.value.trim())) return "Enter an email address like name@example.com";
  return undefined;
});

// EForm calls this only when every field passes.
function join() {
  toast.show({ title: "You are on the list", message: `We will write to ${email.value}.`, tone: "success" });
  email.value = "";
  tried.value = false;
}
</script>

<template>
  <!-- In your app the EToastProvider is in App.vue. This example mounts its own so it works on this page. -->
  <EToastProvider>
    <EForm :summary="false" @invalid="tried = true" @submit.prevent="join">
      <ETextField v-model="email" label="Email" type="email" autocomplete="email" required :error="emailError" />
      <EButton type="submit">Join the list</EButton>
    </EForm>
  </EToastProvider>
</template>
