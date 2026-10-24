<script setup lang="ts">
import { ref } from "vue";
import { EPhoneField, EStack, EText } from "@eos-ui/vue";

const mobile = ref("5551234567");
const work = ref("");
</script>

<template>
  <EStack>
    <EPhoneField v-model="mobile" label="Mobile" hint="We text appointment reminders." required />
    <EText size="sm" tone="neutral">Stored as: {{ mobile }}</EText>
    <EPhoneField v-model="work" label="Work phone" format="none" placeholder="+44 20 7946 0958" optional />
    <EPhoneField label="Cell phone" error="Enter a 10 digit phone number." model-value="555 12" />
    <EPhoneField label="Home phone" disabled />
  </EStack>
</template>
