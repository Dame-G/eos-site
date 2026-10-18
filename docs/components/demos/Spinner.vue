<script setup lang="ts">
import { ESpinner, EStack, ESurface } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <!-- Without a label the ring is read out as "Loading" -->
    <ESpinner />
    <ESpinner label="Processing your payment of $162.40" />
    <ESurface pad="md">
      <ESpinner block label="Checking your statement" />
    </ESurface>
  </EStack>
</template>
