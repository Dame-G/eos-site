<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import {
  EActions,
  EButton,
  ECheckbox,
  EGrid,
  EHeading,
  ELink,
  ENotice,
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
const submitted = ref(false);
const code = ref("");

const rules = [
  { label: "At least 10 characters", test: (v: string) => v.length >= 10 },
  { label: "Includes a number", test: (v: string) => /\d/.test(v) },
];

const problems = computed(() => {
  if (!submitted.value) return [];
  const list: { id: string; field: string; message: string }[] = [];
  if (!/^\S+@\S+\.\S+$/.test(email.value)) list.push({ id: "si-email", field: "Email address", message: "Enter an email address like name@example.com" });
  if (!password.value) list.push({ id: "si-password", field: "Password", message: "Enter your password" });
  return list;
});
const errorOf = (id: string) => problems.value.find((p) => p.id === id)?.message;

const focusField = (id: string) => document.getElementById(id)?.focus();

async function submit() {
  submitted.value = true;
  await nextTick();
  if (problems.value.length) focusField(problems.value[0]!.id);
}
</script>

<template>
  <EGrid min="20rem" :gap="6" class="pattern-lg">
    <ESurface large>
      <form novalidate @submit.prevent="submit">
        <EStack :gap="4">
          <EHeading :level="2">Sign in</EHeading>
          <ENotice v-if="problems.length" tone="danger" :title="problems.length === 1 ? 'Fix 1 thing to sign in' : `Fix ${problems.length} things to sign in`">
            <EStack as="ul" :gap="1">
              <li v-for="p in problems" :key="p.id">
                <ELink :href="`#${p.id}`" @click.prevent="focusField(p.id)">{{ p.field }}: {{ p.message }}</ELink>
              </li>
            </EStack>
          </ENotice>
          <ETextField
            id="si-email"
            v-model="email"
            label="Email address"
            type="email"
            autocomplete="username"
            required
            placeholder="name@example.com"
            :error="errorOf('si-email')"
          />
          <EPasswordField
            id="si-password"
            v-model="password"
            label="Password"
            mode="current"
            required
            :error="errorOf('si-password')"
          />
          <ELink href="#forgot">Forgot your password?</ELink>
          <ECheckbox v-model="keep" label="Keep me signed in on this device" />
          <EActions>
            <EButton type="submit">Sign in</EButton>
            <EButton variant="outline" icon="mail" type="button">Email me a sign-in code</EButton>
          </EActions>
        </EStack>
      </form>
    </ESurface>

    <ESurface large>
      <EStack :gap="4">
        <ELink href="#sign-in" icon="arrow-left">Back to sign in</ELink>
        <EHeading :level="2">Check your email</EHeading>
        <EText muted>We sent a 6-digit code to m***@example.com. It expires in 10 minutes.</EText>
        <EOtpField v-model="code" label="Sign-in code" :length="6" :group-size="3" hint="Enter the code from the email." />
        <EActions>
          <EButton :disabled="code.length < 6">Verify and sign in</EButton>
          <EButton variant="quiet">Send a new code</EButton>
        </EActions>
      </EStack>
    </ESurface>

    <ESurface large>
      <EStack :gap="4">
        <EHeading :level="2">Choose a new password</EHeading>
        <EPasswordField v-model="newPassword" label="New password" mode="new" :rules="rules" required />
      </EStack>
    </ESurface>
  </EGrid>
</template>
