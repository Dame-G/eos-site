<script setup lang="ts">
import { EButton, EGrid, EHeading, ESurface, EText } from "@eos-ui/vue";
</script>

<template>
  <EGrid min="12rem" :gap="3">
    <ESurface as="article" pad="md">
      <EHeading :level="3">Default</EHeading>
      <EText>Flat and outlined, with medium padding.</EText>
    </ESurface>
    <ESurface as="article" pad="md" tone="tint">
      <EHeading :level="3">Tint</EHeading>
      <EText>A tinted look for secondary blocks.</EText>
    </ESurface>
    <ESurface as="article" pad="md" tone="float">
      <EHeading :level="3">Float</EHeading>
      <EText>The lifted look of a toast.</EText>
    </ESurface>
    <ESurface as="article" pad="md">
      <EHeading :level="3">October statement</EHeading>
      <EText>$162.40, due Oct 31, 2026.</EText>
      <template #actions>
        <EButton>Pay</EButton>
        <EButton variant="outline">Details</EButton>
      </template>
    </ESurface>
  </EGrid>
</template>
