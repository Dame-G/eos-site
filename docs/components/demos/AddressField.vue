<script setup lang="ts">
import { ref } from "vue";
import { EAddressField, EStack } from "@eos-ui/vue";
import type { Address } from "@eos-ui/vue";

const billing = ref<Address>({ street: "418 Maple Street", city: "Portland", region: "OR", postal: "97205" });
const shipping = ref<Address>({});
const saved: Address = { street: "9 Elm Court", city: "Austin", region: "TX", postal: "78701" };
</script>

<template>
  <EStack>
    <EAddressField v-model="billing" legend="Billing address" name="billing" />
    <EAddressField
      v-model="shipping"
      legend="Where should we send the statement?"
      name="shipping"
      :errors="{ street: 'Enter a street address.', postal: 'Enter a 5 digit ZIP code.' }"
    />
    <EAddressField legend="Saved address" name="saved" disabled :model-value="saved" />
  </EStack>
</template>
