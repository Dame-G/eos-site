<script setup lang="ts">
import { ref } from "vue";
import { EDisclosure, EStack, EText } from "@eos-ui/vue";

const open = ref(false);
</script>

<template>
  <EStack>
    <EDisclosure title="History (4)">Paid $162.40 on Oct 22, 2026.</EDisclosure>

    <!-- Starts open -->
    <EDisclosure title="Payment details" :open="true">Visa ending 4242, paid in full.</EDisclosure>

    <!-- Bound, so the page can read the state -->
    <EDisclosure v-model:open="open" title="Itemised charges">Visit $120.00, lab work $42.40.</EDisclosure>
    <p>The itemised charges are {{ open ? "open" : "closed" }}.</p>

    <!-- Card variant, with a note at the right -->
    <EDisclosure variant="card" title="Insurance" meta="Active">Coverage runs to Dec 31, 2026.</EDisclosure>
  </EStack>
</template>
