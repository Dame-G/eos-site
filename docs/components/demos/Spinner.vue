<script setup lang="ts">
import { ESpinner, EStack, ESurface } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <ESpinner />
    <ESpinner label="Processing your payment of $162.40" />
    <ESurface>
      <ESpinner block label="Checking your statement" />
    </ESurface>
  </EStack>
</template>
