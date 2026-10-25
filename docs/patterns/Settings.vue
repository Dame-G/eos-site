<script setup lang="ts">
import { computed, nextTick, reactive, ref } from "vue";
import { EButton, EFieldset, EForm, EPageHeader, ESelect, EStack, ESwitch, ETextField, EToastProvider, useToast } from "@eos-ui/vue";

const toast = useToast();

const saved = reactive({ name: "Ana Ruiz", email: "ana@example.com", language: "English", reminders: true, receipts: false });
const draft = reactive({ ...saved });
const form = ref<InstanceType<typeof EForm> | null>(null);
// Set by the first press of Save changes, so the errors appear only once someone has tried.
const tried = ref(false);

const nameError = computed(() => (tried.value && !draft.name.trim() ? "Enter your name" : undefined));
const emailError = computed(() => (tried.value && !/^[^\s@]+@[^\s@]+$/.test(draft.email.trim()) ? "Enter an email address like name@example.com" : undefined));

async function save() {
  // The browser's own checks passed. Turn on the errors and check again, for the rules only this code knows.
  tried.value = true;
  await nextTick();
  if (!form.value?.validate()) return;
  Object.assign(saved, draft);
  toast.show({ title: "Settings saved", tone: "success" });
}
function discard() {
  Object.assign(draft, saved);
  tried.value = false;
}
</script>

<template>
  <div class="pattern-md">
    <EToastProvider>
      <EForm ref="form" @invalid="tried = true" @submit.prevent="save">
        <EStack gap="section">
          <EPageHeader :heading-level="2" title="Settings" description="How we reach you and which language you read." />

          <EFieldset variant="section" legend="Profile" hint="Used on receipts.">
            <EStack>
              <ETextField v-model="draft.name" label="Name" autocomplete="name" :error="nameError" />
              <ETextField v-model="draft.email" label="Email" type="email" autocomplete="email" :error="emailError" />
              <ESelect v-model="draft.language" label="Language" :options="['English', 'Français', 'Español']" />
            </EStack>
          </EFieldset>

          <EFieldset variant="section" legend="Notifications" hint="These save when you press Save changes.">
            <EStack>
              <ESwitch v-model="draft.reminders" label="Visit reminders" description="A text two days before each visit." />
              <ESwitch v-model="draft.receipts" label="Email receipts" description="A receipt after each payment." />
            </EStack>
          </EFieldset>

          <EStack gap="snug">
            <EButton type="submit">Save changes</EButton>
            <EButton variant="quiet" type="button" @click="discard">Discard changes</EButton>
          </EStack>
        </EStack>
      </EForm>
    </EToastProvider>
  </div>
</template>
