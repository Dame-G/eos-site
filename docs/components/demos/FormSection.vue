<script setup lang="ts">
import { ref } from "vue";
import { EFormSection, EStack, ETextField } from "@eos-ui/vue";

const name = ref("Ana Ruiz");
const email = ref("");
const cardName = ref("");
</script>

<template>
  <EStack :gap="6">
    <EFormSection title="Your details" description="As they appear on your card.">
      <ETextField v-model="name" label="Name" required />
      <ETextField v-model="email" label="Email" type="email" hint="We send your receipt here." />
    </EFormSection>
    <EFormSection title="How you will pay" description="You can change this later." :heading-level="3" :gap="2">
      <ETextField v-model="cardName" label="Name on card" />
    </EFormSection>
  </EStack>
</template>
