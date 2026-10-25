<script setup lang="ts">
import { EGrid, ELinkCard } from "@eos-ui/vue";
</script>

<template>
  <EGrid as="ul" min="14rem" gap="base">
    <ELinkCard as="li" size="sm" title="Statements" href="#statements">Every statement for the year, with what is due.</ELinkCard>
    <ELinkCard as="li" size="sm" title="Visits" href="#visits">Book, move or cancel a visit.</ELinkCard>
    <ELinkCard as="li" size="sm" title="Help centre" href="https://example.com/help" external>Answers about billing and insurance.</ELinkCard>
  </EGrid>
</template>
