<script setup lang="ts">
import { ref } from "vue";
import { EOtpField, EStack } from "@eos-ui/vue";

const code = ref("");
const done = ref("");
const long = ref("");
</script>

<template>
  <EStack>
    <EOtpField v-model="code" label="Sign-in code" hint="We texted a 6 digit code to your phone." @complete="done = $event" />
    <p>{{ done ? `Code ${done} entered.` : "Type or paste the code." }}</p>
    <EOtpField v-model="long" :length="8" type="text" :group-size="4" label="Recovery code" />
    <EOtpField model-value="123" label="Confirm payment code" error="That code has expired. Request a new one." />
    <EOtpField model-value="" label="Locked code" disabled />
  </EStack>
</template>
