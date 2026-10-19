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

    <EDisclosure variant="card" title="Insurance" meta="Active">Coverage runs to Dec 31, 2026.</EDisclosure>
  </EStack>
</template>
