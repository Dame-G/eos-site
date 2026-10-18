<script setup lang="ts">
import { EDivider, EStack, EText } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EText>Pay with a saved card ending 4242.</EText>
    <EDivider />
    <EText>Or choose another way to pay.</EText>
    <EDivider label="Or" />
    <EText>Pay by bank transfer instead.</EText>
  </EStack>
</template>
