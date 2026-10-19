<script setup lang="ts">
import { ref } from "vue";
import { EAutocomplete, EStack, EText } from "@eos-ui/vue";

const street = ref("");
const city = ref("");
const streets = ["12 Elm Street", "12 Elmwood Avenue", "120 Harbour Road"];
</script>

<template>
  <EStack>
    <EAutocomplete
      v-model="street"
      label="Street"
      autocomplete="address-line1"
      placeholder="Start typing"
      hint="Pick a suggestion or type your own."
      :options="streets"
    />
    <EText variant="small" muted>Text: {{ street || "nothing yet" }}</EText>
    <EAutocomplete v-model="city" label="City" autocomplete="address-level2" :options="['Springfield', 'Shelbyville']" optional />
    <EAutocomplete label="Postal code" :options="['90210']" error="Enter a valid postal code." required />
    <EAutocomplete label="Country" :options="['United States']" disabled />
  </EStack>
</template>
