<script setup lang="ts">
import { EButton, EGrid, EHeading, ESurface, EText } from "@eos-ui/vue";
</script>

<template>
  <EGrid min="12rem" gap="base">
    <ESurface as="article">
      <EHeading :level="3">Default</EHeading>
      <EText>Flat and outlined, with medium padding.</EText>
    </ESurface>
    <ESurface as="article" variant="raised">
      <EHeading :level="3">Raised</EHeading>
      <EText>The lifted shadow of a toast.</EText>
    </ESurface>
    <ESurface as="article">
      <EHeading :level="3">October statement</EHeading>
      <EText>$162.40, due Oct 31, 2026.</EText>
      <template #actions>
        <EButton>Pay</EButton>
        <EButton variant="outline">Details</EButton>
      </template>
    </ESurface>
  </EGrid>
</template>
