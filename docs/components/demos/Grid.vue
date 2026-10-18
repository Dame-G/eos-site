<script setup lang="ts">
import { EGrid, EHeading, ESurface, EText } from "@eos-ui/vue";
</script>

<template>
  <!-- As many columns as fit, based on the width of the container -->
  <EGrid min="12rem" :gap="3">
    <ESurface as="article" pad="md">
      <EHeading :level="3">September</EHeading>
      <EText>$162.40, paid</EText>
    </ESurface>
    <ESurface as="article" pad="md">
      <EHeading :level="3">October</EHeading>
      <EText>$84.00, due Oct 31, 2026</EText>
    </ESurface>
    <ESurface as="article" pad="md">
      <EHeading :level="3">November</EHeading>
      <EText>No charges yet</EText>
    </ESurface>
  </EGrid>
</template>
