<script setup lang="ts">
import { EFieldset, ETextField, EStack } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EFieldset legend="Billing address" required hint="Where we send paper statements.">
      <ETextField label="Street" autocomplete="address-line1" />
      <ETextField label="City" autocomplete="address-level2" />
    </EFieldset>
    <EFieldset legend="Phone numbers" optional bare>
      <ETextField label="Mobile" type="tel" autocomplete="tel" />
      <ETextField label="Home" type="tel" />
    </EFieldset>
    <EFieldset legend="Card details" error="Check the card number and expiry date.">
      <ETextField label="Card number" autocomplete="cc-number" />
      <ETextField label="Expiry" placeholder="MM/YY" autocomplete="cc-exp" />
    </EFieldset>
    <EFieldset legend="Previous address" disabled>
      <ETextField label="Street" model-value="12 Elm Street" />
    </EFieldset>
  </EStack>
</template>
