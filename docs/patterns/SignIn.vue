<script setup lang="ts">
import { computed, ref } from "vue";
import {
  EActions,
  EButton,
  ECheckbox,
  EForm,
  EGrid,
  EHeading,
  ELink,
  EOtpField,
  EPasswordField,
  EStack,
  ESurface,
  EText,
  ETextField,
} from "@eos-ui/vue";

const email = ref("");
const password = ref("");
const newPassword = ref("");
const keep = ref(false);
// Set when a submit fails, so the errors appear only once someone has tried.
const tried = ref(false);
const code = ref("");

const rules = [
  { label: "At least 10 characters", test: (v: string) => v.length >= 10 },
  { label: "Includes a number", test: (v: string) => /\d/.test(v) },
];

// Both rules are also the browser's own (required, type="email"), so EForm stops the first submit and these give the words.
const emailError = computed(() => {
  if (!tried.value) return undefined;
  if (!email.value.trim()) return "Enter your email address";
  if (!/^[^s@]+@[^s@]+$/.test(email.value.trim())) return "Enter an email address like name@example.com";
  return undefined;
});
const passwordError = computed(() => (tried.value && !password.value ? "Enter your password" : undefined));
</script>

<template>
  <EGrid min="20rem" gap="section" class="pattern-lg">
    <ESurface padding="section">
      <EStack gap="loose">
        <EHeading :level="2">Sign in</EHeading>
        <EForm @invalid="tried = true" @submit.prevent>
          <ETextField
            id="si-email"
            v-model="email"
            label="Email address"
            type="email"
            autocomplete="username"
            required
            placeholder="name@example.com"
            :error="emailError"
          />
          <EPasswordField
            id="si-password"
            v-model="password"
            label="Password"
            mode="current"
            required
            :error="passwordError"
          />
          <ELink href="#forgot">Forgot your password?</ELink>
          <ECheckbox v-model="keep" label="Keep me signed in on this device" />
          <EActions>
            <EButton type="submit">Sign in</EButton>
            <EButton variant="outline" icon="mail" type="button">Email me a sign-in code</EButton>
          </EActions>
        </EForm>
      </EStack>
    </ESurface>

    <ESurface padding="section">
      <EStack gap="loose">
        <ELink href="#sign-in" icon="arrow-left">Back to sign in</ELink>
        <EHeading :level="2">Check your email</EHeading>
        <EText tone="muted">We sent a 6-digit code to m***@example.com. It expires in 10 minutes.</EText>
        <EOtpField v-model="code" label="Sign-in code" :length="6" :group-size="3" hint="Enter the code from the email." />
        <EActions>
          <EButton :disabled="code.length < 6">Verify and sign in</EButton>
          <EButton variant="quiet">Send a new code</EButton>
        </EActions>
      </EStack>
    </ESurface>

    <ESurface padding="section">
      <EStack gap="loose">
        <EHeading :level="2">Choose a new password</EHeading>
        <EPasswordField v-model="newPassword" label="New password" mode="new" :rules="rules" required />
      </EStack>
    </ESurface>
  </EGrid>
</template>
