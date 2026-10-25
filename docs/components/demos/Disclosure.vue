<script setup lang="ts">
import { ref } from "vue";
import { EDisclosure, EStack, EText } from "@eos-ui/vue";

const open = ref(false);
</script>

<template>
  <EStack>
    <EDisclosure title="History (4)">Paid $162.40 on Oct 22, 2026.</EDisclosure>

    <EDisclosure title="Payment details" :open="true">Visa ending 4242, paid in full.</EDisclosure>

    <EDisclosure v-model:open="open" title="Itemised charges">Visit $120.00, lab work $42.40.</EDisclosure>
    <EText>The itemised charges are {{ open ? "open" : "closed" }}.</EText>
    <EStack gap="0">
      <EDisclosure group="faq" title="Opening hours">Monday to Friday, 8:00 to 17:00.</EDisclosure>
      <EDisclosure group="faq" title="Parking">Free for the first two hours.</EDisclosure>
      <EDisclosure group="faq">
        <template #title>Getting <em>there</em></template>
        Take the number 12 bus to Elm Street.
      </EDisclosure>
    </EStack>
  </EStack>
</template>
