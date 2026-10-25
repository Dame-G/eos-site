<script setup lang="ts">
import { EContainer, EHeading, EStack, ESurface, EText } from "@eos-ui/vue";
</script>

<template>
  <EStack gap="section">
    <EContainer size="sm" :gutter="false">
      <ESurface>
        <EHeading :level="3">Small</EHeading>
        <EText>At most 40rem wide, and centred when its parent is wider.</EText>
      </ESurface>
    </EContainer>
    <EContainer size="md" :gutter="false">
      <ESurface>
        <EHeading :level="3">Medium</EHeading>
        <EText>At most 60rem wide.</EText>
      </ESurface>
    </EContainer>
    <EContainer size="full" :gutter="false">
      <ESurface>
        <EHeading :level="3">Full</EHeading>
        <EText>The whole width. Leave the gutter on at the top of a page so content never touches the screen edge.</EText>
      </ESurface>
    </EContainer>
  </EStack>
</template>
