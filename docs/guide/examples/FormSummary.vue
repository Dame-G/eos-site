<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { EButton, EForm, ETextField, EToastProvider, useToast } from "@eos-ui/vue";

const toast = useToast();
const form = ref<InstanceType<typeof EForm> | null>(null);
const first = ref("");
const phone = ref("");
const saving = ref(false);
// Set by the first submit, so the errors appear only once someone has tried.
const tried = ref(false);

const firstError = computed(() => (tried.value && !first.value.trim() ? "Enter your first name" : undefined));
const phoneError = computed(() => (tried.value && phone.value.replace(/\D/g, "").length !== 10 ? "Enter a mobile number with 10 digits" : undefined));

async function save() {
  // The browser's own checks passed. Turn on the errors and check again, for the rules only this code knows.
  tried.value = true;
  await nextTick();
  if (!form.value?.validate()) return;
  saving.value = true;
  await new Promise((r) => setTimeout(r, 600)); // stands in for the request
  saving.value = false;
  toast.show({ title: "Details saved", tone: "success" });
}
</script>

<template>
  <!-- In your app the EToastProvider is in App.vue. This example mounts its own so it works on this page. -->
  <EToastProvider>
    <EForm ref="form" :submitting="saving" @invalid="tried = true" @submit.prevent="save">
      <ETextField v-model="first" label="First name" autocomplete="given-name" required :error="firstError" />
      <ETextField v-model="phone" label="Mobile phone" type="tel" autocomplete="tel" required :error="phoneError" />
      <EButton type="submit" :loading="saving">Save</EButton>
    </EForm>
  </EToastProvider>
</template>
