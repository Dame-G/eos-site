<script setup lang="ts">
import { ELoadingBar, EStack, EText } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <!-- Indeterminate: use it when you cannot say how long the wait is -->
    <ELoadingBar />
    <EText muted>The default label is "Loading".</EText>
    <ELoadingBar label="Loading statements" />
    <EText muted>Fetching your statements for 2026.</EText>
  </EStack>
</template>
