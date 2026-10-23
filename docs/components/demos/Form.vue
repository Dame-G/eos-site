<script setup lang="ts">
import { ref } from "vue";
import { EButton, EForm, EInline, EText, ETextField } from "@eos-ui/vue";

const name = ref("");
const email = ref("");
const saving = ref(false);
const saved = ref(false);
const emailError = ref("");

function save() {
  saved.value = false;
  saving.value = true;
  // Pretend the server answered a moment later.
  setTimeout(() => {
    saving.value = false;
    saved.value = true;
  }, 600);
}
</script>

<template>
  <EForm :submitting="saving" @submit.prevent="save">
    <ETextField v-model="name" label="Name" required />
    <ETextField v-model="email" label="Email" type="email" required :error="emailError" />
    <EInline>
      <EButton type="submit" :loading="saving">Save</EButton>
      <EText v-if="saved" role="status">Saved.</EText>
    </EInline>
  </EForm>
</template>
