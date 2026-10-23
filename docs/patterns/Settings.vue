<script setup lang="ts">
import { reactive, ref } from "vue";
import { EButton, EFieldset, EPageHeader, ESelect, EStack, ESwitch, ETextField, EToastProvider, useToast } from "@eos-ui/vue";

const toast = useToast();

const saved = reactive({ name: "Ana Ruiz", email: "ana@example.com", language: "English", reminders: true, receipts: false });
const form = reactive({ ...saved });
const submitted = ref(false);

const nameError = () => (submitted.value && !form.name.trim() ? "Enter your name" : undefined);
const emailError = () => (submitted.value && !/^\S+@\S+\.\S+$/.test(form.email) ? "Enter an email address like name@example.com" : undefined);

function save() {
  submitted.value = true;
  if (nameError() || emailError()) return;
  Object.assign(saved, form);
  toast.show({ title: "Settings saved", tone: "success" });
}
function reset() {
  Object.assign(form, saved);
  submitted.value = false;
}
</script>

<template>
  <div class="pattern-md">
    <EToastProvider>
      <form novalidate @submit.prevent="save">
        <EStack :gap="6">
          <EPageHeader :heading-level="2" title="Settings" description="How we reach you and which language you read." />

          <EFieldset section legend="Profile" hint="Used on receipts.">
            <EStack>
              <ETextField v-model="form.name" label="Name" autocomplete="name" :error="nameError()" />
              <ETextField v-model="form.email" label="Email" type="email" autocomplete="email" :error="emailError()" />
              <ESelect v-model="form.language" label="Language" :options="['English', 'Français', 'Español']" />
            </EStack>
          </EFieldset>

          <EFieldset section legend="Notifications" hint="These save when you press Save changes.">
            <EStack>
              <ESwitch v-model="form.reminders" label="Visit reminders" description="A text two days before each visit." />
              <ESwitch v-model="form.receipts" label="Email receipts" description="A receipt after each payment." />
            </EStack>
          </EFieldset>

          <EStack :gap="2">
            <EButton type="submit">Save changes</EButton>
            <EButton variant="quiet" type="button" @click="reset">Discard changes</EButton>
          </EStack>
        </EStack>
      </form>
    </EToastProvider>
  </div>
</template>
