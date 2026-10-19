<script setup lang="ts">
import { ref } from "vue";
import { ECurrencyField, EStack, EText } from "@eos-ui/vue";

const amount = ref<number | null>(162.4);
const gift = ref<number | null>(null);
</script>

<template>
  <EStack>
    <ECurrencyField v-model="amount" label="Payment amount" :max="500" hint="Up to your $500.00 balance." required />
    <EText variant="small" muted>You will pay: {{ amount ?? "nothing yet" }}</EText>
    <ECurrencyField v-model="gift" label="Extra gift" optional />
    <ECurrencyField label="Montant" currency="EUR" locale="fr-FR" :model-value="42.5" />
    <ECurrencyField label="Refund amount" error="Enter an amount of at least $1.00." :model-value="0" />
    <ECurrencyField label="Amount due" disabled :model-value="162.4" />
  </EStack>
</template>
