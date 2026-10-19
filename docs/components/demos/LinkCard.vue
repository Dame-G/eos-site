<script setup lang="ts">
import { EGrid, ELinkCard } from "@eos-ui/vue";

const cards = [
  { title: "Statements", description: "Every statement and receipt, newest first.", kicker: "Billing", href: "#statements" },
  { title: "Visits", description: "Upcoming and past appointments.", kicker: "Care", href: "#visits" },
  { title: "Forms", description: "Sign the forms waiting for you.", kicker: "Paperwork", href: "#forms" },
];
</script>

<template>
  <EGrid as="ul" min="14rem" :gap="3" style="padding: 0; margin: 0; list-style: none">
    <ELinkCard v-for="c in cards" :key="c.title" as="li" v-bind="c" />
  </EGrid>
</template>
