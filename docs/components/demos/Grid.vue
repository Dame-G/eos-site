<script setup lang="ts">
import { ref } from "vue";
import { EGrid, EHeading, ESurface, EStack, ESwitch, EText } from "@eos-ui/vue";

const masonry = ref(false);
</script>

<template>
  <EStack :gap="4">
    <ESwitch v-model="masonry" label="Masonry" />
    <EGrid min="12rem" :gap="3" :masonry="masonry">
      <ESurface as="article" pad="md">
        <EHeading :level="3">September</EHeading>
        <EText>$162.40, paid</EText>
      </ESurface>
      <ESurface as="article" pad="md">
        <EHeading :level="3">October</EHeading>
        <EText>$84.00, due Oct 31, 2026. Insurance has not yet posted its share of the visit, so the amount may drop.</EText>
      </ESurface>
      <ESurface as="article" pad="md">
        <EHeading :level="3">November</EHeading>
        <EText>No charges yet</EText>
      </ESurface>
    </EGrid>
  </EStack>
</template>
